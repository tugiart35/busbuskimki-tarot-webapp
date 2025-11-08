/**
 * Numeroloji hesaplama fonksiyonları
 * Pythagorean numeroloji sistemi ile hesaplamalar
 */

import { NumerologyType, NumerologyResult, MASTER_NUMBERS } from './types';
import {
  getBirthdayNumberMeaning,
  getLifePathNumberMeaning,
  getExpressionNumberMeaning,
  getPersonalityNumberMeaning,
  getMaturityNumberMeaning,
  getPinnacleNumberMeaningSafe,
  getChallengeNumberMeaningSafe,
  getPersonalYearNumberMeaning,
  getCompatibilityNumberMeaning,
  getSoulUrgeNumberMeaning,
} from './meanings';
import {
  sumNameValues,
  sumVowelValues,
  sumConsonantValues,
  sumDateDigits,
  sumDigits,
  reduceToSingle,
  reduceWithMasters,
  reduceToSingleDigit,
  extractDateParts,
  getBirthdayNumber,
} from './normalize';

/**
 * Yaşam Yolu sayısını hesaplar
 * Doğum tarihinin rakamlarını toplar ve tek haneye indirger
 */
export function calculateLifePath(
  birthDate: string,
  locale: string = 'tr'
): NumerologyResult {
  const sum = sumDateDigits(birthDate);
  const number = reduceToSingleDigit(sum);
  const isMasterNumber = MASTER_NUMBERS.includes(number as any);

  const lifePathMeaning = getLifePathNumberMeaning(number, locale);

  // Fallback açıklama
  const fallbackDescription =
    locale === 'en'
      ? 'Shows the main lesson and journey theme in your life.'
      : locale === 'sr'
        ? 'Pokazuje glavnu lekciju i temu putovanja u vašem životu.'
        : 'Yaşam amacınızı ve öğrenmeniz gereken dersleri gösterir.';

  return {
    number,
    isMasterNumber,
    description: lifePathMeaning || fallbackDescription,
    type: 'life-path',
  };
}

/**
 * İfade/Kader sayısını hesaplar
 * İsmin tüm harflerinin değerlerini toplar
 */
export function calculateExpressionDestiny(
  firstName: string,
  lastName: string,
  locale: string = 'tr'
): NumerologyResult {
  // İsim ve soyisimi birleştir
  const fullName = `${firstName} ${lastName}`.trim();
  const sum = sumNameValues(fullName);
  const number = reduceToSingleDigit(sum);
  const isMasterNumber = MASTER_NUMBERS.includes(number as any);

  const expressionMeaning = getExpressionNumberMeaning(number, locale);

  // Name normalization not needed for this calculation

  // Fallback açıklama
  const fallbackDescription =
    locale === 'en'
      ? 'Shows your natural talents and direction in life.'
      : locale === 'sr'
        ? 'Pokazuje vaše prirodne talente i smer u životu.'
        : 'Doğal yeteneklerinizi ve hayattaki yönünüzü gösterir.';

  return {
    number,
    isMasterNumber,
    description: expressionMeaning || fallbackDescription,
    type: 'expression-destiny',
  };
}

/**
 * Ruh Arzusu sayısını hesaplar
 * İsmin sesli harflerinin değerlerini toplar
 */
export function calculateSoulUrge(
  fullNameOrFirstName: string,
  lastNameOrLocale?: string,
  maybeLocale?: string
): NumerologyResult {
  const SUPPORTED_LOCALES = ['tr', 'en', 'sr'];
  const DEFAULT_LOCALE = 'tr';

  let firstName = fullNameOrFirstName ?? '';
  let lastName = '';
  let locale = DEFAULT_LOCALE;

  if (typeof maybeLocale === 'string') {
    locale = maybeLocale;
    lastName = lastNameOrLocale ?? '';
  } else if (typeof lastNameOrLocale === 'string') {
    const lowered = lastNameOrLocale.toLowerCase();
    if (SUPPORTED_LOCALES.includes(lowered)) {
      locale = lowered;
    } else {
      lastName = lastNameOrLocale;
    }
  }

  firstName = firstName.trim();
  lastName = (lastName ?? '').trim();

  if (!lastName && firstName.includes(' ')) {
    const parts = firstName.split(/\s+/).filter(Boolean);
    if (parts.length > 1) {
      firstName = parts.slice(0, -1).join(' ');
      lastName = parts.slice(-1).join(' ');
    } else {
      firstName = parts[0] ?? '';
    }
  }

  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  const sum = sumVowelValues(fullName);
  const number = reduceToSingleDigit(sum);
  const isMasterNumber = MASTER_NUMBERS.includes(number as any);

  const localeStr = locale?.toLowerCase?.().split('-')[0];
  const normalizedLocale: string =
    localeStr && SUPPORTED_LOCALES.includes(localeStr as any)
      ? localeStr
      : DEFAULT_LOCALE;

  // Ruh Arzusu sayısı için detaylı açıklamayı al
  const soulUrgeMeaning = getSoulUrgeNumberMeaning(number, normalizedLocale);

  // Eğer detaylı açıklama varsa onu kullan, yoksa genel açıklamayı kullan
  const descriptions: Record<string, string> = {
    tr: 'İç dünyanızı ve gerçek arzularınızı gösterir.',
    en: 'Reveals your inner motivations and true soul desires.',
    sr: 'Otkriva vaše unutrašnje motivacije i želje duše.',
  };

  const finalDescription = (soulUrgeMeaning ??
    descriptions[normalizedLocale] ??
    descriptions[DEFAULT_LOCALE] ??
    descriptions.tr) as string;

  return {
    number,
    isMasterNumber,
    description: finalDescription,
    type: 'soul-urge',
  };
}

/**
 * Kişilik sayısını hesaplar
 * İsmin ünsüz harflerinin değerlerini toplar
 */
export function calculatePersonality(
  firstName: string,
  lastName: string,
  locale: string = 'tr'
): NumerologyResult {
  // İsim ve soyisimi birleştir
  const fullName = `${firstName} ${lastName}`.trim();
  const sum = sumConsonantValues(fullName);
  const number = reduceToSingleDigit(sum);
  const isMasterNumber = MASTER_NUMBERS.includes(number as any);

  // Name normalization not needed for this calculation
  // Consonant calculation not needed for this function

  // Kişilik sayısı anlamını al
  const personalityMeaning = getPersonalityNumberMeaning(number, locale);
  let description =
    'Dışarıdan nasıl algılandığınızı ve ilk izlenim kimyanızı gösterir.';

  if (personalityMeaning) {
    description = personalityMeaning;
  } else {
    // Fallback açıklamalar
    const fallbackDescriptions: Record<string, string> = {
      en: 'Shows how you are perceived from the outside and your first impression chemistry.',
      sr: 'Pokazuje kako ste percipirani spolja i vašu hemiju prvog utiska.',
    };
    description = fallbackDescriptions[locale] || description;
  }

  return {
    number,
    isMasterNumber,
    description,
    type: 'personality',
  };
}

/**
 * Doğum günü sayısını hesaplar
 * Ayın kaçında doğduğunuzu gösterir
 */
export function calculateBirthdayNumber(
  birthDate: string,
  locale: string = 'tr'
): NumerologyResult {
  const { day } = extractDateParts(birthDate);
  const number = getBirthdayNumber(day);
  const isMasterNumber = MASTER_NUMBERS.includes(number as any);

  // Lokalizasyon için doğum günü anlamını al
  const birthdayMeaning = getBirthdayNumberMeaning(number, locale);

  // Fallback açıklama
  const fallbackDescription =
    locale === 'en'
      ? 'Shows your natural gifts and talents from birth.'
      : locale === 'sr'
        ? 'Pokazuje vaše prirodne darove i talente od rođenja.'
        : 'Doğuştan gelen doğal hediyelerinizi ve yeteneklerinizi gösterir.';

  return {
    number,
    isMasterNumber,
    description: birthdayMeaning || fallbackDescription,
    type: 'birthday-number',
  };
}

/**
 * Olgunluk sayısını hesaplar
 * İfade + Yaşam Yolu toplamı
 */
export function calculateMaturity(
  lifePathNumber: number,
  expressionNumber: number,
  locale: string = 'tr'
): NumerologyResult {
  const sum = lifePathNumber + expressionNumber;
  const number = reduceToSingleDigit(sum);
  const isMasterNumber = MASTER_NUMBERS.includes(number as any);

  // Olgunluk sayısı anlamını al
  const maturityMeaning = getMaturityNumberMeaning(number, locale);
  let description =
    '35+ yaş sonrası ana temanızı ve olgunluk döneminizdeki odaklanma alanınızı gösterir.';

  if (maturityMeaning) {
    description = maturityMeaning;
  } else {
    // Fallback açıklamalar
    const fallbackDescriptions: Record<string, string> = {
      en: 'Shows your main theme after age 35+ and your focus area in your maturity period.',
      sr: 'Pokazuje vašu glavnu temu nakon 35+ godina i vašu oblast fokusa u periodu zrelosti.',
    };
    description = fallbackDescriptions[locale] || description;
  }

  return {
    number,
    isMasterNumber,
    description,
    type: 'maturity',
  };
}

function lifePathSingleDigit(year: number, month: number, day: number): number {
  // Life Path tek haneye (11/22 burada tek haneye indirgenir; dönem hesabı böyle yapılır)
  const total = sumDigits(year) + sumDigits(month) + sumDigits(day);
  return reduceToSingle(total);
}

function formatPeriodLabel(
  locale: string,
  start: number,
  end?: number
): string {
  const loc = (locale?.toLowerCase?.().split('-')[0] ?? 'tr') as
    | 'tr'
    | 'en'
    | 'sr';
  if (!end && end !== 0) {
    return loc === 'en'
      ? `Age ${start}+`
      : loc === 'sr'
        ? `${start}+ godina`
        : `${start}+ yaş`;
  }
  return loc === 'en'
    ? `Age ${start}–${end}`
    : loc === 'sr'
      ? `${start}–${end} godina`
      : `${start}–${end} yaş`;
}

export function calculatePinnaclesChallenges(
  birthDate: string,
  locale: string = 'tr'
): NumerologyResult {
  if (!birthDate || typeof birthDate !== 'string' || birthDate.trim() === '') {
    throw new Error('Doğum tarihi gerekli ve geçerli bir format olmalı');
  }

  const { month, day, year } = extractDateParts(birthDate);

  // Bileşenleri tek haneye indir (master koruması burada yok)
  const m = reduceToSingle(sumDigits(month));
  const d = reduceToSingle(sumDigits(day));
  const y = reduceToSingle(sumDigits(year));

  // Yaşam Yolu (tek hane) → dönem sonları
  const lp = lifePathSingleDigit(year, month, day);
  const firstEnd = 36 - lp; // 27..35 aralığı
  const secondEnd = firstEnd + 9; // +9 yıl
  const thirdEnd = secondEnd + 9; // +9 yıl

  // Zirveler (sonuç 11/22/33 ise koru)
  const p1 = reduceWithMasters(m + d);
  const p2 = reduceWithMasters(d + y);
  const p3 = reduceWithMasters(reduceToSingle(p1) + reduceToSingle(p2));
  const p4 = reduceWithMasters(m + y);

  // Zorluklar (0–8; master yok)
  const c1 = reduceToSingle(Math.abs(m - d));
  const c2 = reduceToSingle(Math.abs(d - y));
  const c3 = reduceToSingle(Math.abs(c1 - c2));
  const c4 = reduceToSingle(Math.abs(m - y));

  // Açıklamalar (senin mevcut getter’larınla)
  const pinnacle1Meaning = getPinnacleNumberMeaningSafe(p1, locale);
  const pinnacle2Meaning = getPinnacleNumberMeaningSafe(p2, locale);
  const pinnacle3Meaning = getPinnacleNumberMeaningSafe(p3, locale);
  const pinnacle4Meaning = getPinnacleNumberMeaningSafe(p4, locale);

  const challenge1Meaning = getChallengeNumberMeaningSafe(c1, locale);
  const challenge2Meaning = getChallengeNumberMeaningSafe(c2, locale);
  const challenge3Meaning = getChallengeNumberMeaningSafe(c3, locale);
  const challenge4Meaning = getChallengeNumberMeaningSafe(c4, locale);

  const periodLabels = [
    formatPeriodLabel(locale, 0, firstEnd),
    formatPeriodLabel(locale, firstEnd + 1, secondEnd),
    formatPeriodLabel(locale, secondEnd + 1, thirdEnd),
    formatPeriodLabel(locale, thirdEnd + 1),
  ] as const;
  const [period1, period2, period3, period4] = periodLabels;

  const pinnacles = [
    { period: period1, number: p1, description: pinnacle1Meaning ?? '' },
    { period: period2, number: p2, description: pinnacle2Meaning ?? '' },
    { period: period3, number: p3, description: pinnacle3Meaning ?? '' },
    { period: period4, number: p4, description: pinnacle4Meaning ?? '' },
  ];

  const challenges = [
    { period: period1, number: c1, description: challenge1Meaning ?? '' },
    { period: period2, number: c2, description: challenge2Meaning ?? '' },
    { period: period3, number: c3, description: challenge3Meaning ?? '' },
    { period: period4, number: c4, description: challenge4Meaning ?? '' },
  ];

  const loc = locale?.toLowerCase?.().split('-')[0] ?? 'tr';
  const descMap = {
    tr: 'Hayatını dört döneme ayırır; her dönemin teması (Zirve) ve sınavı (Zorluk) gösterilir.',
    en: 'Divides life into four periods and shows each period’s theme (Pinnacle) and lesson (Challenge).',
    sr: 'Deli život na četiri perioda i pokazuje temu (Vrh) i izazov svakog perioda.',
  };
  const localeKey: keyof typeof descMap =
    loc === 'en' || loc === 'sr' ? (loc as 'en' | 'sr') : 'tr';
  const description = descMap[localeKey];

  return {
    number: 0,
    isMasterNumber: false,
    description,
    type: 'pinnacles-challenges',
    pinnacles,
    challenges,
  };
}
/**
 * Kişisel döngüler hesaplar
 * Yıllık, aylık, günlük enerji takvimi
 */
export function calculatePersonalCycles(
  birthDate: string,
  targetDate: string,
  locale: string = 'tr'
): NumerologyResult {
  const normalizedLocale = locale?.toLowerCase?.().split('-')[0] ?? 'tr';

  const { month: birthMonth, day: birthDay } = extractDateParts(birthDate);
  const { month: targetMonth, day: targetDay } = extractDateParts(targetDate);

  // Kişisel yıl
  const personalYear = reduceToSingleDigit(
    birthMonth + birthDay + sumDateDigits(targetDate)
  );

  // Kişisel ay
  const personalMonth = reduceToSingleDigit(personalYear + targetMonth);

  // Kişisel gün
  const personalDay = reduceToSingleDigit(personalMonth + targetDay);

  // Kişisel yıl açıklamasını al
  const personalYearMeaning = getPersonalYearNumberMeaning(
    personalYear,
    locale
  );

  // Ana açıklama
  let description = 'Yıllık, aylık ve günlük enerji takviminizi gösterir.';
  const fallbackDescriptions: Record<string, string> = {
    en: 'Shows your annual, monthly, and daily energy calendar.',
    sr: 'Pokazuje vaš godišnji, mesečni i dnevni energetski kalendar.',
  };
  description = fallbackDescriptions[normalizedLocale] || description;

  // Kişisel yıl açıklaması varsa ekle
  if (personalYearMeaning) {
    const yearTitleMap: Record<string, string> = {
      tr: `**Kişisel Yıl ${personalYear}:**`,
      en: `**Personal Year ${personalYear}:**`,
      sr: `**Lična Godina ${personalYear}:**`,
    };
    const yearTitle = yearTitleMap[normalizedLocale] ?? yearTitleMap.tr;
    description += `\n\n${yearTitle}\n${personalYearMeaning}`;
  }

  return {
    number: personalYear,
    isMasterNumber: MASTER_NUMBERS.includes(personalYear as any),
    description,
    type: 'personal-cycles',
    personalYear,
    personalMonth,
    personalDay,
  };
}

/**
 * Uyum analizi hesaplar
 * İki kişinin uyumunu değerlendirir
 */
export function calculateCompatibility(
  personA: { birthDate: string; firstName: string; lastName: string },
  personB: { birthDate: string; firstName: string; lastName: string },
  locale: string = 'tr'
): NumerologyResult {
  // Her kişi için ana sayıları hesapla
  const lifePathA = calculateLifePath(personA.birthDate, locale);
  const expressionA = calculateExpressionDestiny(
    personA.firstName,
    personA.lastName,
    locale
  );
  const soulUrgeA = calculateSoulUrge(
    personA.firstName,
    personA.lastName,
    locale
  );
  const personalityA = calculatePersonality(
    personA.firstName,
    personA.lastName,
    locale
  );

  const lifePathB = calculateLifePath(personB.birthDate, locale);
  const expressionB = calculateExpressionDestiny(
    personB.firstName,
    personB.lastName,
    locale
  );
  const soulUrgeB = calculateSoulUrge(
    personB.firstName,
    personB.lastName,
    locale
  );
  const personalityB = calculatePersonality(
    personB.firstName,
    personB.lastName,
    locale
  );

  const normalizedLocale = locale?.toLowerCase?.().split('-')[0] ?? 'tr';

  // Uyum skorunu hesapla
  let score = 0;
  const notes: string[] = [];

  // Yaşam yolu uyumu
  const lifePathNotes: Record<
    'tr' | 'en' | 'sr',
    { exact: string; close: string; diff: string }
  > = {
    tr: {
      exact: 'Aynı yaşam yolu sayısı - güçlü anlayış',
      close: 'Uyumlu yaşam yolu sayıları',
      diff: 'Farklı yaşam yolu sayıları - çeşitlilik',
    },
    en: {
      exact: 'Same life path number - strong understanding',
      close: 'Harmonious life path numbers',
      diff: 'Different life path numbers - diversity',
    },
    sr: {
      exact: 'Isti broj životnog puta - snažno razumevanje',
      close: 'Kompatibilni brojevi životnog puta',
      diff: 'Različiti brojevi životnog puta - raznovrsnost',
    },
  };
  const expressionNotes: Record<
    'tr' | 'en' | 'sr',
    { exact: string; close: string; diff: string }
  > = {
    tr: {
      exact: 'Aynı ifade sayısı - benzer yetenekler',
      close: 'Uyumlu ifade sayıları',
      diff: 'Farklı ifade sayıları - tamamlayıcılık',
    },
    en: {
      exact: 'Same expression number - similar talents',
      close: 'Harmonious expression numbers',
      diff: 'Different expression numbers - complementarity',
    },
    sr: {
      exact: 'Isti broj izraza - slični talenti',
      close: 'Kompatibilni brojevi izraza',
      diff: 'Različiti brojevi izraza - komplementarnost',
    },
  };
  const soulUrgeNotes: Record<
    'tr' | 'en' | 'sr',
    { exact: string; close: string; diff: string }
  > = {
    tr: {
      exact: 'Aynı ruh arzusu - derin bağlantı',
      close: 'Uyumlu ruh arzuları',
      diff: 'Farklı ruh arzuları - denge',
    },
    en: {
      exact: 'Same soul urge - deep connection',
      close: 'Harmonious soul urges',
      diff: 'Different soul urges - balance',
    },
    sr: {
      exact: 'Ista želja duše - duboka veza',
      close: 'Kompatibilne želje duše',
      diff: 'Različite želje duše - ravnoteža',
    },
  };
  const personalityNotes: Record<
    'tr' | 'en' | 'sr',
    { exact: string; close: string; diff: string }
  > = {
    tr: {
      exact: 'Aynı kişilik sayısı - benzer dış görünüm',
      close: 'Uyumlu kişilik sayıları',
      diff: 'Farklı kişilik sayıları - çekicilik',
    },
    en: {
      exact: 'Same personality number - similar outward vibe',
      close: 'Harmonious personality numbers',
      diff: 'Different personality numbers - attraction',
    },
    sr: {
      exact: 'Isti broj ličnosti - sličan spoljašnji utisak',
      close: 'Kompatibilni brojevi ličnosti',
      diff: 'Različiti brojevi ličnosti - privlačnost',
    },
  };

  const noteLocale: 'tr' | 'en' | 'sr' =
    normalizedLocale === 'en' || normalizedLocale === 'sr'
      ? normalizedLocale
      : 'tr';

  if (lifePathA.number === lifePathB.number) {
    score += 25;
    notes.push(lifePathNotes[noteLocale].exact);
  } else if (Math.abs(lifePathA.number - lifePathB.number) <= 1) {
    score += 20;
    notes.push(lifePathNotes[noteLocale].close);
  } else {
    score += 10;
    notes.push(lifePathNotes[noteLocale].diff);
  }

  // İfade uyumu
  if (expressionA.number === expressionB.number) {
    score += 25;
    notes.push(expressionNotes[noteLocale].exact);
  } else if (Math.abs(expressionA.number - expressionB.number) <= 1) {
    score += 20;
    notes.push(expressionNotes[noteLocale].close);
  } else {
    score += 10;
    notes.push(expressionNotes[noteLocale].diff);
  }

  // Ruh arzusu uyumu
  if (soulUrgeA.number === soulUrgeB.number) {
    score += 25;
    notes.push(soulUrgeNotes[noteLocale].exact);
  } else if (Math.abs(soulUrgeA.number - soulUrgeB.number) <= 1) {
    score += 20;
    notes.push(soulUrgeNotes[noteLocale].close);
  } else {
    score += 10;
    notes.push(soulUrgeNotes[noteLocale].diff);
  }

  // Kişilik uyumu
  if (personalityA.number === personalityB.number) {
    score += 25;
    notes.push(personalityNotes[noteLocale].exact);
  } else if (Math.abs(personalityA.number - personalityB.number) <= 1) {
    score += 20;
    notes.push(personalityNotes[noteLocale].close);
  } else {
    score += 10;
    notes.push(personalityNotes[noteLocale].diff);
  }

  // Genel uyum sayısı
  const compatibilityNumber = reduceToSingleDigit(score);

  // Uyum sayısı açıklamasını al
  const compatibilityMeaning = getCompatibilityNumberMeaning(
    compatibilityNumber,
    locale
  );

  // Ana açıklama
  let description = 'İki kişi arasındaki numerolojik uyumu analiz eder.';
  const fallbackDescriptions: Record<string, string> = {
    en: 'Analyzes the numerological compatibility between two people.',
    sr: 'Analizira numerološku kompatibilnost između dve osobe.',
  };
  description = fallbackDescriptions[normalizedLocale] || description;

  // Uyum sayısı açıklaması varsa ekle
  if (compatibilityMeaning) {
    const compatibilityTitleMap: Record<string, string> = {
      tr: `**Uyum Sayısı ${compatibilityNumber}:**`,
      en: `**Compatibility Number ${compatibilityNumber}:**`,
      sr: `**Broj Kompatibilnosti ${compatibilityNumber}:**`,
    };
    const compatibilityTitle =
      compatibilityTitleMap[normalizedLocale] ?? compatibilityTitleMap.tr;
    description += `\n\n${compatibilityTitle}\n${compatibilityMeaning}`;
  }

  return {
    number: compatibilityNumber,
    isMasterNumber: MASTER_NUMBERS.includes(compatibilityNumber as any),
    description,
    type: 'compatibility',
    compatibilityScore: score,
    compatibilityNotes: notes,
  };
}

/**
 * Numeroloji tipine göre hesaplama yapar
 */
export function calculateNumerology(
  type: NumerologyType,
  input: {
    fullName?: string;
    firstName?: string;
    lastName?: string;
    birthDate?: string;
    date?: string;
    targetDate?: string;
    personA?: { birthDate: string; firstName: string; lastName: string };
    personB?: { birthDate: string; firstName: string; lastName: string };
  },
  locale: string = 'tr'
): NumerologyResult {
  switch (type) {
    case 'life-path':
      if (!input.birthDate) {
        throw new Error('Doğum tarihi gerekli');
      }
      return calculateLifePath(input.birthDate, locale);

    case 'expression-destiny':
      if (!input.firstName || !input.lastName) {
        throw new Error('İsim ve soyisim gerekli');
      }
      return calculateExpressionDestiny(
        input.firstName,
        input.lastName,
        locale
      );

    case 'soul-urge':
      if (!input.firstName || !input.lastName) {
        throw new Error('İsim ve soyisim gerekli');
      }
      return calculateSoulUrge(input.firstName, input.lastName, locale);

    case 'personality':
      if (!input.firstName || !input.lastName) {
        throw new Error('İsim ve soyisim gerekli');
      }
      return calculatePersonality(input.firstName, input.lastName, locale);

    case 'birthday-number':
      if (!input.birthDate) {
        throw new Error('Doğum tarihi gerekli');
      }
      return calculateBirthdayNumber(input.birthDate, locale);

    case 'maturity':
      if (!input.birthDate || !input.firstName || !input.lastName) {
        throw new Error('Doğum tarihi, isim ve soyisim gerekli');
      }
      const lifePath = calculateLifePath(input.birthDate, locale);
      const expression = calculateExpressionDestiny(
        input.firstName,
        input.lastName,
        locale
      );
      return calculateMaturity(lifePath.number, expression.number, locale);

    case 'pinnacles-challenges':
      if (!input.birthDate) {
        throw new Error('Doğum tarihi gerekli');
      }
      return calculatePinnaclesChallenges(input.birthDate, locale);

    case 'personal-cycles':
      if (!input.birthDate || !input.targetDate) {
        throw new Error('Doğum tarihi ve hedef tarih gerekli');
      }
      return calculatePersonalCycles(input.birthDate, input.targetDate, locale);

    case 'compatibility':
      if (!input.personA || !input.personB) {
        throw new Error('İki kişinin bilgileri gerekli');
      }
      return calculateCompatibility(input.personA, input.personB, locale);

    default:
      throw new Error('Geçersiz numeroloji tipi');
  }
}
