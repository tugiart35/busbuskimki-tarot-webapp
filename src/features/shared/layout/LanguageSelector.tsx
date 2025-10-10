'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface LanguageSelectorProps {
  locale: string;
  className?: string;
}

export function LanguageSelector({
  locale,
  className = '',
}: LanguageSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Dil seçenekleri
  const languages = [
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sr', name: 'Srpski', flag: '🇷🇸' },
  ];

  const currentLanguage =
    languages.find(lang => lang.code === locale) || languages[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dil değiştirme fonksiyonu
  const handleLanguageChange = (newLocale: string) => {
    try {
      let pathWithoutLocale = pathname;

      // Mevcut locale'i path'ten temizle
      if (pathname.startsWith(`/${locale}/`)) {
        pathWithoutLocale = pathname.substring(`/${locale}`.length);
      } else if (pathname === `/${locale}`) {
        pathWithoutLocale = '/';
      }

      // Middleware ile uyumlu basit path mapping
      // Ana sayfa için özel path kullanmıyoruz
      let targetPath = pathWithoutLocale;

      // Özel sayfalar için mapping
      const pathMappings: Record<string, Record<string, string>> = {
        '/tarotokumasi': {
          tr: '/tarotokumasi',
          en: '/tarotokumasi',
          sr: '/tarotokumasi',
        },
        '/tarot-okuma': {
          tr: '/tarotokumasi',
          en: '/tarotokumasi',
          sr: '/tarotokumasi',
        },
        '/tarot-reading': {
          tr: '/tarotokumasi',
          en: '/tarotokumasi',
          sr: '/tarotokumasi',
        },
        '/tarot-citanje': {
          tr: '/tarotokumasi',
          en: '/tarotokumasi',
          sr: '/tarotokumasi',
        },
        '/numeroloji': {
          tr: '/numeroloji',
          en: '/numeroloji',
          sr: '/numeroloji',
        },
        '/numerology': {
          tr: '/numeroloji',
          en: '/numeroloji',
          sr: '/numeroloji',
        },
        '/numerologija': {
          tr: '/numeroloji',
          en: '/numeroloji',
          sr: '/numeroloji',
        },
        '/dashboard': {
          tr: '/dashboard',
          en: '/dashboard',
          sr: '/dashboard',
        },
        '/panel': {
          tr: '/dashboard',
          en: '/dashboard',
          sr: '/dashboard',
        },
        '/auth': {
          tr: '/auth',
          en: '/auth',
          sr: '/auth',
        },
        '/giris': {
          tr: '/auth',
          en: '/auth',
          sr: '/auth',
        },
        '/login': {
          tr: '/auth',
          en: '/auth',
          sr: '/auth',
        },
        '/prijava': {
          tr: '/auth',
          en: '/auth',
          sr: '/auth',
        },
      };

      // Path'i normalize et
      const mapping = pathMappings[pathWithoutLocale];
      if (mapping?.[newLocale]) {
        targetPath = mapping[newLocale];
      }

      // Yeni path oluştur
      const newPath = `/${newLocale}${targetPath}`;

      // Cookie'yi güncelle
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

      // Router ile yönlendir
      router.push(newPath);
      setIsOpen(false);
    } catch (error) {
      // Hata durumunda ana sayfaya yönlendir
      const fallbackPath = `/${newLocale}`;
      router.push(fallbackPath);
      setIsOpen(false);
    }
  };

  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className='text-lg'>🇹🇷</span>
        <span className='text-sm font-medium text-white/80'>TR</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Modern Glassmorphism Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/15 transition-all duration-300 group shadow-lg hover:shadow-xl'
        aria-label='Dil seç'
      >
        <span className='text-lg filter drop-shadow-sm'>
          {currentLanguage?.flag}
        </span>
        <span className='text-sm font-semibold text-white/95 group-hover:text-white transition-colors duration-300'>
          {currentLanguage?.code.toUpperCase()}
        </span>
        <svg
          className={`w-4 h-4 text-white/70 transition-all duration-300 ${isOpen ? 'rotate-180 text-white' : 'group-hover:text-white/90'}`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {/* Modern Glassmorphism Dropdown */}
      {isOpen && (
        <>
          <div
            className='fixed inset-0 z-40 bg-black/20 backdrop-blur-sm'
            onClick={() => setIsOpen(false)}
          />

          <div className='absolute right-0 top-full mt-3 z-50 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl min-w-[160px] overflow-hidden animate-in slide-in-from-top-2 duration-200'>
            {languages.map((language, index) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`w-full px-4 py-3.5 text-left hover:bg-white/10 transition-all duration-200 flex items-center gap-3 group ${
                  language.code === locale
                    ? 'bg-white/15 text-white border-l-2 border-white/30'
                    : 'text-white/80 hover:text-white hover:translate-x-1'
                }`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className='text-base filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200'>
                  {language.flag}
                </span>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold'>{language.name}</span>
                  <span className='text-xs text-white/60'>
                    {language.code.toUpperCase()}
                  </span>
                </div>
                {language.code === locale && (
                  <svg
                    className='w-4 h-4 text-white/80 ml-auto'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
