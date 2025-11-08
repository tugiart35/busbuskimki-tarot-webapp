/**
 * Numeroloji sayı anlamları ve açılımları
 * Her sayı için detaylı açıklamalar ve rehberlik
 */

export interface NumberMeaning {
  number: number;
  title: string;
  keywords: string[];
  description: string;
  positiveTraits: string[];
  challenges: string[];
  lifeGuidance: string;
  careerAdvice: string;
  relationshipAdvice: string;
  spiritualMessage: string;
  color: string;
  element: string;
  planet: string;
  birthdayMeaning?: string; // Doğum günü sayısı için özel açıklama
  lifePathMeaning?: string; // Yaşam yolu sayısı için özel açıklama
  expressionMeaning?: string; // İfade/Kader sayısı için özel açıklama
  personalityMeaning?: string; // Kişilik sayısı için özel açıklama
  maturityMeaning?: string; // Olgunluk/Yaşam Amacı sayısı için özel açıklama
  pinnacleMeaning?: string; // Zirve sayısı için özel açıklama
  challengeMeaning?: string; // Zorluk sayısı için özel açıklama
  personalYearMeaning?: string; // Kişisel yıl sayısı için özel açıklama
  compatibilityMeaning?: string; // Uyum/İlişki analizi için özel açıklama
  soulUrgeMeaning?: string; // Ruh Arzusu sayısı için özel açıklama
}

import {
  getFallbackMessages,
  getLocaleMessages,
  isSupportedLocale,
  type Locale,
} from '@/lib/i18n/messages';

const SUPPORTED_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33] as const;
const SUPPORTED_NUMBER_SET = new Set<number>(SUPPORTED_NUMBERS);
const DEFAULT_LOCALE: Locale = 'tr';

function resolveLocale(locale?: string): Locale {
  if (locale && isSupportedLocale(locale)) {
    return locale;
  }
  return DEFAULT_LOCALE;
}

function getNumerologySection(
  messages: Record<string, unknown>,
  section: string
): unknown {
  const numerology = (messages as Record<string, unknown>).numerology;
  if (numerology && typeof numerology === 'object') {
    return (numerology as Record<string, unknown>)[section];
  }
  return null;
}

function getNumberedEntry(section: unknown, number: number): unknown {
  if (!section) {
    return null;
  }
  const key = number.toString();
  
  // Önce object kontrolü yap (daha yaygın)
  if (typeof section === 'object' && !Array.isArray(section)) {
    const record = section as Record<string, unknown>;
    return key in record ? record[key] : null;
  }
  
  // Array kontrolü (sr.json için)
  if (Array.isArray(section)) {
    // Array'de index 0 = null, index 1 = "1", index 2 = "2", vs.
    // Sayı 1 için index 1'e bakmalıyız
    return section[number] ?? null;
  }
  
  return null;
}

function getNumberDetails(
  messages: Record<string, unknown>,
  number: number
): Record<string, unknown> | null {
  const section = getNumerologySection(messages, 'numberDetails');
  const entry = getNumberedEntry(section, number);
  if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
    return entry as Record<string, unknown>;
  }
  return null;
}

function getMeaningMeta(
  messages: Record<string, unknown>,
  number: number
): { title?: string; description?: string } | null {
  const section = getNumerologySection(messages, 'meanings');
  const entry = getNumberedEntry(section, number);
  if (entry && typeof entry === 'object' && !Array.isArray(entry)) {
    const record = entry as Record<string, unknown>;
    const meta: { title?: string; description?: string } = {};
    if (typeof record.title === 'string') {
      meta.title = record.title as string;
    }
    if (typeof record.description === 'string') {
      meta.description = record.description as string;
    }
    return meta;
  }
  return null;
}

function getNumberedStringFromMessages(
  messages: Record<string, unknown>,
  sectionName: string,
  number: number
): string | null {
  const section = getNumerologySection(messages, sectionName);
  const value = getNumberedEntry(section, number);
  return typeof value === 'string' ? (value as string) : null;
}

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((item): item is string => typeof item === 'string');
}

function getDetailArray(
  key: string,
  localeDetails?: Record<string, unknown> | null,
  fallbackDetails?: Record<string, unknown> | null
): string[] {
  const localeValue = localeDetails ? localeDetails[key] : undefined;
  const fallbackValue = fallbackDetails ? fallbackDetails[key] : undefined;
  const result = toStringArray(localeValue);
  if (result.length > 0) {
    return result;
  }
  return toStringArray(fallbackValue);
}

function getDetailString(
  key: string,
  localeDetails?: Record<string, unknown> | null,
  fallbackDetails?: Record<string, unknown> | null
): string {
  const localeValue =
    localeDetails && typeof localeDetails[key] === 'string'
      ? (localeDetails[key] as string)
      : undefined;
  if (localeValue) {
    return localeValue;
  }
  const fallbackValue =
    fallbackDetails && typeof fallbackDetails[key] === 'string'
      ? (fallbackDetails[key] as string)
      : undefined;
  return fallbackValue ?? '';
}

function getLocalizedNumberedString(
  sectionName: string,
  number: number,
  localeMessages: Record<string, unknown>,
  fallbackMessages: Record<string, unknown>
): string | null {
  const localeValue = getNumberedStringFromMessages(
    localeMessages,
    sectionName,
    number
  );
  if (localeValue) {
    return localeValue;
  }
  const fallbackValue = getNumberedStringFromMessages(
    fallbackMessages,
    sectionName,
    number
  );
  return fallbackValue ?? null;
}

function buildNumberMeaning(
  number: number,
  locale: Locale
): NumberMeaning | null {
  if (!SUPPORTED_NUMBER_SET.has(number)) {
    return null;
  }

  const localeMessages = getLocaleMessages(locale);
  const fallbackMessages =
    locale === DEFAULT_LOCALE ? localeMessages : getFallbackMessages();

  const localeDetails = getNumberDetails(localeMessages, number);
  const fallbackDetails =
    locale === DEFAULT_LOCALE
      ? localeDetails
      : getNumberDetails(fallbackMessages, number);

  const details = localeDetails ?? fallbackDetails;
  const meta =
    getMeaningMeta(localeMessages, number) ??
    getMeaningMeta(fallbackMessages, number);

  if (!details || !meta) {
    return null;
  }

  const title = meta.title ?? '';
  const description = meta.description ?? '';

  const birthdayMeaning = getLocalizedNumberedString(
    'birthdayMeanings',
    number,
    localeMessages,
    fallbackMessages
  );
  const lifePathMeaning = getLocalizedNumberedString(
    'lifePathMeanings',
    number,
    localeMessages,
    fallbackMessages
  );
  const expressionMeaning = getLocalizedNumberedString(
    'expressionMeanings',
    number,
    localeMessages,
    fallbackMessages
  );
  const personalityMeaning = getLocalizedNumberedString(
    'personalityMeanings',
    number,
    localeMessages,
    fallbackMessages
  );
  const maturityMeaning = getLocalizedNumberedString(
    'maturityMeanings',
    number,
    localeMessages,
    fallbackMessages
  );
  const pinnacleMeaning = getLocalizedNumberedString(
    'pinnaclesMeanings',
    number,
    localeMessages,
    fallbackMessages
  );
  const challengeMeaning = getLocalizedNumberedString(
    'challengesMeanings',
    number,
    localeMessages,
    fallbackMessages
  );
  const personalYearMeaning = getLocalizedNumberedString(
    'personalYearMeanings',
    number,
    localeMessages,
    fallbackMessages
  );
  const compatibilityMeaning = getLocalizedNumberedString(
    'compatibilityMeanings',
    number,
    localeMessages,
    fallbackMessages
  );
  const soulUrgeMeaning = getLocalizedNumberedString(
    'soulUrgeMeanings',
    number,
    localeMessages,
    fallbackMessages
  );

  const meaning: NumberMeaning = {
    number,
    title,
    description,
    keywords: getDetailArray('keywords', localeDetails, fallbackDetails),
    positiveTraits: getDetailArray(
      'positiveTraits',
      localeDetails,
      fallbackDetails
    ),
    challenges: getDetailArray('challenges', localeDetails, fallbackDetails),
    lifeGuidance: getDetailString(
      'lifeGuidance',
      localeDetails,
      fallbackDetails
    ),
    careerAdvice: getDetailString(
      'careerAdvice',
      localeDetails,
      fallbackDetails
    ),
    relationshipAdvice: getDetailString(
      'relationshipAdvice',
      localeDetails,
      fallbackDetails
    ),
    spiritualMessage: getDetailString(
      'spiritualMessage',
      localeDetails,
      fallbackDetails
    ),
    color: getDetailString('color', localeDetails, fallbackDetails),
    element: getDetailString('element', localeDetails, fallbackDetails),
    planet: getDetailString('planet', localeDetails, fallbackDetails),
  };

  if (birthdayMeaning) {
    meaning.birthdayMeaning = birthdayMeaning;
  }
  if (lifePathMeaning) {
    meaning.lifePathMeaning = lifePathMeaning;
  }
  if (expressionMeaning) {
    meaning.expressionMeaning = expressionMeaning;
  }
  if (personalityMeaning) {
    meaning.personalityMeaning = personalityMeaning;
  }
  if (maturityMeaning) {
    meaning.maturityMeaning = maturityMeaning;
  }
  if (pinnacleMeaning) {
    meaning.pinnacleMeaning = pinnacleMeaning;
  }
  if (challengeMeaning) {
    meaning.challengeMeaning = challengeMeaning;
  }
  if (personalYearMeaning) {
    meaning.personalYearMeaning = personalYearMeaning;
  }
  if (compatibilityMeaning) {
    meaning.compatibilityMeaning = compatibilityMeaning;
  }
  if (soulUrgeMeaning) {
    meaning.soulUrgeMeaning = soulUrgeMeaning;
  }

  return meaning;
}

/**
 * Sayı anlamını getirir
 */
export function getNumberMeaning(
  number: number,
  locale: string = DEFAULT_LOCALE
): NumberMeaning | null {
  const resolvedLocale = resolveLocale(locale);
  return buildNumberMeaning(number, resolvedLocale);
}

/**
 * Tüm sayı anlamlarını getirir
 */
export function getAllNumberMeanings(
  locale: string = DEFAULT_LOCALE
): NumberMeaning[] {
  const resolvedLocale = resolveLocale(locale);
  return SUPPORTED_NUMBERS.map(num => buildNumberMeaning(num, resolvedLocale))
    .filter(Boolean)
    .map(meaning => meaning as NumberMeaning);
}

function getLocalizedMeaningFromSection(
  number: number,
  sectionName: string,
  locale: string
): string | null {
  const resolvedLocale = resolveLocale(locale);
  const localeMessages = getLocaleMessages(resolvedLocale);
  const fallbackMessages =
    resolvedLocale === DEFAULT_LOCALE ? localeMessages : getFallbackMessages();

  const result = getLocalizedNumberedString(
    sectionName,
    number,
    localeMessages,
    fallbackMessages
  );
  return result ?? null;
}

/**
 * Doğum günü sayısı anlamını getirir
 */
export function getBirthdayNumberMeaning(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  return getLocalizedMeaningFromSection(number, 'birthdayMeanings', locale);
}

/**
 * Yaşam yolu sayısı anlamını getirir
 */
export function getLifePathNumberMeaning(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  return getLocalizedMeaningFromSection(number, 'lifePathMeanings', locale);
}

/**
 * İfade/Kader sayısı anlamını getirir
 */
export function getExpressionNumberMeaning(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  return getLocalizedMeaningFromSection(number, 'expressionMeanings', locale);
}

/**
 * Kişilik sayısı anlamını getirir
 */
export function getPersonalityNumberMeaning(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  return getLocalizedMeaningFromSection(number, 'personalityMeanings', locale);
}

/**
 * Olgunluk/Yaşam Amacı sayısı anlamını getirir
 */
export function getMaturityNumberMeaning(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  return getLocalizedMeaningFromSection(number, 'maturityMeanings', locale);
}

/**
 * Zirve sayısı anlamını getirir
 */
const PINNACLE_ALLOWED = new Set([1,2,3,4,5,6,7,8,9,11,22,33]);
const CHALLENGE_ALLOWED = new Set([0,1,2,3,4,5,6,7,8]);
const MASTER_ROOT: Record<number, number> = { 11: 2, 22: 4, 33: 6 };

function normalizeLocale(locale?: string) {
  return (locale?.toLowerCase()?.split('-')[0] || DEFAULT_LOCALE) as string;
}

function getMeaningWithFallback(
  section: 'pinnaclesMeanings' | 'challengesMeanings',
  n: number,
  locale: string
): string | null {
  const chain = [normalizeLocale(locale), normalizeLocale(DEFAULT_LOCALE), 'en'];
  for (const loc of chain) {
    const m = getLocalizedMeaningFromSection(n, section, loc);
    if (m) return m;
  }
  return null;
}

// Zirve: master varsa koru; yoksa kök sayıya düş
export function getPinnacleNumberMeaningSafe(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  if (!PINNACLE_ALLOWED.has(number)) return null;
  const direct = getMeaningWithFallback('pinnaclesMeanings', number, locale);
  if (direct) return direct;

  // Master metni yoksa köke düş (11→2, 22→4, 33→6)
  const root = MASTER_ROOT[number];
  return root ? getMeaningWithFallback('pinnaclesMeanings', root, locale) : null;
}

// Zorluk: 0–8, master yok; 0 için metin yoksa genel bir fallback belirle
export function getChallengeNumberMeaningSafe(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  if (!CHALLENGE_ALLOWED.has(number)) return null;
  const m = getMeaningWithFallback('challengesMeanings', number, locale);
  if (m) return m;

  // Opsiyonel: 0 için veri yoksa minimal bir default döndür
  if (number === 0) {
    const chain = [normalizeLocale(locale), normalizeLocale(DEFAULT_LOCALE), 'en'];
    const defaults: Record<string, string> = {
      tr: '0 Zorluğu: Boşluk ve iç dengeyle yüzleşme.',
      en: 'Challenge 0: The void—balance and self-reliance.',
    };
    for (const loc of chain) if (defaults[loc]) return defaults[loc];
  }
  return null;
}

/**
 * Kişisel yıl sayısı anlamını getirir
 */
export function getPersonalYearNumberMeaning(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  return getLocalizedMeaningFromSection(number, 'personalYearMeanings', locale);
}

/**
 * Uyum/İlişki analizi sayısı anlamını getirir
 */
export function getCompatibilityNumberMeaning(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  return getLocalizedMeaningFromSection(
    number,
    'compatibilityMeanings',
    locale
  );
}

/**
 * Ruh Arzusu sayısı anlamını getirir
 */
export function getSoulUrgeNumberMeaning(
  number: number,
  locale: string = DEFAULT_LOCALE
): string | null {
  return getLocalizedMeaningFromSection(number, 'soulUrgeMeanings', locale);
}
