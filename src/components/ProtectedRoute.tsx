/*
 * PROTECTED ROUTE COMPONENT (PRODUCTION-READY)
 *
 * AMAÇ:
 * Client-side protected route wrapper.
 * useAuthCheck hook'unu kullanarak auth kontrolü yapar.
 *
 * KULLANIM:
 * ```tsx
 * <ProtectedRoute requiredRole="user" redirectTo="/auth">
 *   <ProfilePage />
 * </ProtectedRoute>
 * ```
 *
 * İYİLEŞTİRMELER:
 * - Error boundary integration
 * - Better loading states
 * - Retry mechanism
 * - Fallback support
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthCheck } from '@/hooks/useAuthCheck';
import { AuthErrorBoundary } from './AuthErrorBoundary';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'guest' | 'user' | 'premium' | 'admin';
  redirectTo?: string;
  fallback?: ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRole = 'user',
  redirectTo,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { authenticated, role, loading, checkAuth } = useAuthCheck();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const performAuthCheck = async () => {
      setIsChecking(true);
      const result = await checkAuth(pathname, true);

      if (!result.authenticated && requiredRole !== 'guest') {
        // Locale'i koru
        const locale = pathname.split('/')[1] || 'tr';
        const redirect = redirectTo || `/${locale}/auth`;
        router.push(redirect);
      } else if (result.authenticated && !result.hasAccess) {
        // Yetkisiz erişim - dashboard'a yönlendir
        const locale = pathname.split('/')[1] || 'tr';
        router.push(`/${locale}/dashboard`);
      }

      setIsChecking(false);
    };

    performAuthCheck();
  }, [pathname, checkAuth, requiredRole, redirectTo, router]);

  // Role hierarchy kontrolü
  const roleHierarchy = ['guest', 'user', 'premium', 'admin'];
  const requiredIndex = roleHierarchy.indexOf(requiredRole);
  const currentIndex = roleHierarchy.indexOf(role);
  const hasRequiredRole = currentIndex >= requiredIndex;

  if (loading || isChecking) {
    return (
      fallback || (
        <div className='flex items-center justify-center min-h-screen'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500'></div>
        </div>
      )
    );
  }

  if (!authenticated && requiredRole !== 'guest') {
    return null;
  }

  if (!hasRequiredRole) {
    return null;
  }

  return <AuthErrorBoundary>{children}</AuthErrorBoundary>;
}

// HOC version - sayfa component'lerini wrap etmek için
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <AuthErrorBoundary>
        <ProtectedRoute {...options}>
          <Component {...props} />
        </ProtectedRoute>
      </AuthErrorBoundary>
    );
  };
}
