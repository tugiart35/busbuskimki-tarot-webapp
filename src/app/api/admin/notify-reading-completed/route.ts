import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email/email-service';
import { logger } from '@/lib/logger';

/**
 * Admin'e okuma tamamlandı bildirimi gönder
 * Kullanıcıya email gönderilmez, sadece admin'e bildirim gider
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { readingId } = body;

    if (!readingId) {
      return NextResponse.json(
        { error: 'Reading ID gereklidir' },
        { status: 400 }
      );
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

    // Reading verisini çek
    const { data: readingData, error: readingError } = await supabaseAdmin
      .from('readings')
      .select('*')
      .eq('id', readingId)
      .single();

    if (readingError || !readingData) {
      logger.error('Okuma verisi bulunamadı', readingError, {
        action: 'fetch_reading',
        resource: 'readings',
        metadata: { readingId }, // readingId'yi metadata içine taşı
      });
      return NextResponse.json(
        { error: 'Okuma verisi bulunamadı' },
        { status: 404 }
      );
    }

    // Kullanıcı email adresini al (template'te gösterilmek için)
    let userEmail: string = 'Bilinmiyor';

    // Önce user_id'den email almayı dene
    if (readingData.user_id) {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(
        readingData.user_id
      );
      if (userData?.user?.email) {
        userEmail = userData.user.email;
      }
    }

    // Eğer user_id'den email alınamadıysa, reading_sessions'dan al (token akışı)
    if (userEmail === 'Bilinmiyor') {
      const { data: sessionData } = await supabaseAdmin
        .from('reading_sessions')
        .select('customer_email')
        .eq('reading_id', readingId)
        .single();

      if (sessionData?.customer_email) {
        userEmail = sessionData.customer_email;
      }
    }

    // Admin'e bildirim gönder
    const success = await emailService.sendTarotReadingPDF(
      userEmail, // Template'te gösterilmek için
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
        cost_credits: readingData.cost_credits || 0,
        admin_notes: readingData.admin_notes || '',
        metadata: readingData.metadata || {},
      },
      undefined, // PDF yok
      undefined // File name yok
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Admin bildirimi gönderildi',
      });
    } else {
      logger.error('Admin bildirimi gönderilemedi', null, {
        action: 'notify_admin',
        resource: 'readings',
        metadata: { readingId }, // readingId'yi metadata içine taşı
      });
      return NextResponse.json(
        { error: 'Admin bildirimi gönderilemedi' },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error('Admin bildirimi hatası', error, {
      action: 'notify_admin',
      resource: 'readings',
    });
    return NextResponse.json(
      {
        error: 'Admin bildirimi gönderilemedi',
        message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      },
      { status: 500 }
    );
  }
}
