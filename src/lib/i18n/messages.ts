import trMessages from '../../../messages/tr.json';
import enMessages from '../../../messages/en.json';
import srMessages from '../../../messages/sr.json';

export const supportedLocales = ['tr', 'en', 'sr'] as const;
export type Locale = (typeof supportedLocales)[number];

const messagesMap: Record<Locale, Record<string, unknown>> = {
  tr: trMessages as Record<string, unknown>,
  en: enMessages as Record<string, unknown>,
  sr: srMessages as Record<string, unknown>,
};

export function isSupportedLocale(locale: string): locale is Locale {
  return supportedLocales.includes(locale as Locale);
}

export function getLocaleMessages(locale: string): Record<string, unknown> {
  if (isSupportedLocale(locale)) {
    return messagesMap[locale];
  }
  return messagesMap.tr;
}

export function getFallbackMessages(): Record<string, unknown> {
  return messagesMap.tr;
}
