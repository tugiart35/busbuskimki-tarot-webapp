/**
 * AdSense Manager
 *
 * Google AdSense entegrasyonu için yönetim fonksiyonları
 * - Reklam yükleme kontrolü
 * - Ad blocker detection
 * - Performance monitoring
 * - Error tracking
 * - Consent management entegrasyonu
 */

import { getConsentState } from '@/lib/consent/store';

/**
 * Kullanıcının AdSense için onay verip vermediğini kontrol eder
 */
export function hasAdSenseConsent(): boolean {
  const state = getConsentState();
  return state.preferences.advertising;
}

/**
 * Ad blocker olup olmadığını tespit eder
 */
export async function detectAdBlocker(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    // Test element oluştur
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox ad-placement ad-placeholder';
    testAd.style.position = 'absolute';
    testAd.style.top = '-1px';
    testAd.style.left = '-1px';
    testAd.style.width = '1px';
    testAd.style.height = '1px';

    document.body.appendChild(testAd);

    // Element'in görünürlüğünü kontrol et
    await new Promise(resolve => setTimeout(resolve, 100));

    const isBlocked =
      testAd.offsetHeight === 0 ||
      testAd.offsetWidth === 0 ||
      window.getComputedStyle(testAd).display === 'none';

    document.body.removeChild(testAd);

    if (isBlocked) {
      console.warn('AdBlocker detected');
    }

    return isBlocked;
  } catch (error) {
    console.error('Error detecting ad blocker:', error);
    return false;
  }
}

/**
 * AdSense script'inin yüklenip yüklenmediğini kontrol eder
 */
export function isAdSenseLoaded(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return typeof (window as any).adsbygoogle !== 'undefined';
}

/**
 * AdSense reklamını manuel olarak yükler
 */
export function loadAdSenseAd(_adSlotElement: HTMLElement): void {
  if (!hasAdSenseConsent()) {
    console.warn('AdSense consent not granted');
    return;
  }

  if (!isAdSenseLoaded()) {
    console.warn('AdSense script not loaded yet');
    return;
  }

  try {
    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    console.log('AdSense ad loaded successfully');
  } catch (error) {
    console.error('Error loading AdSense ad:', error);
    trackAdError('load_failed', error);
  }
}

/**
 * Reklam hatalarını takip eder
 */
export function trackAdError(
  errorType: string,
  error: unknown,
  adSlot?: string
): void {
  const errorData = {
    type: errorType,
    message: error instanceof Error ? error.message : 'Unknown error',
    adSlot: adSlot || 'unknown',
    timestamp: new Date().toISOString(),
    userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'unknown',
  };

  console.error('AdSense Error:', errorData);

  // Analytics veya error tracking servisine gönder
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'adsense_error', {
      error_type: errorType,
      error_message: errorData.message,
      ad_slot: errorData.adSlot,
    });
  }
}

/**
 * Reklam performansını izler
 */
export function trackAdPerformance(
  adSlot: string,
  metric: 'impression' | 'viewable' | 'click',
  value?: number
): void {
  if (!hasAdSenseConsent()) {
    return;
  }

  const performanceData = {
    adSlot,
    metric,
    value: value || 1,
    timestamp: new Date().toISOString(),
  };

  console.log('AdSense Performance:', performanceData);

  // Analytics'e gönder
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', `ad_${metric}`, {
      ad_slot: adSlot,
      value: performanceData.value,
    });
  }
}

/**
 * AdSense için uygun sayfa ortamını kontrol eder
 */
export function validateAdEnvironment(): {
  isValid: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (!hasAdSenseConsent()) {
    reasons.push('User has not granted advertising consent');
  }

  if (typeof window === 'undefined') {
    reasons.push('Not in browser environment');
  }

  // Development/test ortamında AdSense'i devre dışı bırak
  if (
    typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1')
  ) {
    reasons.push('Running in development environment');
  }

  return {
    isValid: reasons.length === 0,
    reasons,
  };
}

/**
 * Responsive ad boyutlarını hesaplar
 */
export function getResponsiveAdSize(containerWidth: number): {
  width: number;
  height: number;
} {
  if (containerWidth >= 970) {
    return { width: 970, height: 250 }; // Large leaderboard
  } else if (containerWidth >= 728) {
    return { width: 728, height: 90 }; // Leaderboard
  } else if (containerWidth >= 468) {
    return { width: 468, height: 60 }; // Banner
  } else if (containerWidth >= 320) {
    return { width: 320, height: 100 }; // Mobile banner
  } else {
    return { width: 300, height: 250 }; // Medium rectangle (default)
  }
}

/**
 * AdSense configuration tipini export et
 */
export interface AdSenseConfig {
  client: string;
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: 'true' | 'false';
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Varsayılan AdSense konfigürasyonu
 */
export const DEFAULT_ADSENSE_CONFIG: Partial<AdSenseConfig> = {
  format: 'auto',
  responsive: 'true',
};

/**
 * AdSense client ID (environment variable'dan alınacak)
 */
export const ADSENSE_CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-1429338163231803';

/**
 * AdSense yükleme durumunu izler
 */
export class AdSenseLoadMonitor {
  private static instance: AdSenseLoadMonitor;
  private loadStartTime: number | null = null;
  private isMonitoring = false;

  private constructor() {}

  static getInstance(): AdSenseLoadMonitor {
    if (!AdSenseLoadMonitor.instance) {
      AdSenseLoadMonitor.instance = new AdSenseLoadMonitor();
    }
    return AdSenseLoadMonitor.instance;
  }

  startMonitoring(): void {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.loadStartTime = Date.now();

    console.log('AdSense load monitoring started');
  }

  stopMonitoring(success: boolean): void {
    if (!this.isMonitoring || !this.loadStartTime) {
      return;
    }

    const loadTime = Date.now() - this.loadStartTime;
    this.isMonitoring = false;

    console.log(
      `AdSense load completed in ${loadTime}ms (Success: ${success})`
    );

    // Analytics'e gönder
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'adsense_load_time', {
        value: loadTime,
        success,
      });
    }
  }
}

/**
 * AdSense için güvenli render kontrolü
 */
export function canRenderAd(): boolean {
  // AdSense deaktif kontrolü - tekrar aktif etmek için NEXT_PUBLIC_ADSENSE_ENABLED=true yapın
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'false') {
    return false;
  }

  const env = validateAdEnvironment();

  if (!env.isValid) {
    console.warn('Cannot render ad:', env.reasons.join(', '));
    return false;
  }

  return true;
}
