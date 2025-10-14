/*
info:
Bağlantılı dosyalar:
- ../messages: Dil dosyaları için (gerekli)
- usePathname: Mevcut locale'i tespit etmek için (gerekli)

Dosyanın amacı:
- Basit i18n sistemi için hook
- Dil dosyalarından çevirileri yükleme
- Mevcut locale'e göre doğru çeviriyi döndürme

Supabase değişkenleri ve tabloları:
- Yok (frontend hook)

Geliştirme önerileri:
- Cache mekanizması eklenebilir
- Fallback dil desteği eklenebilir
- Nested key desteği geliştirilebilir

Tespit edilen hatalar:
- Yok

Kullanım durumu:
- Aktif kullanımda
*/

'use client';

import { usePathname } from 'next/navigation';
import { useMemo, useCallback } from 'react';

// Dil dosyalarını import et
import trMessages from '../../messages/tr.json';
import enMessages from '../../messages/en.json';
import srMessages from '../../messages/sr.json';

// Dil dosyaları mapping
const messages = {
  tr: trMessages,
  en: enMessages,
  sr: srMessages,
};

// Desteklenen diller
const supportedLocales = ['tr', 'en', 'sr'] as const;
type Locale = (typeof supportedLocales)[number];

// Nested key'leri çözmek için helper fonksiyon
function getNestedValue(obj: Record<string, unknown>, path: string): string {
  return path.split('.').reduce((current: unknown, key: string) => {
    return current &&
      typeof current === 'object' &&
      current !== null &&
      key in current
      ? (current as Record<string, unknown>)[key]
      : null;
  }, obj) as string;
}

export function useTranslations() {
  const pathname = usePathname();

  // Mevcut locale'i pathname'den çıkar
  const currentLocale = useMemo(() => {
    if (!pathname) {
      return 'tr';
    }
    const locale = pathname.split('/')[1] as Locale;
    return supportedLocales.includes(locale) ? locale : 'tr';
  }, [pathname]);

  // Messages kontrolü
  const currentMessages = useMemo(() => {
    return messages[currentLocale] || messages.tr || {};
  }, [currentLocale]);

  // Çeviri fonksiyonu - stable referans için useCallback kullan
  const t = useCallback(
    (
      key: string,
      variables?: Record<string, string | number> | string
    ): string => {
      try {
        if (!currentMessages) {
          return typeof variables === 'string' ? variables : key;
        }

        const message = getNestedValue(currentMessages, key);

        let result: string;
        if (message && typeof message === 'string') {
          result = message;
        } else if (currentLocale !== 'tr') {
          // Fallback olarak Türkçe'yi dene
          const fallbackMessage = getNestedValue(messages.tr, key);
          if (fallbackMessage && typeof fallbackMessage === 'string') {
            result = fallbackMessage;
          } else {
            result = typeof variables === 'string' ? variables : key;
          }
        } else {
          result = typeof variables === 'string' ? variables : key;
        }

        // Değişkenleri yerine koy
        if (variables && typeof variables === 'object') {
          Object.entries(variables).forEach(([varKey, varValue]) => {
            result = result.replace(
              new RegExp(`{${varKey}}`, 'g'),
              String(varValue)
            );
          });
        }

        return result;
      } catch (error) {
        console.error('Translation error:', error);
        return typeof variables === 'string' ? variables : key;
      }
    },
    [currentLocale, currentMessages]
  );

  return { t };
}
