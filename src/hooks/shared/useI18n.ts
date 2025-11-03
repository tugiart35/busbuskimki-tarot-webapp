import { useMemo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from '@/hooks/useTranslations';
import { useLocaleFromGeolocation } from '@/hooks/useGeolocation';

type SupportedLocale = 'tr' | 'en' | 'sr';

function extractLocale(pathname: string | null | undefined): SupportedLocale {
  if (!pathname) {
    return 'tr';
  }
  const maybe = pathname.split('/')[1];
  if (maybe === 'tr' || maybe === 'en' || maybe === 'sr') {
    return maybe as SupportedLocale;
  }
  return 'tr';
}

function buildLanguagePath(
  pathname: string,
  nextLocale: SupportedLocale
): string {
  try {
    // Eğer pathname locale ile başlıyorsa kaldır
    let pathWithoutLocale = pathname;
    const firstSegment = pathname.split('/')[1];
    if (firstSegment && ['tr', 'en', 'sr'].includes(firstSegment)) {
      pathWithoutLocale = pathname.substring(`/${firstSegment}`.length) || '/';
    }

    // ⚠️ GOOGLE SEO UYUMLU: Rewrite'lar kaldırıldı
    // Ana sayfa: direkt /{locale} kullan
    // Diğer sayfalar: gerçek route'ları kullan (SEO alias'ları kaldırıldı)
    // 
    // Örnek: Kullanıcı /tr'deyken dili EN'e çevirirse → /en
    //        Kullanıcı /tr/tarotokumasi'ndayken dili EN'e çevirirse → /en/tarotokumasi
    //
    // NOT: next.config.js'teki rewrites kaldırıldı, direkt route kullanıyoruz
    
    const pageMapping: Record<string, string> = {
      '/': '/',
      '/tarotokumasi': '/tarotokumasi',
      '/numeroloji': '/numeroloji',
      '/dashboard': '/dashboard',
      '/panel': '/dashboard',  // normalize
      '/auth': '/auth',
      '/giris': '/auth',       // normalize
      '/login': '/auth',       // normalize
      '/prijava': '/auth',     // normalize
      '/testler': '/testler',
    };

    // Normalize path
    const normalizedPath = pageMapping[pathWithoutLocale] || pathWithoutLocale;
    
    // Yeni path oluştur
    const newPath = normalizedPath === '/' 
      ? `/${nextLocale}` 
      : `/${nextLocale}${normalizedPath}`;

    // Cookie ile locale'i kaydet
    if (typeof document !== 'undefined') {
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    }

    return newPath;
  } catch (_e) {
    return `/${nextLocale}/tarotokumasi`;
  }
}

export function useI18n() {
  const pathname = usePathname();
  const { t } = useTranslations();
  const {
    locale: geoLocale,
    loading: geoLoading,
    error: geoError,
    requestLocale,
  } = useLocaleFromGeolocation();

  const currentLocale = useMemo<SupportedLocale>(
    () => extractLocale(pathname),
    [pathname]
  );

  const changeLanguage = useCallback(
    (nextLocale: SupportedLocale): string =>
      buildLanguagePath(pathname || '/', nextLocale),
    [pathname]
  );

  const formatDate = useCallback(
    (
      date: string | number | Date,
      locale?: string,
      options?: Intl.DateTimeFormatOptions
    ) => {
      try {
        const loc = locale || t('common.locale', 'tr-TR');
        return new Date(date).toLocaleString(loc || 'tr-TR', options);
      } catch (_e) {
        return new Date(date).toLocaleString('tr-TR', options);
      }
    },
    [t]
  );

  return {
    t,
    currentLocale,
    changeLanguage,
    formatDate,
    // Geolocation destekleri
    geoLocale,
    geoLoading,
    geoError,
    requestLocale,
  };
}

export type { SupportedLocale };
