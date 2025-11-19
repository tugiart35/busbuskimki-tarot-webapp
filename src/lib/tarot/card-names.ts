/**
 * Tarot Card Name Mappings - Complete Localization
 *
 * Provides localized names for all 78 tarot cards (22 Major + 56 Minor Arcana)
 * Used for display, alt texts, and SEO optimization.
 *
 * @module card-names
 */

export type CardKey = string;
export type Locale = 'tr' | 'en' | 'sr';

interface CardNames {
  [key: string]: string;
}

/**
 * Major Arcana Card Names (22 cards)
 */
export const MAJOR_ARCANA_NAMES: Record<Locale, CardNames> = {
  tr: {
    'the-fool': 'Joker',
    'the-magician': 'Büyücü',
    'the-high-priestess': 'Azize',
    'the-empress': 'İmparatoriçe',
    'the-emperor': 'İmparator',
    'the-hierophant': 'Aziz',
    'the-lovers': 'Aşıklar',
    'the-chariot': 'Savaş Arabası',
    strength: 'Güç',
    'the-hermit': 'Ermiş',
    wheeloffortune: 'Kader Çarkı',
    justice: 'Adalet',
    'the-hanged-man': 'Asılan Adam',
    death: 'Ölüm',
    temperance: 'Denge',
    'the-devil': 'Şeytan',
    'the-tower': 'Kule',
    'the-star': 'Yıldız',
    'the-moon': 'Ay',
    'the-sun': 'Güneş',
    Judgement: 'Mahkeme',
    'the-world': 'Dünya',
  },
  en: {
    'the-fool': 'The Fool',
    'the-magician': 'The Magician',
    'the-high-priestess': 'The High Priestess',
    'the-empress': 'The Empress',
    'the-emperor': 'The Emperor',
    'the-hierophant': 'The Hierophant',
    'the-lovers': 'The Lovers',
    'the-chariot': 'The Chariot',
    strength: 'Strength',
    'the-hermit': 'The Hermit',
    wheeloffortune: 'Wheel of Fortune',
    justice: 'Justice',
    'the-hanged-man': 'The Hanged Man',
    death: 'Death',
    temperance: 'Temperance',
    'the-devil': 'The Devil',
    'the-tower': 'The Tower',
    'the-star': 'The Star',
    'the-moon': 'The Moon',
    'the-sun': 'The Sun',
    Judgement: 'Judgement',
    'the-world': 'The World',
  },
  sr: {
    'the-fool': 'Luda',
    'the-magician': 'Mađioničar',
    'the-high-priestess': 'Visoka Sveštenica',
    'the-empress': 'Carica',
    'the-emperor': 'Car',
    'the-hierophant': 'Papa',
    'the-lovers': 'Ljubavnici',
    'the-chariot': 'Kola',
    strength: 'Snaga',
    'the-hermit': 'Pustinjak',
    wheeloffortune: 'Točak Sreće',
    justice: 'Pravda',
    'the-hanged-man': 'Obešeni',
    death: 'Smrt',
    temperance: 'Umerenost',
    'the-devil': 'Đavo',
    'the-tower': 'Kula',
    'the-star': 'Zvezda',
    'the-moon': 'Mesec',
    'the-sun': 'Sunce',
    Judgement: 'Sud',
    'the-world': 'Svet',
  },
};

/**
 * Minor Arcana Card Names (56 cards)
 */
export const MINOR_ARCANA_NAMES: Record<Locale, CardNames> = {
  tr: {
    // Cups (Kupa) - 14 cards
    'ace-of-cups': 'Kupa Ası',
    'two-of-cups': 'Kupa İkilisi',
    'three-of-cups': 'Kupa Üçlüsü',
    'four-of-cups': 'Kupa Dörtlüsü',
    'five-of-cups': 'Kupa Beşlisi',
    'six-of-cups': 'Kupa Altılısı',
    'seven-of-cups': 'Kupa Yedilisi',
    'eight-of-cups': 'Kupa Sekizlisi',
    'nine-of-cups': 'Kupa Dokuzlusu',
    'ten-of-cups': 'Kupa Onlusu',
    'page-of-cups': 'Kupa Prensi',
    'knight-of-cups': 'Kupa Şövalyesi',
    'queen-of-cups': 'Kupa Kraliçesi',
    'king-of-cups': 'Kupa Kralı',

    // Pentacles (Tılsım) - 14 cards
    'ace-of-pentacles': 'Tılsım Ası',
    'two-of-pentacles': 'Tılsım İkilisi',
    'three-of-pentacles': 'Tılsım Üçlüsü',
    'four-of-pentacles': 'Tılsım Dörtlüsü',
    'five-of-pentacles': 'Tılsım Beşlisi',
    'six-of-pentacles': 'Tılsım Altılısı',
    'seven-of-pentacles': 'Tılsım Yedilisi',
    'eight-of-pentacles': 'Tılsım Sekizlisi',
    'nine-of-pentacles': 'Tılsım Dokuzlusu',
    'ten-of-pentacles': 'Tılsım Onlusu',
    'page-of-pentacles': 'Tılsım Prensi',
    'knight-of-pentacles': 'Tılsım Şövalyesi',
    'queen-of-pentacles': 'Tılsım Kraliçesi',
    'king-of-pentacles': 'Tılsım Kralı',

    // Swords (Kılıç) - 14 cards
    'ace-of-swords': 'Kılıç Ası',
    'two-of-swords': 'Kılıç İkilisi',
    'three-of-swords': 'Kılıç Üçlüsü',
    'four-of-swords': 'Kılıç Dörtlüsü',
    'five-of-swords': 'Kılıç Beşlisi',
    'six-of-swords': 'Kılıç Altılısı',
    'seven-of-swords': 'Kılıç Yedilisi',
    'eight-of-swords': 'Kılıç Sekizlisi',
    'nine-of-swords': 'Kılıç Dokuzlusu',
    'ten-of-swords': 'Kılıç Onlusu',
    'page-of-swords': 'Kılıç Prensi',
    'knight-of-swords': 'Kılıç Şövalyesi',
    'queen-of-swords': 'Kılıç Kraliçesi',
    'king-of-swords': 'Kılıç Kralı',

    // Wands (Asa) - 14 cards
    'ace-of-wands': 'Asa Ası',
    'two-of-wands': 'Asa İkilisi',
    'three-of-wands': 'Asa Üçlüsü',
    'four-of-wands': 'Asa Dörtlüsü',
    'five-of-wands': 'Asa Beşlisi',
    'six-of-wands': 'Asa Altılısı',
    'seven-of-wands': 'Asa Yedilisi',
    'eight-of-wands': 'Asa Sekizlisi',
    'nine-of-wands': 'Asa Dokuzlusu',
    'ten-of-wands': 'Asa Onlusu',
    'page-of-wands': 'Asa Prensi',
    'knight-of-wands': 'Asa Şövalyesi',
    'queen-of-wands': 'Asa Kraliçesi',
    'king-of-wands': 'Asa Kralı',
  },
  en: {
    // Cups - 14 cards
    'ace-of-cups': 'Ace of Cups',
    'two-of-cups': 'Two of Cups',
    'three-of-cups': 'Three of Cups',
    'four-of-cups': 'Four of Cups',
    'five-of-cups': 'Five of Cups',
    'six-of-cups': 'Six of Cups',
    'seven-of-cups': 'Seven of Cups',
    'eight-of-cups': 'Eight of Cups',
    'nine-of-cups': 'Nine of Cups',
    'ten-of-cups': 'Ten of Cups',
    'page-of-cups': 'Page of Cups',
    'knight-of-cups': 'Knight of Cups',
    'queen-of-cups': 'Queen of Cups',
    'king-of-cups': 'King of Cups',

    // Pentacles - 14 cards
    'ace-of-pentacles': 'Ace of Pentacles',
    'two-of-pentacles': 'Two of Pentacles',
    'three-of-pentacles': 'Three of Pentacles',
    'four-of-pentacles': 'Four of Pentacles',
    'five-of-pentacles': 'Five of Pentacles',
    'six-of-pentacles': 'Six of Pentacles',
    'seven-of-pentacles': 'Seven of Pentacles',
    'eight-of-pentacles': 'Eight of Pentacles',
    'nine-of-pentacles': 'Nine of Pentacles',
    'ten-of-pentacles': 'Ten of Pentacles',
    'page-of-pentacles': 'Page of Pentacles',
    'knight-of-pentacles': 'Knight of Pentacles',
    'queen-of-pentacles': 'Queen of Pentacles',
    'king-of-pentacles': 'King of Pentacles',

    // Swords - 14 cards
    'ace-of-swords': 'Ace of Swords',
    'two-of-swords': 'Two of Swords',
    'three-of-swords': 'Three of Swords',
    'four-of-swords': 'Four of Swords',
    'five-of-swords': 'Five of Swords',
    'six-of-swords': 'Six of Swords',
    'seven-of-swords': 'Seven of Swords',
    'eight-of-swords': 'Eight of Swords',
    'nine-of-swords': 'Nine of Swords',
    'ten-of-swords': 'Ten of Swords',
    'page-of-swords': 'Page of Swords',
    'knight-of-swords': 'Knight of Swords',
    'queen-of-swords': 'Queen of Swords',
    'king-of-swords': 'King of Swords',

    // Wands - 14 cards
    'ace-of-wands': 'Ace of Wands',
    'two-of-wands': 'Two of Wands',
    'three-of-wands': 'Three of Wands',
    'four-of-wands': 'Four of Wands',
    'five-of-wands': 'Five of Wands',
    'six-of-wands': 'Six of Wands',
    'seven-of-wands': 'Seven of Wands',
    'eight-of-wands': 'Eight of Wands',
    'nine-of-wands': 'Nine of Wands',
    'ten-of-wands': 'Ten of Wands',
    'page-of-wands': 'Page of Wands',
    'knight-of-wands': 'Knight of Wands',
    'queen-of-wands': 'Queen of Wands',
    'king-of-wands': 'King of Wands',
  },
  sr: {
    // Kupovi (Cups) - 14 cards
    'ace-of-cups': 'As Kupova',
    'two-of-cups': 'Dvojka Kupova',
    'three-of-cups': 'Trojka Kupova',
    'four-of-cups': 'Četvorka Kupova',
    'five-of-cups': 'Petica Kupova',
    'six-of-cups': 'Šestica Kupova',
    'seven-of-cups': 'Sedmica Kupova',
    'eight-of-cups': 'Osmica Kupova',
    'nine-of-cups': 'Devetka Kupova',
    'ten-of-cups': 'Desetka Kupova',
    'page-of-cups': 'Dečko Kupova',
    'knight-of-cups': 'Vitez Kupova',
    'queen-of-cups': 'Kraljica Kupova',
    'king-of-cups': 'Kralj Kupova',

    // Pentakli (Pentacles) - 14 cards
    'ace-of-pentacles': 'As Pentakla',
    'two-of-pentacles': 'Dvojka Pentakla',
    'three-of-pentacles': 'Trojka Pentakla',
    'four-of-pentacles': 'Četvorka Pentakla',
    'five-of-pentacles': 'Petica Pentakla',
    'six-of-pentacles': 'Šestica Pentakla',
    'seven-of-pentacles': 'Sedmica Pentakla',
    'eight-of-pentacles': 'Osmica Pentakla',
    'nine-of-pentacles': 'Devetka Pentakla',
    'ten-of-pentacles': 'Desetka Pentakla',
    'page-of-pentacles': 'Dečko Pentakla',
    'knight-of-pentacles': 'Vitez Pentakla',
    'queen-of-pentacles': 'Kraljica Pentakla',
    'king-of-pentacles': 'Kralj Pentakla',

    // Mačevi (Swords) - 14 cards
    'ace-of-swords': 'As Mačeva',
    'two-of-swords': 'Dvojka Mačeva',
    'three-of-swords': 'Trojka Mačeva',
    'four-of-swords': 'Četvorka Mačeva',
    'five-of-swords': 'Petica Mačeva',
    'six-of-swords': 'Šestica Mačeva',
    'seven-of-swords': 'Sedmica Mačeva',
    'eight-of-swords': 'Osmica Mačeva',
    'nine-of-swords': 'Devetka Mačeva',
    'ten-of-swords': 'Desetka Mačeva',
    'page-of-swords': 'Dečko Mačeva',
    'knight-of-swords': 'Vitez Mačeva',
    'queen-of-swords': 'Kraljica Mačeva',
    'king-of-swords': 'Kralj Mačeva',

    // Štapovi (Wands) - 14 cards
    'ace-of-wands': 'As Štapova',
    'two-of-wands': 'Dvojka Štapova',
    'three-of-wands': 'Trojka Štapova',
    'four-of-wands': 'Četvorka Štapova',
    'five-of-wands': 'Petica Štapova',
    'six-of-wands': 'Šestica Štapova',
    'seven-of-wands': 'Sedmica Štapova',
    'eight-of-wands': 'Osmica Štapova',
    'nine-of-wands': 'Devetka Štapova',
    'ten-of-wands': 'Desetka Štapova',
    'page-of-wands': 'Dečko Štapova',
    'knight-of-wands': 'Vitez Štapova',
    'queen-of-wands': 'Kraljica Štapova',
    'king-of-wands': 'Kralj Štapova',
  },
};

/**
 * Get localized card name
 *
 * @param cardKey - Card identifier (e.g., 'the-fool', 'ace-of-cups')
 * @param locale - Target locale ('tr' | 'en' | 'sr')
 * @returns Localized card name or formatted fallback
 *
 * @example
 * ```typescript
 * getCardName('the-fool', 'tr') // Returns: "Joker"
 * getCardName('ace-of-cups', 'en') // Returns: "Ace of Cups"
 * getCardName('invalid-key', 'tr') // Returns: "Invalid Key"
 * ```
 */
export function getCardName(cardKey: string, locale: Locale): string {
  // Try Major Arcana first
  if (MAJOR_ARCANA_NAMES[locale]?.[cardKey]) {
    return MAJOR_ARCANA_NAMES[locale][cardKey];
  }

  // Try Minor Arcana
  if (MINOR_ARCANA_NAMES[locale]?.[cardKey]) {
    return MINOR_ARCANA_NAMES[locale][cardKey];
  }

  // Fallback: format card key nicely (capitalize words)
  return cardKey
    .replace(/-/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

/**
 * Check if a card key is valid (exists in Major or Minor Arcana)
 *
 * @param cardKey - Card identifier to validate
 * @returns true if card key exists, false otherwise
 *
 * @example
 * ```typescript
 * isValidCardKey('the-fool') // true
 * isValidCardKey('ace-of-cups') // true
 * isValidCardKey('invalid-card') // false
 * ```
 */
export function isValidCardKey(cardKey: string): boolean {
  return !!(MAJOR_ARCANA_NAMES.en[cardKey] || MINOR_ARCANA_NAMES.en[cardKey]);
}

/**
 * Get all Major Arcana card keys
 *
 * @returns Array of 22 Major Arcana card keys
 */
export function getMajorArcanaKeys(): string[] {
  return Object.keys(MAJOR_ARCANA_NAMES.en);
}

/**
 * Get all Minor Arcana card keys
 *
 * @returns Array of 56 Minor Arcana card keys
 */
export function getMinorArcanaKeys(): string[] {
  return Object.keys(MINOR_ARCANA_NAMES.en);
}

/**
 * Get all card keys (Major + Minor Arcana)
 *
 * @returns Array of all 78 card keys
 */
export function getAllCardKeys(): string[] {
  return [...getMajorArcanaKeys(), ...getMinorArcanaKeys()];
}
