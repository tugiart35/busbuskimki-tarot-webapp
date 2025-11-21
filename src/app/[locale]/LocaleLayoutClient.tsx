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

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, User } from 'lucide-react';
import { useAuth } from '@/hooks/auth/useAuth';
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
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useTranslations();
  const setConsentLocale = useConsentLocaleSetter();
  const [isLangOpen, setIsLangOpen] = useState(false);

  const languages = [
    { code: 'tr', flag: '🇹🇷', label: 'TR' },
    { code: 'en', flag: '🇬🇧', label: 'EN' },
    { code: 'sr', flag: '🇷🇸', label: 'SR' },
  ];

  const currentLang =
    languages.find(lang => lang.code === locale) || languages[0];

  // Performance monitoring
  useWebVitals();
  usePerformanceBudget();

  useEffect(() => {
    setConsentLocale(locale as 'tr' | 'en' | 'sr');
  }, [locale, setConsentLocale]);

  const handleLanguageChange = (newLocale: string) => {
    // Mevcut path'i locale olmadan al
    let pathWithoutLocale = pathname;

    // Eğer pathname locale ile başlıyorsa, onu kaldır
    if (pathname.startsWith(`/${locale}/`)) {
      pathWithoutLocale = pathname.substring(`/${locale}`.length);
    } else if (pathname === `/${locale}`) {
      pathWithoutLocale = '/';
    }

    // Path mapping - bazı sayfalar için normalize et
    const pageMapping: Record<string, string> = {
      '/': '/',
      '/tarotokumasi': '/tarotokumasi',
      '/numeroloji': '/numeroloji',
      '/dashboard': '/dashboard',
      '/panel': '/dashboard',
      '/auth': '/auth',
      '/giris': '/auth',
      '/login': '/auth',
      '/prijava': '/auth',
      '/testler': '/testler',
      // Kart sayfaları (locale-specific)
      '/kartlar':
        newLocale === 'tr'
          ? '/kartlar'
          : newLocale === 'en'
            ? '/cards'
            : '/kartice',
      '/cards':
        newLocale === 'tr'
          ? '/kartlar'
          : newLocale === 'en'
            ? '/cards'
            : '/kartice',
      '/kartice':
        newLocale === 'tr'
          ? '/kartlar'
          : newLocale === 'en'
            ? '/cards'
            : '/kartice',
    };

    // Path mapping uygula
    const normalizedPath = pageMapping[pathWithoutLocale] || pathWithoutLocale;
    const newPath =
      normalizedPath === '/'
        ? `/${newLocale}`
        : `/${newLocale}${normalizedPath}`;

    // Cookie'yi güncelle
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // Router ile yönlendir
    router.push(newPath);
    setIsLangOpen(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white'>
      {/* Navigation Header - Figma design */}
      <nav className='sticky top-0 z-50 backdrop-blur-md bg-indigo-950/30 border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Brand */}
            <Link href={`/${locale}`} className='flex items-center gap-2'>
              <span className='text-xl'>🔮</span>
              <span className='tracking-wide font-medium'>Büşbüşkimki</span>
            </Link>

            {/* Right side */}
            <div className='flex items-center gap-3 sm:gap-4'>
              {/* Language selector */}
              <div className='relative'>
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className='flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors'
                >
                  <span className='text-sm'>
                    {`${currentLang?.flag || '🌐'} ${currentLang?.label || locale.toUpperCase()}`}
                  </span>
                  <ChevronDown className='w-3 h-3' />
                </button>

                {isLangOpen && (
                  <div className='absolute right-0 mt-2 w-24 backdrop-blur-lg bg-indigo-950/80 border border-white/20 rounded-lg shadow-lg overflow-hidden z-50'>
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className='w-full px-3 py-2 text-sm hover:bg-white/10 transition-colors flex items-center gap-2'
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* User email or Login button */}
              {user ? (
                <Link
                  href={`/${locale}/dashboard`}
                  className='hidden sm:flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors'
                >
                  <User className='w-4 h-4 opacity-60' />
                  <span className='text-sm opacity-80'>
                    {user.email?.split('@')[0] || t('messages.common.user')}
                  </span>
                </Link>
              ) : (
                <Link
                  href={`/${locale}/auth`}
                  className='px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/20 text-sm font-medium'
                >
                  {t('messages.common.login')}
                </Link>
              )}

              {/* Panel button - only show if user is logged in */}
              {user && (
                <Link
                  href={`/${locale}/dashboard`}
                  className='px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/20 text-sm font-medium'
                >
                  {t('messages.common.panel')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Disclaimer Banner */}
      <DisclaimerBanner locale={locale as 'tr' | 'en' | 'sr'} />

      {/* Main Content */}
      <main>{children}</main>

      {/* Age Verification Modal */}
      <AgeVerificationModal locale={locale as 'tr' | 'en' | 'sr'} />

      {/* Performance Monitoring */}
      <WebVitals />
    </div>
  );
}
