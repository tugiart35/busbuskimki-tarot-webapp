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
    if (session.status === 'completed') {
      return NextResponse.json({
        success: true,
        message: 'Session zaten tamamlanmış',
        sessionId: session.id,
      });
    }

    // Status'u completed olarak güncelle ve reading_id'yi kaydet
    // UUID format kontrolü (guest-session gibi string'leri filtrele)
    const isValidUUID =
      readingId &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        readingId
      );

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
