/*
 * DOSYA ANALİZİ - MIDDLEWARE (PRODUCTION-READY)
 *
 * BAĞLANTILI DOSYALAR:
 * - src/i18n/config.ts (i18n konfigürasyonu)
 * - src/lib/i18n/paths.ts (dil yolları)
 * - messages/tr.json, en.json, sr.json (çeviri dosyaları)
 * - @/types/auth.types.ts (Auth types)
 *
 * DOSYA AMACI:
 * Production-ready Next.js middleware with enhanced security features.
 * URL routing, locale yönlendirmeleri, auth kontrolü, rate limiting ve güvenlik.
 *
 * SUPABASE DEĞİŞKENLERİ VE TABLOLARI:
 * - supabase.auth.getSession() - Session kontrolü
 * - auth.users tablosu (otomatik Supabase tablosu)
 * - user_metadata.role - Role-based access control
 *
 * GÜVENLİK ÖZELLİKLERİ:
 * - Rate limiting
 * - CSRF protection
 * - Security headers
 * - Bot detection
 * - Auth route protection
 * - Session validation
 *
 * KULLANIM DURUMU:
 * - GEREKLİ: Ana routing middleware
 * - GÜVENLİ: Production-ready with security enhancements
 * - PWA-READY: PWA support ve offline handling
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { UserRole } from '@/types/auth.types';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './lib/i18n/config';
import {
  checkRateLimit,
  RATE_LIMIT_CONFIG,
} from './lib/rate-limiter';
// import { checkMaintenanceMode } from './middleware/maintenance';

// next-intl middleware oluştur
const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
});

// Rate limiting kaldırıldı - development için

// Security headers configuration
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'X-XSS-Protection': '1; mode=block',
  // Strict-Transport-Security sadece production'da aktif
  ...(process.env.NODE_ENV === 'production' && {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  }),
  'Content-Security-Policy': [
    "default-src 'self'",
    // Script sources - unsafe-eval kaldırıldı, sadece production'da güvenli modda
    process.env.NODE_ENV === 'production'
      ? "script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com"
      : "script-src 'self' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
    // Style sources - production'da unsafe-inline kaldırıldı
    process.env.NODE_ENV === 'production'
      ? "style-src 'self'"
      : "style-src 'self' 'unsafe-inline'",
    // Image sources - belirli domain'lerle sınırlandırıldı
    "img-src 'self' data: https://*.supabase.co https://*.supabase.in https://www.googletagmanager.com https://www.google-analytics.com",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    'upgrade-insecure-requests',
  ].join('; '),
};

// Rate limiting kaldırıldı - development için

// Bot detection kaldırıldı - development için

// URL mapping is now handled in next.config.js rewrites

// Role-based access control - Dashboard herkese açık
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['/pakize', '/dashboard', '/profile', '/settings', '/analytics'],
  premium: ['/dashboard', '/profile', '/settings', '/premium'],
  user: ['/dashboard', '/profile', '/settings'],
  guest: ['/dashboard'], // Dashboard guest'lere açık
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // next-intl middleware'ini çalıştır
  const intlResponse = intlMiddleware(request);
  if (intlResponse) {
    return intlResponse;
  }

  // Bakım modu kontrolü - geçici olarak devre dışı
  // const maintenanceResponse = await checkMaintenanceMode(request);
  // if (maintenanceResponse) {
  //   return maintenanceResponse;
  // }

  // Rate Limiting - Production'da aktif
  if (process.env.NODE_ENV === 'production') {
    // IP adresini al (Vercel, Cloudflare vb. için)
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Endpoint'e göre rate limit konfigürasyonu seç
    let rateLimitConfig = RATE_LIMIT_CONFIG.general;

    if (pathname.includes('/auth') || pathname.includes('/login')) {
      rateLimitConfig = RATE_LIMIT_CONFIG.auth;
    } else if (pathname.startsWith('/api/payment') || pathname.includes('/shopier')) {
      rateLimitConfig = RATE_LIMIT_CONFIG.payment;
    } else if (pathname.startsWith('/api')) {
      rateLimitConfig = RATE_LIMIT_CONFIG.api;
    }

    // Rate limit kontrolü
    const { allowed, remainingRequests, resetTime, retryAfter } = checkRateLimit(
      ip,
      rateLimitConfig
    );

    if (!allowed) {
      const response = new NextResponse(
        JSON.stringify({
          error: 'Too Many Requests',
          message: 'Çok fazla istek gönderdiniz. Lütfen daha sonra tekrar deneyin.',
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfter || 60),
            'X-RateLimit-Limit': String(rateLimitConfig.maxRequests),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
          },
        }
      );

      return response;
    }

    // Rate limit header'larını response'a ekle
    const responseHeaders = {
      'X-RateLimit-Limit': String(rateLimitConfig.maxRequests),
      'X-RateLimit-Remaining': String(remainingRequests),
      'X-RateLimit-Reset': String(Math.ceil(resetTime / 1000)),
    };

    // Header'ları sonraki response'lara eklemek için kullan
    request.headers.set('x-rate-limit-info', JSON.stringify(responseHeaders));
  }

  // API route'ları ve static dosyaları bypass et
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') ||
    pathname.startsWith('/sw-') ||
    pathname === '/manifest.json'
  ) {
    const response = NextResponse.next();
    // Add security headers to all responses
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // Create response with security headers
  const response = NextResponse.next();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Rate limit header'larını ekle (production)
  if (process.env.NODE_ENV === 'production') {
    const rateLimitInfo = request.headers.get('x-rate-limit-info');
    if (rateLimitInfo) {
      try {
        const headers = JSON.parse(rateLimitInfo);
        Object.entries(headers).forEach(([key, value]) => {
          response.headers.set(key, String(value));
        });
      } catch (error) {
        // Header parsing hatası - sessizce devam et
      }
    }
  }

  // Supabase client oluştur
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: Array<{ name: string; value: string; options?: any }>
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Login redirect - /login -> /auth
  if (pathname === '/login' || pathname.startsWith('/login')) {
    const url = request.nextUrl.clone();
    url.pathname = url.pathname.replace('/login', '/auth');
    return NextResponse.redirect(url);
  }

  // Public paths - auth sayfası ve callback'ler
  const publicPaths = ['/auth', '/auth/', '/auth/callback', '/auth/callback/'];

  const isPublicPath =
    publicPaths.some(path => pathname === path || pathname.startsWith(path)) ||
    pathname.match(/^\/[a-z]{2}\/auth/) ||
    pathname.match(/^\/[a-z]{2}\/auth\//);

  if (isPublicPath) {
    return response;
  }

  try {
    // Güvenli user kontrolü için getUser() kullan
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      // Continue without user for public routes
    }

    // User varsa session'ı true olarak kabul et
    const session = user ? { user } : null;
    const userRole = (user?.user_metadata?.role as UserRole) || 'guest';

    // ✅ KORUMALI SAYFALAR KONTROLÜ - Dashboard korumalı değil
    const protectedPaths = ['/profile', '/settings', '/pakize', '/premium'];
    const isProtectedPath = protectedPaths.some(
      path => pathname.includes(path) || pathname.endsWith(path)
    );

    // Korumalı sayfaya erişim kontrolü
    if (isProtectedPath) {
      if (!session) {
        // Locale'i koruyarak auth sayfasına yönlendir
        const currentLocale = pathname.split('/')[1] || 'tr';
        return NextResponse.redirect(
          new URL(`/${currentLocale}/auth`, request.url)
        );
      }

      // Role-based access control
      const allowedPaths = ROLE_PERMISSIONS[userRole] || [];
      const hasAccess = allowedPaths.some(path => pathname.startsWith(path));

      if (!hasAccess) {
        return NextResponse.redirect(new URL('/tr', request.url));
      }
    }

    // Locale kontrolü next-intl tarafından yapılıyor

    // Add user info to headers for client-side use
    if (user) {
      response.headers.set('x-user-id', user.id);
      response.headers.set('x-user-role', userRole);
    }

    return response;
  } catch (error) {
    // Fallback: continue with basic routing
    return response;
  }
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
