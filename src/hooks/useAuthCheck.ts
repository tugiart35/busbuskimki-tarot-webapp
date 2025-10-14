/*
 * AUTH CHECK HOOK - CLIENT-SIDE (PRODUCTION-READY)
 *
 * AMAÇ:
 * Serverless API route'u (/api/auth-check) kullanan client-side hook.
 * Protected route kontrolü ve session validation.
 *
 * KULLANIM:
 * ```tsx
 * const { authenticated, user, role, loading, checkAuth } = useAuthCheck();
 *
 * // Component mount'ta otomatik kontrol
 * useEffect(() => {
 *   checkAuth();
 * }, []);
 *
 * // Manuel kontrol
 * const handleProtectedAction = async () => {
 *   const result = await checkAuth('/profile');
 *   if (!result.authenticated) {
 *     router.push('/auth');
 *   }
 * };
 * ```
 *
 * İYİLEŞTİRMELER:
 * - Retry logic (network hatalarında)
 * - Error recovery
 * - Request timeout
 * - Fallback mechanism
 */

import { useState, useCallback } from 'react';

// Retry konfigürasyonu
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000; // 1 saniye
const REQUEST_TIMEOUT = 5000; // 5 saniye

interface AuthCheckResult {
  authenticated: boolean;
  user: {
    id: string;
    email: string;
    role: string;
  } | null;
  role: string;
  hasAccess?: boolean;
  error?: string;
}

interface UseAuthCheckReturn {
  authenticated: boolean;
  user: AuthCheckResult['user'];
  role: string;
  loading: boolean;
  error: string | null;
  checkAuth: (
    _pathname?: string,
    _checkRole?: boolean
  ) => Promise<AuthCheckResult>;
  refetch: () => Promise<void>;
}

export function useAuthCheck(): UseAuthCheckReturn {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthCheckResult['user']>(null);
  const [role, setRole] = useState<string>('guest');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkAuth = useCallback(
    async (pathname?: string, checkRole = false): Promise<AuthCheckResult> => {
      setLoading(true);
      setError(null);

      // Retry logic wrapper
      const attemptFetch = async (retryCount = 0): Promise<AuthCheckResult> => {
        try {
          // Timeout controller
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            REQUEST_TIMEOUT
          );

          const response = await fetch('/api/auth-check', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pathname, checkRole }),
            credentials: 'include',
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            // 5xx errors için retry
            if (response.status >= 500 && retryCount < MAX_RETRIES) {
              await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
              return attemptFetch(retryCount + 1);
            }
            throw new Error(`Auth check failed: ${response.status}`);
          }

          const result: AuthCheckResult = await response.json();

          setAuthenticated(result.authenticated);
          setUser(result.user);
          setRole(result.role);

          return result;
        } catch (err) {
          // Network error için retry
          if (
            retryCount < MAX_RETRIES &&
            err instanceof Error &&
            (err.name === 'AbortError' ||
              err.message.includes('fetch') ||
              err.message.includes('network'))
          ) {
            await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
            return attemptFetch(retryCount + 1);
          }

          throw err;
        }
      };

      try {
        return await attemptFetch();
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Auth check failed';
        setError(errorMessage);
        setAuthenticated(false);
        setUser(null);
        setRole('guest');

        return {
          authenticated: false,
          user: null,
          role: 'guest',
          error: errorMessage,
        };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refetch = useCallback(async () => {
    await checkAuth();
  }, [checkAuth]);

  return {
    authenticated,
    user,
    role,
    loading,
    error,
    checkAuth,
    refetch,
  };
}

// Basit GET version - sadece session check
export async function checkAuthSimple(): Promise<AuthCheckResult> {
  try {
    const response = await fetch('/api/auth-check', {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Auth check failed');
    }

    return await response.json();
  } catch (err) {
    return {
      authenticated: false,
      user: null,
      role: 'guest',
      error: err instanceof Error ? err.message : 'Auth check failed',
    };
  }
}
