/**
 * Admin Login API Route with Rate Limiting
 * /api/pakize/login
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  checkAdminLoginRateLimit,
  resetAdminLoginRateLimit,
  getClientIp,
} from '@/lib/security/rate-limiter';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { success } = body;

    // Get client IP
    const clientIp = getClientIp(request);

    // Başarılı login sonrası rate limit sıfırla
    if (success) {
      await resetAdminLoginRateLimit(clientIp);
      return NextResponse.json({ success: true });
    }

    // Rate limit kontrolü
    const rateLimitResult = await checkAdminLoginRateLimit(clientIp);

    if (!rateLimitResult.allowed) {
      console.warn(
        `🚫 Admin Login Rate Limited: IP ${clientIp}, Retry after ${rateLimitResult.retryAfter}s`
      );

      return NextResponse.json(
        {
          error: 'TOO_MANY_ATTEMPTS',
          message: `Çok fazla başarısız deneme. Lütfen ${Math.ceil(rateLimitResult.retryAfter! / 60)} dakika sonra tekrar deneyin.`,
          retryAfter: rateLimitResult.retryAfter,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitResult.retryAfter),
          },
        }
      );
    }

    // Rate limit OK, login işlemine devam edilebilir
    return NextResponse.json({
      allowed: true,
      remaining: rateLimitResult.remaining,
    });
  } catch (error) {
    console.error('Admin login rate limit error:', error);
    return NextResponse.json(
      { error: 'INTERNAL_ERROR', message: 'Bir hata oluştu.' },
      { status: 500 }
    );
  }
}
