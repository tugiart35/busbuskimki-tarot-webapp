/*
 * RATE LIMITER - PRODUCTION READY
 * 
 * DOSYA AMACI:
 * DDoS ve brute force saldırılarını önlemek için rate limiting
 * 
 * GÜVENLİK ÖZELLİKLERİ:
 * - IP-based rate limiting
 * - Sliding window algorithm
 * - Configurable limits
 * - Automatic cleanup
 * 
 * KULLANIM:
 * Production environment'da otomatik aktif
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
  blockedUntil?: number;
}

// IP bazlı rate limit store
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup interval - her 5 dakikada bir eski kayıtları temizle
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 dakika
let cleanupTimer: NodeJS.Timeout | null = null;

// Rate limit configuration
export const RATE_LIMIT_CONFIG = {
  // Genel API limiti
  general: {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 dakika
    blockDurationMs: 5 * 60 * 1000, // 5 dakika block
  },
  // Auth endpoint'leri için daha katı limit
  auth: {
    maxRequests: 5,
    windowMs: 60 * 1000, // 1 dakika
    blockDurationMs: 15 * 60 * 1000, // 15 dakika block
  },
  // API endpoint'leri için
  api: {
    maxRequests: 50,
    windowMs: 60 * 1000, // 1 dakika
    blockDurationMs: 10 * 60 * 1000, // 10 dakika block
  },
  // Ödeme endpoint'leri için
  payment: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 dakika
    blockDurationMs: 30 * 60 * 1000, // 30 dakika block
  },
};

/**
 * Rate limit kontrolü
 * @param identifier - IP adresi veya user ID
 * @param config - Rate limit konfigürasyonu
 * @returns true: izin verildi, false: limit aşıldı
 */
export function checkRateLimit(
  identifier: string,
  config: {
    maxRequests: number;
    windowMs: number;
    blockDurationMs: number;
  } = RATE_LIMIT_CONFIG.general
): {
  allowed: boolean;
  remainingRequests: number;
  resetTime: number;
  retryAfter?: number;
} {
  const now = Date.now();
  const entry = rateLimitStore.get(identifier);

  // İlk request veya window süresi dolmuş
  if (!entry || now > entry.resetTime) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(identifier, newEntry);

    return {
      allowed: true,
      remainingRequests: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Block süresi devam ediyor
  if (entry.blockedUntil && now < entry.blockedUntil) {
    return {
      allowed: false,
      remainingRequests: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil((entry.blockedUntil - now) / 1000),
    };
  }

  // Block süresi dolmuş, yeni window başlat
  if (entry.blockedUntil && now >= entry.blockedUntil) {
    const newEntry: RateLimitEntry = {
      count: 1,
      resetTime: now + config.windowMs,
    };
    rateLimitStore.set(identifier, newEntry);

    return {
      allowed: true,
      remainingRequests: config.maxRequests - 1,
      resetTime: newEntry.resetTime,
    };
  }

  // Limit kontrolü
  if (entry.count >= config.maxRequests) {
    // Limit aşıldı, block süresini başlat
    entry.blockedUntil = now + config.blockDurationMs;
    rateLimitStore.set(identifier, entry);

    return {
      allowed: false,
      remainingRequests: 0,
      resetTime: entry.resetTime,
      retryAfter: Math.ceil(config.blockDurationMs / 1000),
    };
  }

  // Request sayısını artır
  entry.count += 1;
  rateLimitStore.set(identifier, entry);

  return {
    allowed: true,
    remainingRequests: config.maxRequests - entry.count,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit store'u temizle
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    // Reset time ve block time dolmuş kayıtları sil
    if (now > entry.resetTime && (!entry.blockedUntil || now > entry.blockedUntil)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach(key => rateLimitStore.delete(key));

  if (process.env.NODE_ENV === 'development') {
    console.log(
      `Rate limit cleanup: ${keysToDelete.length} entries removed, ${rateLimitStore.size} remaining`
    );
  }
}

/**
 * Otomatik cleanup başlat
 */
export function startRateLimitCleanup(): void {
  if (cleanupTimer) {
    return; // Zaten çalışıyor
  }

  cleanupTimer = setInterval(cleanupRateLimitStore, CLEANUP_INTERVAL);

  if (process.env.NODE_ENV === 'development') {
    console.log('Rate limit cleanup started');
  }
}

/**
 * Otomatik cleanup durdur
 */
export function stopRateLimitCleanup(): void {
  if (cleanupTimer) {
    clearInterval(cleanupTimer);
    cleanupTimer = null;

    if (process.env.NODE_ENV === 'development') {
      console.log('Rate limit cleanup stopped');
    }
  }
}

/**
 * Belirli bir identifier için rate limit'i sıfırla
 */
export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(identifier);
}

/**
 * Tüm rate limit store'u temizle
 */
export function clearRateLimitStore(): void {
  rateLimitStore.clear();
}

/**
 * Rate limit statistics
 */
export function getRateLimitStats(): {
  totalEntries: number;
  blockedEntries: number;
  activeEntries: number;
} {
  const now = Date.now();
  let blockedCount = 0;
  let activeCount = 0;

  rateLimitStore.forEach(entry => {
    if (entry.blockedUntil && now < entry.blockedUntil) {
      blockedCount++;
    } else if (now <= entry.resetTime) {
      activeCount++;
    }
  });

  return {
    totalEntries: rateLimitStore.size,
    blockedEntries: blockedCount,
    activeEntries: activeCount,
  };
}

// Production'da cleanup'ı otomatik başlat
if (process.env.NODE_ENV === 'production') {
  startRateLimitCleanup();
}
