import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, localeConfig, type Locale } from '../lib/i18n/config';

/**
 * next-intl Request Configuration
 * 
 * Bu dosya SADECE getRequestConfig export eder.
 * Named exports (locales, defaultLocale, localeConfig) src/lib/i18n/config.ts'te kalır.
 */
export default getRequestConfig(async ({ locale }) => {
  // Desteklenmeyen dil kontrolü
  if (!locale || !locales.includes(locale as Locale)) {
    notFound();
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: localeConfig[locale as Locale].timezone,
  };
});
