/*
 * AUTH CHECK API ROUTE - SERVERLESS (PRODUCTION-READY)
 *
 * AMAÇ:
 * Middleware'den taşınan ağır Supabase auth ve session kontrollerini yapar.
 * Edge runtime yerine Node.js runtime'da çalışır (limit yok).
 *
 * KULLANIM:
 * - Client-side'da protected route kontrolü
 * - Session validation
 * - Role-based access control
 *
 * İYİLEŞTİRMELER:
 * - Environment validation
 * - Error handling
 * - Response caching headers
 * - Performance optimization
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { UserRole } from '@/types/auth.types';

// Environment validation
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // Missing environment variables - will be handled in requests
}

// Role-based access control mapping
const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['/pakize', '/dashboard', '/profile', '/settings', '/analytics'],
  premium: ['/dashboard', '/profile', '/settings', '/premium'],
  user: ['/dashboard', '/profile', '/settings'],
  guest: ['/dashboard'], // Dashboard guest'lere açık
};

export async function POST(request: NextRequest) {
  try {
    // Environment check
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          role: 'guest',
          error: 'Service configuration error',
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { pathname, checkRole = false } = body;

    // Supabase client oluştur (serverless'ta sınır yok)
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Response cookie'leri client'ta set edilecek
        },
      },
    });

    // User bilgisini al
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          role: 'guest',
          hasAccess: false,
        },
        { status: 200 }
      );
    }

    const userRole = (user.user_metadata?.role as UserRole) || 'guest';

    // Role-based access kontrolü (isteğe bağlı)
    let hasAccess = true;
    if (checkRole && pathname) {
      const protectedPaths = ['/profile', '/settings', '/pakize', '/premium'];
      const isProtectedPath = protectedPaths.some(
        path => pathname.includes(path) || pathname.endsWith(path)
      );

      if (isProtectedPath) {
        const allowedPaths = ROLE_PERMISSIONS[userRole] || [];
        hasAccess = allowedPaths.some(path => pathname.startsWith(path));
      }
    }

    const response = NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: userRole,
        },
        role: userRole,
        hasAccess,
      },
      { status: 200 }
    );

    // Cache kontrolü - kısa süreli cache (10 saniye)
    response.headers.set(
      'Cache-Control',
      'private, max-age=10, stale-while-revalidate=30'
    );

    return response;
  } catch (error) {
    // Silent error handling for production
    return NextResponse.json(
      {
        authenticated: false,
        user: null,
        role: 'guest',
        hasAccess: false,
        error: 'Auth check failed',
      },
      { status: 500 }
    );
  }
}

// GET endpoint - basit session check (optimized)
export async function GET(request: NextRequest) {
  try {
    // Environment check
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return NextResponse.json(
        {
          authenticated: false,
          user: null,
          role: 'guest',
          error: 'Service configuration error',
        },
        { status: 503 }
      );
    }

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // Response cookie'leri client'ta set edilecek
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { authenticated: false, user: null, role: 'guest' },
        { status: 200 }
      );
    }

    const userRole = (user.user_metadata?.role as UserRole) || 'guest';

    const response = NextResponse.json(
      {
        authenticated: true,
        user: {
          id: user.id,
          email: user.email,
          role: userRole,
        },
        role: userRole,
      },
      { status: 200 }
    );

    // Cache kontrolü - GET için biraz daha uzun cache (30 saniye)
    response.headers.set(
      'Cache-Control',
      'private, max-age=30, stale-while-revalidate=60'
    );

    return response;
  } catch (error) {
    // Silent error handling for production
    return NextResponse.json(
      { authenticated: false, user: null, role: 'guest' },
      { status: 200 }
    );
  }
}

// Runtime configuration - Node.js (serverless)
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // Her request'te yeniden hesapla
