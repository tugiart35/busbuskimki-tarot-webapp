/*
info:
Bağlantılı dosyalar:
- @/features/shared/layout/LanguageSelector: Dil seçici bileşeni (gerekli)
- @/hooks/useAuth: Kullanıcı kimlik doğrulama için (gerekli)
- next/link: Sayfa yönlendirmeleri için (gerekli)

Dosyanın amacı:
- Her sayfada görünür global header
- Dil seçici ve auth durumu gösterimi
- Responsive ve modern tasarım
- Layout seviyesinde client-side işlemler

Geliştirme önerileri:
- Modern UI/UX prensipleri uygulandı
- Accessibility desteği
- Mobile-first responsive tasarım
- Smooth animasyonlar

Tespit edilen hatalar:
- Yok

Kullanım durumu:
- Layout seviyesinde global header
- Tüm sayfalarda üst kısımda görünür
- Dil seçici ve auth durumu
*/

'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/auth/useAuth';
import { LanguageSelector } from '@/features/shared/layout/LanguageSelector';
import { useTranslations } from '@/hooks/useTranslations';
import {
  WebVitals,
  useWebVitals,
  usePerformanceBudget,
} from '@/components/performance/WebVitals';
// Dynamic imports for non-critical layout widgets (performance optimization)
import {
  DynamicDisclaimerBanner as DisclaimerBanner,
  DynamicAgeVerificationModal as AgeVerificationModal,
} from '@/components/shared/DynamicLayoutWidgets';
import { useConsentLocaleSetter } from '@/hooks/useConsent';

interface LocaleLayoutClientProps {
  children: React.ReactNode;
  locale: string;
}

export function LocaleLayoutClient({
  children,
  locale,
}: LocaleLayoutClientProps) {
  const { user } = useAuth();
  const { t } = useTranslations();
  const isAuthenticated = !!user;
  const setConsentLocale = useConsentLocaleSetter();

  // Performance monitoring
  useWebVitals();
  usePerformanceBudget();

  // Fallback çeviri fonksiyonu
  const translate = (key: string, fallback: string) => {
    try {
      return t ? t(key, fallback) : fallback;
    } catch (error) {
      return fallback;
    }
  };

  useEffect(() => {
    setConsentLocale(locale as 'tr' | 'en' | 'sr');
  }, [locale, setConsentLocale]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white'>
      {/* Modern Glassmorphism Header */}
      <header
        className='fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-sm lg:backdrop-blur-2xl border-b border-white/10 shadow lg:shadow-2xl'
        role='banner'
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between gap-2 py-1.5 min-h-[44px]'>
            {/* Modern Logo */}
            <Link
              href={`/${locale}`}
              className='flex items-center gap-3 text-white hover:text-white/90 transition-all duration-300 group touch-manipulation'
              aria-label='Go to homepage'
            >
              <div className='relative'>
                <div className='text-lg sm:text-2xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow'>
                  🔮
                </div>
                <div className='absolute inset-0 text-2xl opacity-0 group-hover:opacity-30 blur-sm transition-opacity duration-300'>
                  ✨
                </div>
              </div>
              <span className='inline text-sm sm:text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent whitespace-nowrap truncate max-w-[120px] sm:max-w-none'>
                Büşbüşkimki
              </span>
            </Link>

            {/* Modern Right Section */}
            <div className='flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-auto flex-nowrap'>
              {/* Language Selector */}
              <LanguageSelector locale={locale} className='' compact />

              {/* Modern Auth Section */}
              {isAuthenticated ? (
                <div className='flex items-center gap-2 sm:gap-3 justify-end'>
                  <div className='hidden sm:block text-sm text-white/70 font-medium'>
                    {user?.email}
                  </div>
                  <Link
                    href={`/${locale}/dashboard`}
                    className='text-center px-3 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] backdrop-blur-0 sm:backdrop-blur-sm border border-white/15 hover:border-white/25 shadow sm:shadow-md touch-manipulation whitespace-nowrap'
                    aria-label='Open dashboard'
                  >
                    {translate('auth.dashboard', 'Panel')}
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/${locale}/auth`}
                  className='block text-center px-3 py-2 bg-gradient-to-r from-white to-white/90 hover:from-white/90 hover:to-white text-black text-sm font-semibold rounded-lg transition-all duration-300 hover:scale-[1.02] shadow sm:shadow-md touch-manipulation whitespace-nowrap'
                  aria-label='Sign in'
                >
                  {translate('auth.signIn', 'Giriş')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Disclaimer Banner */}
      <DisclaimerBanner locale={locale as 'tr' | 'en' | 'sr'} />

      {/* Main Content */}
      <main className='pt-12 sm:pt-20'>{children}</main>

      {/* Age Verification Modal */}
      <AgeVerificationModal locale={locale as 'tr' | 'en' | 'sr'} />

      {/* Performance Monitoring */}
      <WebVitals />
    </div>
  );
}
