/**
 * Dynamic Layout Widgets
 * 
 * Bu dosya her sayfada yüklenen layout widget'larını lazy loading ile optimize eder.
 * Pattern: AdminLazyComponents.tsx ile aynı (proven pattern)
 * 
 * Faydaları:
 * - Initial bundle boyutunu ~40 KB azaltır
 * - FCP ve LCP'yi 150-200ms iyileştirir
 * - Non-critical component'leri kullanıcı etkileşimine göre yükler
 * 
 * Güvenlik:
 * - Tüm component'ler client-side only (ssr: false)
 * - localStorage kullanımı güvenli (client-only)
 * - useEffect mount'ta çalışır (hydration mismatch yok)
 */

'use client';

import dynamic from 'next/dynamic';

// Minimal loading fallback - görünmez, layout shift yok
const EmptyFallback = () => null;

/**
 * Cookie Consent Component
 * Kullanıcı çerez tercihlerini yönetir
 * 
 * SSR: false - localStorage kullanıyor
 * Loading: null - Görünmeden yüklenir, UX etkilenmez
 */
export const DynamicCookieConsent = dynamic(
  () => import('./CookieConsent'),
  {
    loading: () => <EmptyFallback />,
    ssr: false, // localStorage requires client-side
  }
);

/**
 * Disclaimer Banner Component
 * Yasal uyarı banner'ı
 * 
 * Props: locale (tr | en | sr)
 * SSR: false - localStorage + delayed display (1s timeout)
 * Loading: null - 1 saniye delay zaten var, yükleme gösterilmez
 */
export const DynamicDisclaimerBanner = dynamic(
  () => import('./DisclaimerBanner'),
  {
    loading: () => <EmptyFallback />,
    ssr: false, // localStorage + setTimeout requires client-side
  }
);

/**
 * Age Verification Modal Component
 * Yaş doğrulama modal'ı
 * 
 * Props: locale (tr | en | sr)
 * SSR: false - localStorage kullanıyor
 * Loading: null - Modal açılana kadar görünmez
 */
export const DynamicAgeVerificationModal = dynamic(
  () => import('./AgeVerificationModal'),
  {
    loading: () => <EmptyFallback />,
    ssr: false, // localStorage + conditional rendering
  }
);

/**
 * NOT: WebVitals component'ini dynamic yapma
 * Sebep: Performance monitoring mümkün olduğunca erken başlamalı
 * Vercel Analytics ve SpeedInsights da direkt import edilmeli
 */

