/*
 * DOSYA ANALİZİ - SEND READING EMAIL API ENDPOINT
 *
 * BAĞLANTILI DOSYALAR:
 * - src/features/tarot/components/shared/utils/TarotReadingSaver.tsx (okuma kaydetme)
 * - src/lib/email/email-service.ts (email gönderme servisi)
 * - src/lib/pdf/pdf-generator.ts (PDF oluşturma servisi)
 *
 * DOSYA AMACI:
 * Server-side email gönderimi - Puppeteer ile PDF oluşturma
 * Client-side'dan gelen istekleri işler
 *
 * KULLANIM DURUMU:
 * - PRODUCTION: Gerçek okuma email gönderimi
 * - GÜVENLİ: Server-side PDF oluşturma
 */

import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/email-service';
import { pdfGeneratorService } from '@/lib/pdf/pdf-generator';
import { createClient } from '@supabase/supabase-js';
import { ErrorResponse } from '@/lib/api/error-responses';
import { EmailCORS } from '@/lib/api/email-cors';
import { logger } from '@/lib/logger';

// POST endpoint - Send reading email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { readingId } = body;

    if (!readingId) {
      return EmailCORS.wrapResponse(
        ErrorResponse.missingFieldsError(['readingId'])
      );
    }

    // Server-side Supabase client oluştur (service role ile)
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

    // Supabase'den gerçek okuma verisini çek
    const { data: readingData, error: readingError } = await supabaseAdmin
      .from('readings')
      .select('*')
      .eq('id', readingId)
      .single();

    if (readingError || !readingData) {
      logger.error('Okuma verisi bulunamadı', readingError, {
        action: 'fetch_reading',
        resource: 'readings',
      });
      return EmailCORS.wrapResponse(
        ErrorResponse.notFoundError('Okuma verisi')
      );
    }

    // Kullanıcı email adresini al
    let userEmail: string | null = null;

    // Önce user_id'den email almayı dene
    if (readingData.user_id) {
      const { data: userData, error: userError } =
        await supabaseAdmin.auth.admin.getUserById(readingData.user_id);
      if (!userError && userData.user?.email) {
        userEmail = userData.user.email;
      }
    }

    // Eğer user_id'den email alınamadıysa, reading_sessions'dan al (token akışı)
    if (!userEmail) {
      // reading_id ile reading_sessions'dan customer_email'i bul
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from('reading_sessions')
        .select('customer_email')
        .eq('reading_id', readingId)
        .single();

      if (!sessionError && sessionData?.customer_email) {
        userEmail = sessionData.customer_email;
      }
    }

    if (!userEmail) {
      logger.error('Kullanıcı email adresi alınamadı', null, {
        action: 'fetch_user_email',
        resource: 'readings',
        metadata: {
          readingId,
          checkedUserId: !!readingData.user_id,
        },
      });
      return EmailCORS.wrapResponse(
        ErrorResponse.notFoundError('Kullanıcı email adresi')
      );
    }

    // PDF oluştur - Hata durumunda PDF olmadan devam et
    let pdfBuffer: Buffer | null = null;
    let fileName: string | null = null;

    try {
      const pdfData = {
        id: readingData.id,
        reading_type: readingData.reading_type,
        title: readingData.title || 'Tarot Açılımı',
        spread_name: readingData.spread_name || '',
        cards: readingData.cards || [],
        interpretation: readingData.interpretation || '',
        questions: readingData.questions || {},
        status: readingData.status || 'completed',
        created_at: readingData.created_at || new Date().toISOString(),
        cost_credits: readingData.cost_credits || 50,
        admin_notes: readingData.admin_notes || '',
      };

      pdfBuffer = await pdfGeneratorService.generateReadingPDF(pdfData);
      fileName = `tarot-okuma-${readingId.slice(0, 8)}-${new Date().toISOString().split('T')[0]}.pdf`;
    } catch (pdfError) {
      // PDF oluşturma hatası - PDF olmadan devam et
      logger.warn(
        'PDF oluşturulamadı, PDF olmadan email gönderilecek',
        pdfError,
        {
          action: 'generate_pdf',
          resource: 'readings',
        }
      );
      // pdfBuffer null kalacak, email servisi PDF olmadan gönderecek
    }

    // Email gönder - PDF varsa ekle, yoksa PDF olmadan gönder
    const success = await emailService.sendTarotReadingPDF(
      userEmail,
      {
        id: readingData.id,
        reading_type: readingData.reading_type,
        title: readingData.title || 'Tarot Açılımı',
        spread_name: readingData.spread_name || '',
        cards: readingData.cards || [],
        interpretation: readingData.interpretation || '',
        questions: readingData.questions || {},
        status: readingData.status || 'completed',
        created_at: readingData.created_at || new Date().toISOString(),
        cost_credits: readingData.cost_credits || 50,
        admin_notes: readingData.admin_notes || '',
      },
      pdfBuffer || undefined, // PDF yoksa undefined
      fileName || undefined
    );

    if (success) {
      return EmailCORS.wrapResponse(
        NextResponse.json({
          success: true,
          message: 'Email başarıyla gönderildi',
          timestamp: new Date().toISOString(),
          recipient: userEmail,
          fileName: fileName,
        })
      );
    } else {
      logger.error('Email gönderimi başarısız', null, {
        action: 'send_email',
        resource: 'readings',
        metadata: { readingId, recipient: userEmail },
      });
      return EmailCORS.wrapResponse(
        ErrorResponse.smtpConnectionError('Email gönderimi başarısız')
      );
    }
  } catch (error) {
    logger.error('Server-side email gönderimi hatası', error, {
      action: 'send_email',
      resource: 'readings',
    });
    return EmailCORS.wrapResponse(
      ErrorResponse.internalServerError(
        error instanceof Error ? error.message : 'Bilinmeyen hata'
      )
    );
  }
}

// OPTIONS endpoint - CORS preflight
export async function OPTIONS(_request: NextRequest) {
  return EmailCORS.handlePreflightRequest();
}

export const runtime = 'nodejs';
