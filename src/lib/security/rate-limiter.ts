/**
 * Rate Limiter Service
 * Brute-force saldırılarına karşı koruma
 */

import { RateLimiterMemory } from 'rate-limiter-flexible';

// Admin login için rate limiter - 15 dakikada 5 deneme
const adminLoginLimiter = new RateLimiterMemory({
  points: 5, // 5 deneme hakkı
  duration: 60 * 15, // 15 dakika
  blockDuration: 60 * 30, // 30 dakika bloke
});

// Admin panel erişimi için rate limiter - dakikada 30 istek
const adminAccessLimiter = new RateLimiterMemory({
  points: 30, // 30 istek
  duration: 60, // 1 dakika
});

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
  remaining?: number;
}

/**
 * Admin login denemelerini sınırla
 */
export async function checkAdminLoginRateLimit(
  ip: string
): Promise<RateLimitResult> {
  try {
    const result = await adminLoginLimiter.consume(ip);
    return {
      allowed: true,
      remaining: result.remainingPoints,
    };
  } catch (error: any) {
    // Rate limit aşıldı
    const retryAfter = error.msBeforeNext
      ? Math.ceil(error.msBeforeNext / 1000)
      : 900; // 15 dakika

    return {
      allowed: false,
      retryAfter,
      remaining: 0,
    };
  }
}

/**
 * Admin panel erişimini sınırla
 */
export async function checkAdminAccessRateLimit(
  ip: string
): Promise<RateLimitResult> {
  try {
    const result = await adminAccessLimiter.consume(ip);
    return {
      allowed: true,
      remaining: result.remainingPoints,
    };
  } catch (error: any) {
    const retryAfter = error.msBeforeNext
      ? Math.ceil(error.msBeforeNext / 1000)
      : 60;

    return {
      allowed: false,
      retryAfter,
      remaining: 0,
    };
  }
}

/**
 * Rate limit penalty'sini sıfırla (başarılı login sonrası)
 */
export async function resetAdminLoginRateLimit(ip: string): Promise<void> {
  try {
    await adminLoginLimiter.delete(ip);
  } catch (error) {
    console.error('Rate limit reset error:', error);
  }
}

/**
 * IP adresini requesten al
 */
export function getClientIp(request: Request): string {
  // Vercel/Cloudflare/proxy arkasındaki gerçek IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwardedFor) {
    const ip = forwardedFor.split(',')[0]?.trim();
    if (ip) return ip;
  }

  return 'unknown';
}
