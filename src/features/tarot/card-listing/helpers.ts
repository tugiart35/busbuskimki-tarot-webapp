import { resolveVariantByLocale, type SupportedLocale } from './config';
import type { MajorArcanaCard, MinorArcanaCard } from './cardData';

const MAJOR_ARCANA_SLUGS: Record<
  MajorArcanaCard['key'],
  Record<SupportedLocale, string>
> = {
  'the-fool': { tr: 'joker', en: 'the-fool', sr: 'joker' },
  'the-magician': { tr: 'buyucu', en: 'the-magician', sr: 'carobnjak' },
  'the-high-priestess': {
    tr: 'yuksek-rahibe',
    en: 'the-high-priestess',
    sr: 'visoka-svestenica',
  },
  'the-empress': { tr: 'imparatorice', en: 'the-empress', sr: 'carica' },
  'the-emperor': { tr: 'imparator', en: 'the-emperor', sr: 'car' },
  'the-hierophant': {
    tr: 'basrahip',
    en: 'the-hierophant',
    sr: 'visoki-svestenik',
  },
  'the-lovers': { tr: 'asiklar', en: 'the-lovers', sr: 'ljubavnici' },
  'the-chariot': { tr: 'savas-arabasi', en: 'the-chariot', sr: 'kola' },
  strength: { tr: 'guc', en: 'strength', sr: 'snaga' },
  'the-hermit': { tr: 'ermis', en: 'the-hermit', sr: 'pustinjak' },
  wheeloffortune: { tr: 'kader-carki', en: 'wheeloffortune', sr: 'kolo-srece' },
  justice: { tr: 'adalet', en: 'justice', sr: 'pravda' },
  'the-hanged-man': {
    tr: 'asili-adam',
    en: 'the-hanged-man',
    sr: 'obeseni-covek',
  },
  death: { tr: 'olum', en: 'death', sr: 'smrt' },
  temperance: { tr: 'olcululuk', en: 'temperance', sr: 'umerenost' },
  'the-devil': { tr: 'seytan', en: 'the-devil', sr: 'davo' },
  'the-tower': { tr: 'kule', en: 'the-tower', sr: 'kula' },
  'the-star': { tr: 'yildiz', en: 'the-star', sr: 'zvezda' },
  'the-moon': { tr: 'ay', en: 'the-moon', sr: 'mesec' },
  'the-sun': { tr: 'gunes', en: 'the-sun', sr: 'sunce' },
  Judgement: { tr: 'yargi', en: 'Judgement', sr: 'sud' },
  'the-world': { tr: 'dunya', en: 'the-world', sr: 'svet' },
};

export const SUIT_LABELS: Record<
  SupportedLocale,
  Record<MinorArcanaCard['suit'], string>
> = {
  tr: {
    Cups: 'Kupalar',
    Pentacles: 'Tılsımlar',
    Swords: 'Kılıçlar',
    Wands: 'Asalar',
  },
  en: {
    Cups: 'Cups',
    Pentacles: 'Pentacles',
    Swords: 'Swords',
    Wands: 'Wands',
  },
  sr: {
    Cups: 'Kupovi',
    Pentacles: 'Pentakli',
    Swords: 'Mačevi',
    Wands: 'Štapovi',
  },
};

export const SUIT_COLORS: Record<MinorArcanaCard['suit'], string> = {
  Cups: 'from-pink-500 to-rose-500',
  Pentacles: 'from-yellow-500 to-amber-500',
  Swords: 'from-blue-500 to-indigo-500',
  Wands: 'from-red-500 to-orange-500',
};

export function getMinorArcanaSlug(
  cardKey: string,
  locale: SupportedLocale
): string {
  const suit = getSuitFromCardKey(cardKey);
  const number = getNumberFromCardKey(cardKey);

  if (locale === 'tr') {
    const suitNames = {
      cups: 'kupalar',
      pentacles: 'yildizlar',
      swords: 'kiliclar',
      wands: 'asalar',
    };
    const numberNames = {
      ace: 'asi',
      two: 'ikili',
      three: 'uclu',
      four: 'dortlu',
      five: 'besli',
      six: 'altili',
      seven: 'yedili',
      eight: 'sekizli',
      nine: 'dokuzlu',
      ten: 'onlu',
      page: 'prensi',
      knight: 'sovalyesi',
      queen: 'kralicesi',
      king: 'krali',
    };
    return `${suitNames[suit]}-${numberNames[number]}`;
  }

  if (locale === 'sr') {
    const suitNames = {
      cups: 'kupa',
      pentacles: 'novcic',
      swords: 'mace',
      wands: 'stap',
    };
    const numberNames = {
      ace: 'as',
      two: 'dvojka',
      three: 'trojka',
      four: 'cetvorka',
      five: 'petica',
      six: 'sestica',
      seven: 'sedmica',
      eight: 'osmica',
      nine: 'devetka',
      ten: 'desetka',
      page: 'ucak',
      knight: 'vitez',
      queen: 'kraljica',
      king: 'kralj',
    };
    return `${suitNames[suit]}-${numberNames[number]}`;
  }

  return cardKey;
}

export function getCardSlug(cardKey: string, locale: SupportedLocale): string {
  const majorArcanaEntry =
    MAJOR_ARCANA_SLUGS[cardKey as keyof typeof MAJOR_ARCANA_SLUGS];

  if (majorArcanaEntry) {
    return majorArcanaEntry[locale];
  }

  return getMinorArcanaSlug(cardKey, locale);
}

export function getCardUrl(locale: SupportedLocale, cardKey: string): string {
  const segment = resolveVariantByLocale(locale);
  const slug = getCardSlug(cardKey, locale);

  return `/${locale}/${segment}/${slug}`;
}

export function getCardImagePath(cardKey: string): string {
  const majorArcanaMapping: Record<string, string> = {
    'the-fool': '0-Fool',
    'the-magician': 'I-Magician',
    'the-high-priestess': 'II-HighPriestess',
    'the-empress': 'III-Empress',
    'the-emperor': 'IV-Emperor',
    'the-hierophant': 'V-Hierophant',
    'the-lovers': 'VI-Lovers',
    'the-chariot': 'VII-Chariot',
    strength: 'VIII-Strength',
    'the-hermit': 'IX-Hermit',
    wheeloffortune: 'X-WheelOfFortune',
    justice: 'XI-Justice',
    'the-hanged-man': 'XII-HangedMan',
    death: 'XIII-Death',
    temperance: 'XIV-Temperance',
    'the-devil': 'XV-Devil',
    'the-tower': 'XVI-Tower',
    'the-star': 'XVII-Star',
    'the-moon': 'XVIII-Moon',
    'the-sun': 'XIX-Sun',
    Judgement: 'XX-Judgement',
    'the-world': 'XXI-World',
  };

  if (majorArcanaMapping[cardKey]) {
    return `/cards/rws/${majorArcanaMapping[cardKey]}.webp`;
  }

  const suit = getSuitFromCardKey(cardKey);
  const cardName = getNumberCodeFromCardKey(cardKey);

  return `/cards/rws/${cardName}-${capitalizeFirstLetter(suit)}.webp`;
}

export function getFeaturedItemDescription(
  locale: SupportedLocale,
  cardName: string
): string {
  if (locale === 'tr') {
    return `${cardName} tarot kartı anlamı ve ters yorumu`;
  }
  if (locale === 'sr') {
    return `${cardName} tarot karta – značenje i obrnuto tumačenje`;
  }
  return `${cardName} tarot card meaning and reversed interpretation`;
}

function getSuitFromCardKey(cardKey: string) {
  if (cardKey.includes('cups')) {
    return 'cups';
  }
  if (cardKey.includes('pentacles')) {
    return 'pentacles';
  }
  if (cardKey.includes('swords')) {
    return 'swords';
  }
  return 'wands';
}

function getNumberFromCardKey(cardKey: string) {
  if (cardKey.includes('ace')) {
    return 'ace';
  }
  if (cardKey.includes('two')) {
    return 'two';
  }
  if (cardKey.includes('three')) {
    return 'three';
  }
  if (cardKey.includes('four')) {
    return 'four';
  }
  if (cardKey.includes('five')) {
    return 'five';
  }
  if (cardKey.includes('six')) {
    return 'six';
  }
  if (cardKey.includes('seven')) {
    return 'seven';
  }
  if (cardKey.includes('eight')) {
    return 'eight';
  }
  if (cardKey.includes('nine')) {
    return 'nine';
  }
  if (cardKey.includes('ten')) {
    return 'ten';
  }
  if (cardKey.includes('knight')) {
    return 'knight';
  }
  if (cardKey.includes('queen')) {
    return 'queen';
  }
  if (cardKey.includes('king')) {
    return 'king';
  }
  return 'page';
}

function getNumberCodeFromCardKey(cardKey: string) {
  if (cardKey.includes('ace')) {
    return 'Ace';
  }
  if (cardKey.includes('two')) {
    return 'II';
  }
  if (cardKey.includes('three')) {
    return 'III';
  }
  if (cardKey.includes('four')) {
    return 'IV';
  }
  if (cardKey.includes('five')) {
    return 'V';
  }
  if (cardKey.includes('six')) {
    return 'VI';
  }
  if (cardKey.includes('seven')) {
    return 'VII';
  }
  if (cardKey.includes('eight')) {
    return 'VIII';
  }
  if (cardKey.includes('nine')) {
    return 'IX';
  }
  if (cardKey.includes('ten')) {
    return 'X';
  }
  if (cardKey.includes('knight')) {
    return 'Knight';
  }
  if (cardKey.includes('queen')) {
    return 'Queen';
  }
  if (cardKey.includes('king')) {
    return 'King';
  }
  return 'Page';
}

function capitalizeFirstLetter(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
