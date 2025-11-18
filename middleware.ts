import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/lib/i18n/config';
import { isAdminIpAllowed } from './src/lib/security/ip-whitelist';
import {
  checkAdminAccessRateLimit,
  getClientIp,
} from './src/lib/security/rate-limiter';

// Initialize next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Facebook/Supabase OAuth callback ve data deletion endpoint'leri
  // locale prefix olmadan çalışmak zorunda; next-intl redirect etmesin
  if (
    pathname.startsWith('/auth/callback') ||
    pathname.startsWith('/data-deletion')
  ) {
    return NextResponse.next();
  }

  // 🤖 AI BOT TRACKING - LLMO/GEO Analytics
  const userAgent = request.headers.get('user-agent') || '';
  const aiBots = [
    'GPTBot',
    'ChatGPT-User',
    'ClaudeBot',
    'anthropic-ai',
    'PerplexityBot',
    'Google-Extended',
    'CCBot',
    'cohere-ai',
    'Omgilibot',
    'Bytespider',
  ];

  const detectedBot = aiBots.find(bot => userAgent.includes(bot));
  if (detectedBot) {
    const clientIp = getClientIp(request);
    console.log(
      `🤖 [AI BOT] ${detectedBot} - IP: ${clientIp} - URL: ${pathname}`
    );
  }

  // 🔒 GÜVENLIK: Admin panel koruması
  if (pathname.includes('/pakize')) {
    const locale = pathname.split('/')[1] || 'tr';

    // Auth sayfası hariç tüm pakize rotalarını koru
    if (!pathname.includes('/pakize/auth')) {
      // 1. IP Whitelisting kontrolü
      const clientIp = getClientIp(request);
      if (!isAdminIpAllowed(clientIp)) {
        console.warn(`🚫 Admin Access Denied: IP ${clientIp} not whitelisted`);
        return NextResponse.json(
          {
            error: 'Access Denied',
            message: 'Your IP address is not authorized to access this area.',
            code: 'IP_NOT_WHITELISTED',
          },
          { status: 403 }
        );
      }

      // 2. Rate Limiting kontrolü
      const rateLimitResult = await checkAdminAccessRateLimit(clientIp);
      if (!rateLimitResult.allowed) {
        console.warn(`🚫 Admin Rate Limited: IP ${clientIp}`);
        return NextResponse.json(
          {
            error: 'Too Many Requests',
            message: `Too many requests. Please try again in ${rateLimitResult.retryAfter} seconds.`,
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

      // 3. Session kontrolü (cookie bazlı)
      const sessionToken =
        request.cookies.get('sb-access-token') ||
        request.cookies.get('sb-qtlokdkcerjrbrtphlrh-auth-token');

      if (!sessionToken) {
        console.warn(`🚫 Admin Access Denied: No session for IP ${clientIp}`);
        return NextResponse.redirect(
          new URL(`/${locale}/pakize/auth`, request.url)
        );
      }

      console.log(`✅ Admin Access Allowed: IP ${clientIp}, Path: ${pathname}`);
    }
  }

  // SEO URL rewrites next.config.js'te tanımlı (middleware redirect yerine)
  // Bu sayede 307 redirect yerine direkt içerik gösterilir (Google SEO için daha iyi)
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
