import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

/**
 * Session'ı tamamlanmış olarak işaretle
 * Token ile okuma kaydedildiğinde çağrılır
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, readingId } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token gereklidir' }, { status: 400 });
    }

    // Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Token hash hesapla
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    // Session bul
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('reading_sessions')
      .select('*')
      .eq('token_hash', tokenHash)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Geçersiz veya bulunamayan token' },
        { status: 404 }
      );
    }

    // Session zaten tamamlanmış mı kontrol et
    // Eğer completed ise ama reading_id yoksa, reading_id'yi güncelle
    const isValidUUID =
      readingId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        readingId
      );

    if (session.status === 'completed') {
      // Session zaten completed ise, reading_id'yi kontrol et
      // Eğer reading_id null ise ve geçerli bir readingId varsa, güncelle
      if (!session.reading_id && isValidUUID && readingId) {
        const { error: updateError } = await supabaseAdmin
          .from('reading_sessions')
          .update({
            reading_id: readingId,
          })
          .eq('id', session.id);

        if (updateError) {
          logger.error('Session reading_id güncelleme hatası', updateError, {
            action: 'update_session_reading_id',
            resource: 'reading_sessions',
          });
        }
      }

      return NextResponse.json({
        success: true,
        message: 'Session zaten tamamlanmış',
        sessionId: session.id,
      });
    }

    // Status'u completed olarak güncelle ve reading_id'yi kaydet
    // UUID format kontrolü (guest-session gibi string'leri filtrele)

    const { error: updateError } = await supabaseAdmin
      .from('reading_sessions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        reading_id: isValidUUID ? readingId : null, // Sadece geçerli UUID ise kaydet
      })
      .eq('id', session.id);

    if (updateError) {
      logger.error('Session güncelleme hatası', updateError, {
        action: 'update_session',
        resource: 'reading_sessions',
      });
      return NextResponse.json(
        { error: 'Session güncellenemedi: ' + updateError.message },
        { status: 500 }
      );
    }

    // Event log kaydet
    await supabaseAdmin.from('reading_events').insert({
      session_id: session.id,
      event_type: 'reading_completed',
      status_after: 'completed',
      actor_type: 'customer',
      message: 'Okuma tamamlandı ve kaydedildi',
      metadata: {
        reading_id: readingId || null,
      },
    });

    // Admin bildirimi oluştur (eğer reading_id varsa)
    if (isValidUUID && readingId) {
      try {
        // Reading bilgilerini çek
        const { data: reading } = await supabaseAdmin
          .from('readings')
          .select('title, reading_type, user_id')
          .eq('id', readingId)
          .single();

        if (reading) {
          // Kullanıcı bilgilerini çek
          let userName = 'Bilinmeyen Kullanıcı';
          let userEmail = null;

          // Önce user_id'den profil bilgilerini al
          if (reading.user_id) {
            const { data: profile } = await supabaseAdmin
              .from('profiles')
              .select('display_name, email')
              .eq('id', reading.user_id)
              .single();

            if (profile) {
              userName = profile.display_name || userName;
              userEmail = profile.email || null;
            }
          }

          // Eğer user_id yoksa, session'dan müşteri bilgilerini al
          if (!reading.user_id && session.customer_email) {
            userName = session.customer_first_name
              ? `${session.customer_first_name} ${session.customer_last_name || ''}`.trim()
              : session.customer_email;
            userEmail = session.customer_email;
          }

          // Admin bildirimi oluştur
          await supabaseAdmin.from('admin_notifications').insert({
            type: 'reading_completed',
            title: 'Yeni Okuma Tamamlandı',
            message: `${userName} tarafından "${reading.title || 'Okuma'}" tamamlandı`,
            metadata: {
              reading_id: readingId,
              reading_type: reading.reading_type,
              user_id: reading.user_id || null,
              user_name: userName,
              user_email: userEmail,
              session_id: session.id,
            },
            read: false,
          });
        }
      } catch (notificationError) {
        // Bildirim oluşturma hatası kritik değil, logla ama işlemi durdurma
        logger.error('Admin bildirimi oluşturma hatası', notificationError, {
          action: 'create_admin_notification',
          resource: 'admin_notifications',
          metadata: { readingId, sessionId: session.id },
        });
      }
    }

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      message: 'Session başarıyla tamamlandı olarak işaretlendi',
    });
  } catch (error) {
    logger.error('Session complete hatası', error, {
      action: 'complete_session',
      resource: 'reading_sessions',
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu',
      },
      { status: 500 }
    );
  }
}
