import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { logger } from '@/lib/logger';
import { emailService } from '@/lib/email/email-service';

/**
 * Token ile reading kaydetme
 * Client-side'dan authenticated olmadan reading kaydetmek için kullanılır
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      token,
      readingData,
      formPayload,
      communicationMethod,
      personalInfo,
    } = body;

    if (!token) {
      return NextResponse.json({ error: 'Token gereklidir' }, { status: 400 });
    }

    if (!readingData) {
      return NextResponse.json(
        { error: 'Reading verisi gereklidir' },
        { status: 400 }
      );
    }

    // Supabase admin client (service role key ile authenticated)
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

    // Session'ı validate et
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
      return NextResponse.json(
        { error: 'Bu okuma zaten tamamlanmış' },
        { status: 400 }
      );
    }

    // Reading'i kaydet (user_id null, cost_credits 0)
    const readingTypeToInsert = readingData.readingType;

    // Debug: reading_type değerini logla
    logger.info('Reading kaydediliyor', {
      action: 'save_reading',
      resource: 'readings',
      metadata: {
        readingType: readingTypeToInsert,
        spreadName: readingData.spread_name || readingData.spreadName,
        sessionId: session.id,
      },
    });

    const { data: insertResult, error: insertError } = await supabaseAdmin
      .from('readings')
      .insert({
        user_id: null,
        reading_type: readingTypeToInsert,
        spread_name: readingData.spread_name || readingData.spreadName,
        title: readingData.title,
        interpretation: readingData.interpretation || '',
        cards: readingData.cards?.selectedCards || readingData.cards || [],
        questions: readingData.questions || {},
        cost_credits: 0,
        metadata: {
          ...readingData.metadata,
          communicationMethod,
          personalInfo: {
            ...personalInfo,
            phoneProvided: !!personalInfo?.phone,
          },
        },
        status: 'completed',
        contact_method: communicationMethod,
        phone: communicationMethod === 'whatsapp' ? personalInfo?.phone : null,
      })
      .select()
      .single();

    if (insertError) {
      logger.error('Reading insert hatası', insertError, {
        action: 'save_reading',
        resource: 'readings',
        metadata: {
          token: tokenHash.slice(0, 8) + '...',
          readingType: readingTypeToInsert,
          errorMessage: insertError.message,
          errorCode: insertError.code,
          errorDetails: insertError.details,
        },
      });
      return NextResponse.json(
        {
          error: 'Okuma kaydedilemedi',
          message: insertError.message,
        },
        { status: 500 }
      );
    }

    // Form verilerini reading_form_responses tablosuna kaydet
    if (formPayload && session.id) {
      await supabaseAdmin.from('reading_form_responses').upsert(
        {
          session_id: session.id,
          payload: formPayload,
          completed_at: new Date().toISOString(),
        },
        {
          onConflict: 'session_id',
        }
      );
    }

    // Session'ı completed olarak işaretle (atomic işlem - reading kaydedildikten sonra)
    // Bu sayede veri tutarlılığı sağlanır: reading varsa session mutlaka completed olmalı
    const isValidUUID =
      insertResult?.id &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        insertResult.id
      );

    // Session zaten completed ise sadece reading_id'yi güncelle
    // Değilse status'u completed yap ve reading_id'yi kaydet
    const updateData: any = {
      reading_id: isValidUUID ? insertResult.id : null,
    };

    // Eğer session henüz completed değilse, status ve completed_at'i de güncelle
    if (session.status !== 'completed') {
      updateData.status = 'completed';
      updateData.completed_at = new Date().toISOString();
    }

    // Debug: session update öncesi log
    logger.info('Session güncelleniyor', {
      action: 'update_session',
      resource: 'reading_sessions',
      metadata: {
        sessionId: session.id,
        readingId: insertResult?.id,
        updateData,
        currentStatus: session.status,
      },
    });

    const { error: sessionUpdateError } = await supabaseAdmin
      .from('reading_sessions')
      .update(updateData)
      .eq('token_hash', tokenHash);

    if (sessionUpdateError) {
      // Session güncelleme başarısız oldu - reading'i sil (rollback)
      logger.error(
        'Session güncelleme hatası - reading rollback',
        sessionUpdateError,
        {
          action: 'update_session',
          resource: 'reading_sessions',
          metadata: {
            readingId: insertResult?.id,
            sessionId: session.id,
            errorMessage: sessionUpdateError.message,
            errorCode: sessionUpdateError.code,
            errorDetails: sessionUpdateError.details,
            updateData,
          },
        }
      );

      // Reading'i sil
      await supabaseAdmin.from('readings').delete().eq('id', insertResult.id);

      return NextResponse.json(
        {
          error: 'Okuma kaydedildi ancak session tamamlanamadı',
          message: 'Lütfen tekrar deneyin',
        },
        { status: 500 }
      );
    }

    // Debug: session update başarılı
    logger.info('Session başarıyla güncellendi', {
      action: 'update_session',
      resource: 'reading_sessions',
      metadata: {
        sessionId: session.id,
        readingId: insertResult?.id,
        newStatus: 'completed',
      },
    });

    // Event log kaydet
    await supabaseAdmin.from('reading_events').insert({
      session_id: session.id,
      event_type: 'reading_completed',
      status_after: 'completed',
      actor_type: 'customer',
      message: 'Okuma tamamlandı ve kaydedildi',
      metadata: {
        reading_id: insertResult?.id || null,
      },
    });

    // Admin'e bildirim gönder (arka planda, hata olsa bile devam et)
    if (insertResult?.id) {
      // Kullanıcı email adresini al (template'te gösterilmek için)
      const userEmailForTemplate: string =
        personalInfo?.email || session.customer_email || 'Bilinmiyor';

      // Admin'e okuma özeti gönder
      emailService
        .sendTarotReadingPDF(
          userEmailForTemplate,
          {
            id: insertResult.id,
            reading_type: readingData.readingType,
            title: readingData.title,
            spread_name: readingData.spread_name || readingData.spreadName,
            cards: readingData.cards?.selectedCards || readingData.cards || [],
            interpretation: readingData.interpretation || '',
            questions: readingData.questions || {},
            status: 'completed',
            created_at: insertResult.created_at || new Date().toISOString(),
            cost_credits: 0,
            admin_notes: '',
            metadata: readingData.metadata || {},
          },
          undefined, // PDF yok
          undefined // File name yok
        )
        .catch(error => {
          // Admin bildirimi başarısız olsa bile okuma kaydedildi, sessizce devam et
          logger.warn('Admin bildirimi gönderilemedi', error, {
            action: 'notify_admin',
            resource: 'readings',
            metadata: { readingId: insertResult.id },
          });
        });
    }

    return NextResponse.json({
      success: true,
      id: insertResult?.id,
      userId: null,
      reading: insertResult,
    });
  } catch (error) {
    logger.error('Token reading save hatası', error, {
      action: 'save_reading',
      resource: 'readings',
    });
    return NextResponse.json(
      {
        error: 'Okuma kaydedilemedi',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    );
  }
}
