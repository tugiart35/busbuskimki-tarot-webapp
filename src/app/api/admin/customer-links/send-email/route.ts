import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { logger } from '@/lib/logger';
import { emailService } from '@/lib/email/email-service';
import { buildAklindakiKisiInviteHtml } from '@/lib/email/templates';
import {
  SendEmailRequest,
  SendEmailResponse,
} from '@/types/aklindaki-kisi.types';

export async function POST(request: NextRequest) {
  try {
    const body: SendEmailRequest = await request.json();
    const { linkId, customerEmail } = body;

    if (!linkId || !customerEmail) {
      return NextResponse.json<SendEmailResponse>(
        { success: false, error: 'Link ID ve e-posta gereklidir' },
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

    // Cookie'lerden user bilgisini al (createServerClient ile)
    const supabaseClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // API route'larında cookie set edilemez
          },
        },
      }
    );

    let isAdmin = false;

    try {
      // Cookie'lerden user bilgisini al
      const {
        data: { user },
        error: userError,
      } = await supabaseClient.auth.getUser();

      if (user && !userError) {
        // Admin kontrolü
        const { data: adminData } = await supabaseAdmin
          .from('admins')
          .select('user_id')
          .eq('user_id', user.id)
          .single();

        if (adminData) {
          isAdmin = true;
        }
      }
    } catch (error) {
      logger.warn('Admin kontrolü hatası', error, {
        action: 'admin_auth_check',
        resource: 'customer_links',
      });
    }

    if (!isAdmin) {
      return NextResponse.json<SendEmailResponse>(
        {
          success: false,
          error: 'Admin yetkisi gereklidir. Lütfen admin olarak giriş yapın.',
        },
        { status: 403 }
      );
    }

    // Customer link bilgilerini al
    const { data: customerLink, error: linkError } = await supabaseAdmin
      .from('customer_links')
      .select('*')
      .eq('id', linkId)
      .single();

    if (linkError || !customerLink) {
      return NextResponse.json<SendEmailResponse>(
        { success: false, error: 'Link bulunamadı' },
        { status: 404 }
      );
    }

    // Link oluştur
    const baseUrl =
      process.env.NEXT_PUBLIC_READING_LINK_BASE_URL ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      'https://www.busbuskimki.com';
    const locale = 'tr';
    const link = `${baseUrl}/${locale}/aklindaki-kisi?token=${customerLink.token}`;

    // E-posta şablonu oluştur
    const emailHtml = buildAklindakiKisiInviteHtml({
      customerEmail,
      inviteLink: link,
      expiresAt: customerLink.expiry_date || null,
    });

    // E-posta gönder
    const emailSent = await emailService.sendEmail({
      to: customerEmail,
      subject: '💫 Aklındaki Kişi İçin Özel Kart Çekme Linki',
      html: emailHtml,
      text: `Merhaba,\n\nAklındaki kişi için özel kart çekme linkiniz hazır. Linke tıklayarak günde 3 kart çekebilirsiniz.\n\n${link}\n\n${
        customerLink.expiry_date
          ? `Bu link ${new Date(customerLink.expiry_date).toLocaleString('tr-TR')} tarihine kadar geçerlidir.`
          : 'Bu link süresiz geçerlidir.'
      }\n\nSevgiler,\nTarotNumeroloji Ekibi`,
    });

    if (!emailSent) {
      const smtpConfigured =
        process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;

      const errorMessage = smtpConfigured
        ? 'E-posta gönderilemedi. SMTP ayarlarını kontrol edin.'
        : "E-posta gönderilemedi. SMTP ayarları eksik. Lütfen SMTP_HOST, SMTP_USER ve SMTP_PASS environment variable'larını ayarlayın.";

      logger.error('E-posta gönderme hatası', null, {
        action: 'send_email',
        resource: 'customer_links',
        metadata: {
          customerEmail,
          linkId,
          smtpConfigured,
        },
      });

      return NextResponse.json<SendEmailResponse>(
        { success: false, error: errorMessage },
        { status: 500 }
      );
    }

    logger.info('E-posta gönderildi', {
      action: 'send_email',
      resource: 'customer_links',
      metadata: {
        customerEmail,
        linkId,
      },
    });

    return NextResponse.json<SendEmailResponse>({
      success: true,
      message: 'E-posta başarıyla gönderildi',
    });
  } catch (error) {
    logger.error('E-posta gönderme hatası', error, {
      action: 'send_email',
      resource: 'customer_links',
    });

    return NextResponse.json<SendEmailResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'E-posta gönderilemedi',
      },
      { status: 500 }
    );
  }
}
