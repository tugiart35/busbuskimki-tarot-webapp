/*
info:
Bu hook navigation logic'ini merkezi olarak yönetir ve BottomNavigation bileşeninden ayrıştırır.
Auth durumuna göre dinamik navigation items oluşturur ve dil değiştirme işlevselliği sağlar.

Bağlantılı dosyalar:
- @/hooks/auth/useAuth: Kullanıcı auth durumu için
- next/navigation: usePathname, useRouter için

Dosyanın amacı:
- Navigation items'ları auth durumuna göre dinamik oluşturma
- Dil değiştirme işlevselliği
- Navigation state yönetimi
- Reusable navigation logic

Backend bağlantısı:
- useAuth hook'u üzerinden Supabase auth durumu kontrol edilir
- Dil tercihi cookie'de saklanır

Geliştirme ve öneriler:
- Navigation items type safety için interface tanımları
- Dil değiştirme işlevselliği güvenli hale getirildi
- Error handling eklendi
- Memoization ile performance optimizasyonu
*/

'use client';

import { useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/auth/useAuth';
import { useTranslations } from '@/hooks/useTranslations';

// Navigation item interface
export interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  activeIcon: string;
}

// Dil seçenekleri
export const languages = [
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'sr', name: 'Srpski', flag: '🇷🇸' },
];

// GOOGLE SEO UYUMLU: Basit path normalize (SEO alias'ları kaldırıldı)
const getSeoFriendlyPath = (path: string): string => {
  // Sadece normalize mapping (panel -> dashboard, giris -> auth gibi)
  const normalizeMapping: Record<string, string> = {
    '/panel': '/dashboard',
    '/giris': '/auth',
    '/login': '/auth',
    '/prijava': '/auth',
  };

  return normalizeMapping[path] || path;
};

// Navigasyon öğelerini oluştur - auth durumuna göre dinamik
// GOOGLE SEO UYUMLU: Gerçek route'ları kullan
const getNavigationItems = (
  currentLocale: string,
  isAuthenticated: boolean,
  t: (key: string, fallback?: string) => string
): NavigationItem[] => {
  const baseItems: NavigationItem[] = [
    {
      name: t('navigation.home', 'Ana Sayfa'),
      href: `/${currentLocale}`, // Direkt locale (SEO alias yok)
      icon: '💛',
      activeIcon: '💛',
    },
    {
      name: t('navigation.tarot', 'Tarot'),
      href: `/${currentLocale}/tarotokumasi`, // Gerçek route
      icon: '⭐',
      activeIcon: '⭐',
    },
    {
      name: t('navigation.cards', 'Kartlar'),
      href: `/${currentLocale}${currentLocale === 'tr' ? '/kartlar' : currentLocale === 'en' ? '/cards' : '/kartice'}`,
      icon: '🃏',
      activeIcon: '🃏',
    },
    {
      name: t('navigation.numerology', 'Numeroloji'),
      href: `/${currentLocale}/numeroloji`, // Gerçek route
      icon: '🔢',
      activeIcon: '🔢',
    },
  ];

  // Auth durumuna göre giriş/profil sekmesi ekle
  if (isAuthenticated) {
    baseItems.push({
      name: t('navigation.profile', 'Profil'),
      href: `/${currentLocale}/dashboard`, // Gerçek route
      icon: '👤',
      activeIcon: '👤',
    });
  } else {
    baseItems.push({
      name: t('navigation.auth', 'Giriş Yap'),
      href: `/${currentLocale}/auth`, // Gerçek route
      icon: '🔑',
      activeIcon: '🔑',
    });
  }

  return baseItems;
};

// Ana navigation hook
export function useNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useTranslations();

  // Mevcut locale'i pathname'den çıkar
  const currentLocale = pathname.split('/')[1] || 'tr';

  // Navigation items'ları memoize et
  const navigationItems = useMemo(
    () => getNavigationItems(currentLocale, isAuthenticated, t),
    [currentLocale, isAuthenticated, t]
  );

  // Mevcut dili bul
  const currentLanguage = useMemo(
    () => languages.find(lang => lang.code === currentLocale) || languages[0],
    [currentLocale]
  );

  // Dil değiştirme fonksiyonu - GOOGLE SEO UYUMLU (basitleştirildi)
  const handleLanguageChange = (locale: string) => {
    try {
      // Mevcut path'i locale olmadan al
      let pathWithoutLocale = pathname;

      // Eğer pathname locale ile başlıyorsa, onu kaldır
      if (pathname.startsWith(`/${currentLocale}/`)) {
        pathWithoutLocale = pathname.substring(`/${currentLocale}`.length);
      } else if (pathname === `/${currentLocale}`) {
        pathWithoutLocale = '/';
      }

      // Normalize path (panel -> dashboard, giris -> auth)
      const normalizedPath = getSeoFriendlyPath(pathWithoutLocale);

      // Yeni path oluştur (gerçek route'ları kullan)
      const newPath =
        normalizedPath === '/' ? `/${locale}` : `/${locale}${normalizedPath}`;

      // Cookie'yi güncelle
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`;

      // Router ile yönlendir
      router.push(newPath);
    } catch (error) {
      // Fallback - ana sayfaya yönlendir
      router.push(`/${locale}`);
    }
  };

  // Navigation item click handler
  const handleNavigationClick = (item: NavigationItem) => {
    router.push(item.href);
  };

  return {
    navigationItems,
    currentLocale,
    currentLanguage,
    languages,
    handleLanguageChange,
    handleNavigationClick,
    router,
  };
}
