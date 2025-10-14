import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './src/lib/i18n/config';
import { isAdminIpAllowed } from './src/lib/security/ip-whitelist';
import {
  checkAdminAccessRateLimit,
  getClientIp,
} from './src/lib/security/rate-limiter';

// SEO-friendly URL mappings
const urlMappings: Record<string, string> = {
  // Turkish
  '/tr/anasayfa': '/tr',
  '/tr/tarot-okuma': '/tr/tarotokumasi',
  '/tr/tarot-reading': '/tr/tarotokumasi', // İngilizce'den geçiş için
  '/tr/giris': '/tr/auth',
  '/tr/panel': '/tr/dashboard',

  // English
  '/en/home': '/en',
  '/en/tarot-reading': '/en/tarotokumasi',
  '/en/tarot-okuma': '/en/tarotokumasi', // Türkçe'den geçiş için
  '/en/numerology': '/en/numeroloji',
  '/en/login': '/en/auth',
  '/en/panel': '/en/dashboard',

  // Serbian
  '/sr/pocetna': '/sr',
  '/sr/tarot-citanje': '/sr/tarotokumasi',
  '/sr/tarot-reading': '/sr/tarotokumasi', // İngilizce'den geçiş için
  '/sr/tarot-okuma': '/sr/tarotokumasi', // Türkçe'den geçiş için
  '/sr/numerologija': '/sr/numeroloji',
  '/sr/prijava': '/sr/auth',
  '/sr/panel': '/sr/dashboard',
};

// Initialize next-intl middleware
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
        // Redirect to auth page
        return NextResponse.redirect(
          new URL(`/${locale}/pakize/auth`, request.url)
        );
      }

      console.log(`✅ Admin Access Allowed: IP ${clientIp}, Path: ${pathname}`);
    }
  }

  // First, apply SEO URL rewrites
  const mapping = urlMappings[pathname];
  if (mapping) {
    return NextResponse.redirect(new URL(mapping, request.url));
  }

  // Handle dynamic routes with parameters
  for (const [pattern, destination] of Object.entries(urlMappings)) {
    if (pathname.startsWith(pattern + '/')) {
      const remainingPath = pathname.slice(pattern.length);
      const url = request.nextUrl.clone();
      url.pathname = destination + remainingPath;
      return NextResponse.redirect(new URL(url.pathname, request.url));
    }
  }

  // Then apply next-intl middleware for locale handling
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - API routes
    // - _next (Next.js internals)
    // - _static (inside /public)
    // - all root files inside /public (e.g. /favicon.ico)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
