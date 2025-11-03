import { NextRequest } from 'next/server';
import { ApiBase } from '@/lib/api/shared/api-base';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validation
    const requiredFields = ['name', 'email', 'message'];
    const validationResult = ApiBase.validateRequiredFields(body, requiredFields);
    
    if (!validationResult.success) {
      return validationResult.error;
    }

    if (!ApiBase.validateEmail(email)) {
      return ApiBase.error({
        code: 'INVALID_EMAIL',
        message: 'Geçersiz email adresi'
      }, 400);
    }

    // Email gönder - basit versiyon
    const emailContent = `
      <h2>Yeni İletişim Formu Mesajı</h2>
      <p><strong>İsim:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Mesaj:</strong></p>
      <p>${message}</p>
    `;

    // SMTP ayarlarını environment'tan al veya doğrudan kullan
    const smtpSettings = {
      smtp_host: process.env.SMTP_HOST || 'smtp.gmail.com',
      smtp_port: parseInt(process.env.SMTP_PORT || '587'),
      smtp_secure: process.env.SMTP_SECURE === 'true',
      smtp_user: process.env.SMTP_USER || '',
      smtp_password: process.env.SMTP_PASS || '',
      from_email: process.env.SMTP_FROM || 'noreply@busbuskimki.com',
      from_name: 'Büşbüşkimki İletişim Formu'
    };

    // Mevcut email API'sini kullan
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/email/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'info@busbuskimki.com',
        subject: `İletişim Formu: ${name}`,
        body: emailContent,
        smtpSettings
      })
    });

    if (!emailResponse.ok) {
      throw new Error('Email gönderilemedi');
    }

    return ApiBase.success(
      { email, name },
      'Mesajınız başarıyla gönderildi'
    );

  } catch (error) {
    ApiBase.logError(error, 'Contact Form API');
    return ApiBase.error({
      code: 'CONTACT_FORM_ERROR',
      message: 'Mesaj gönderilemedi. Lütfen tekrar deneyin.'
    }, 500);
  }
}

export const runtime = 'nodejs';