/*
info:
Bağlantılı dosyalar:
- ../providers/IntlProvider.tsx: i18n provider bileşeni için (gerekli)
- ../../middleware.ts: Locale routing middleware için (gerekli)
- ../../../messages/*.json: Dil dosyaları için (gerekli)

Dosyanın amacı:
- next-intl için temel yapılandırma ayarları
- Desteklenen diller: TR (varsayılan), EN, SR (Latin)
- Timezone: Europe/Podgorica
- Locale segment routing yapılandırması

Supabase değişkenleri ve tabloları:
- Yok (i18n yapılandırması)

Geliştirme önerileri:
- Yeni dil eklemek için bu dosyayı güncelle
- Locale routing kurallarını buradan yönet

Tespit edilen hatalar:
- Yok

Kullanım durumu:
- Aktif kullanımda
*/

import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

// Desteklenen diller
export const locales = ['tr', 'en', 'sr'] as const;
export type Locale = (typeof locales)[number];

// Varsayılan dil
export const defaultLocale: Locale = 'tr';

// Dil yapılandırması
export const localeConfig = {
  tr: {
    name: 'Türkçe',
    nativeName: 'Türkçe',
    timezone: 'Europe/Podgorica',
  },
  en: {
    name: 'English',
    nativeName: 'English',
    timezone: 'Europe/Podgorica',
  },
  sr: {
    name: 'Serbian (Latin)',
    nativeName: 'Srpski (Latinica)',
    timezone: 'Europe/Podgorica',
  },
} as const;

// Tüm namespace dosyaları
const NAMESPACE_FILES = [
  'common',
  'dashboard',
  'auth',
  'tarot',
  'tarot-spreads',
  'cards',
  'numerology',
  'payment',
  'admin',
  'legal',
  'home',
  'tests',
  'misc',
];

// Namespace yükleme helper'ı
async function loadAllNamespaces(locale: Locale) {
  const messages: Record<string, any> = {};
  
  // Tüm namespace'leri yükle
  // Webpack otomatik olarak bunları separate chunks'a böler
  for (const ns of NAMESPACE_FILES) {
    try {
      const nsMessages = (await import(`../../../messages/${locale}/${ns}.json`)).default;
      Object.assign(messages, nsMessages);
    } catch (error) {
      console.error(`Failed to load namespace: ${ns} for locale: ${locale}`, error);
    }
  }
  
  return messages;
}

// next-intl yapılandırması
export default getRequestConfig(async ({ locale, requestLocale }) => {
  // Desteklenmeyen dil kontrolü
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  // Tüm namespace'leri yükle
  // Next.js build optimization otomatik olarak code-splitting yapar
  const messages = await loadAllNamespaces(locale as Locale);

  return {
    locale,
    messages,
    timeZone: localeConfig[locale as Locale].timezone,
  };
});
