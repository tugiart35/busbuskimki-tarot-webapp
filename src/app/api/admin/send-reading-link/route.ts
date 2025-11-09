import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { buildInviteEmailHtml } from '@/lib/email/templates';
import { emailService } from '@/lib/email/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      readingLink,
      customerEmail,
      customerName,
      spreadName,
    } = body;

    if (!sessionId || !readingLink || !customerEmail) {
      return NextResponse.json(
        { error: 'Session ID, link ve e-posta gereklidir' },
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

    // Session bilgilerini al (expires_at için)
    const { data: session } = await supabaseAdmin
      .from('reading_sessions')
      .select('expires_at')
      .eq('id', sessionId)
      .single();

    // Email template oluştur
    const emailHtml = buildInviteEmailHtml({
      customerName: customerName || null,
      spreadName: spreadName || null,
      inviteLink: readingLink,
      expiresAt: session?.expires_at || null,
    });

    // Email gönder
    const emailSent = await emailService.sendEmail({
      to: customerEmail,
      subject: '🔮 Size Özel Tarot Okuma Daveti',
      html: emailHtml,
      text: `Merhaba ${customerName || 'Değerli Müşterimiz'},\n\nSize özel bir tarot okuması hazırladık. Okumaya başlamak için aşağıdaki linke tıklayın:\n\n${readingLink}\n\nBu link ${session?.expires_at ? new Date(session.expires_at).toLocaleString('tr-TR') : 'kısa süre içinde'} geçerliliğini yitirecektir.\n\nSevgiler,\nTarotNumeroloji Ekibi`,
    });

    if (!emailSent) {
      // SMTP ayarlarını kontrol et
      const smtpConfigured =
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS;

      const errorMessage = smtpConfigured
        ? 'E-posta gönderilemedi. SMTP ayarlarını kontrol edin.'
        : 'E-posta gönderilemedi. SMTP ayarları eksik. Lütfen SMTP_HOST, SMTP_USER ve SMTP_PASS environment variable\'larını ayarlayın.';

      console.error('Email gönderme hatası:', {
        customerEmail,
        sessionId,
        smtpConfigured,
        smtpHost: process.env.SMTP_HOST ? '✓' : '✗',
        smtpUser: process.env.SMTP_USER ? '✓' : '✗',
        smtpPass: process.env.SMTP_PASS ? '✓' : '✗',
      });

      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }

    // Event log kaydet
    await supabaseAdmin.from('reading_events').insert({
      session_id: sessionId,
      event_type: 'email_sent',
      actor_type: 'system',
      message: 'Davet e-postası gönderildi',
      metadata: {
        recipient: customerEmail,
      },
    });

    // last_email_sent_at güncelle
    await supabaseAdmin
      .from('reading_sessions')
      .update({ last_email_sent_at: new Date().toISOString() })
      .eq('id', sessionId);

    return NextResponse.json({
      success: true,
      message: 'E-posta başarıyla gönderildi',
    });
  } catch (error) {
    console.error('E-posta gönderme hatası:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'E-posta gönderilemedi',
      },
      { status: 500 }
    );
  }
}

