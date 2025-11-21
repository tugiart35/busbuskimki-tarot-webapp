/**
 * Tarot Card Name Mappings - Complete Localization
 *
 * Provides localized names for all 78 tarot cards (22 Major + 56 Minor Arcana)
 * Used for display, alt texts, and SEO optimization.
 *
 * This module now uses the i18n system from messages/*.json files.
 * For client components, use the useTranslations hook directly.
 * For server components or utilities, use getCardName function.
 *
 * @module card-names
 */

import { getLocaleMessages, type Locale } from '@/lib/i18n/messages';

export type CardKey = string;

/**
 * Get the suit from a card key (cups, pentacles, swords, wands)
 */
function getCardSuit(cardKey: string): string | null {
  if (cardKey.includes('cups')) {
    return 'cups';
  }
  if (cardKey.includes('pentacles')) {
    return 'pentacles';
  }
  if (cardKey.includes('swords')) {
    return 'swords';
  }
  if (cardKey.includes('wands')) {
    return 'wands';
  }
  return null;
}

/**
 * Get localized card name from i18n messages
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
  try {
    const messages = getLocaleMessages(locale);
    const cards = messages.cards as Record<string, unknown> | undefined;

    if (!cards) {
      return formatCardKeyAsFallback(cardKey);
    }

    const names = cards.names as
      | {
          majorArcana?: Record<string, string>;
          minorArcana?: Record<string, Record<string, string> | undefined> & {
            cups?: Record<string, string>;
            pentacles?: Record<string, string>;
            swords?: Record<string, string>;
            wands?: Record<string, string>;
          };
        }
      | undefined;

    if (!names) {
      return formatCardKeyAsFallback(cardKey);
    }

    // Try Major Arcana first
    if (names.majorArcana?.[cardKey]) {
      return names.majorArcana[cardKey];
    }

    // Try Minor Arcana by suit
    const suit = getCardSuit(cardKey);
    if (suit && names.minorArcana?.[suit]?.[cardKey]) {
      const suitCards = names.minorArcana[suit];
      if (suitCards && suitCards[cardKey]) {
        return suitCards[cardKey];
      }
    }

    // Fallback: format card key nicely
    return formatCardKeyAsFallback(cardKey);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting card name from i18n:', error);
    return formatCardKeyAsFallback(cardKey);
  }
}

/**
 * Format card key as fallback name (capitalize words)
 */
function formatCardKeyAsFallback(cardKey: string): string {
  return cardKey
    .replace(/-/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());
}

/**
 * Fallback card keys for validation (used when i18n is not available)
 */
const FALLBACK_MAJOR_ARCANA_KEYS = [
  'the-fool',
  'the-magician',
  'the-high-priestess',
  'the-empress',
  'the-emperor',
  'the-hierophant',
  'the-lovers',
  'the-chariot',
  'strength',
  'the-hermit',
  'wheeloffortune',
  'justice',
  'the-hanged-man',
  'death',
  'temperance',
  'the-devil',
  'the-tower',
  'the-star',
  'the-moon',
  'the-sun',
  'Judgement',
  'the-world',
] as const;

const FALLBACK_MINOR_ARCANA_KEYS = [
  // Cups
  'ace-of-cups',
  'two-of-cups',
  'three-of-cups',
  'four-of-cups',
  'five-of-cups',
  'six-of-cups',
  'seven-of-cups',
  'eight-of-cups',
  'nine-of-cups',
  'ten-of-cups',
  'page-of-cups',
  'knight-of-cups',
  'queen-of-cups',
  'king-of-cups',
  // Pentacles
  'ace-of-pentacles',
  'two-of-pentacles',
  'three-of-pentacles',
  'four-of-pentacles',
  'five-of-pentacles',
  'six-of-pentacles',
  'seven-of-pentacles',
  'eight-of-pentacles',
  'nine-of-pentacles',
  'ten-of-pentacles',
  'page-of-pentacles',
  'knight-of-pentacles',
  'queen-of-pentacles',
  'king-of-pentacles',
  // Swords
  'ace-of-swords',
  'two-of-swords',
  'three-of-swords',
  'four-of-swords',
  'five-of-swords',
  'six-of-swords',
  'seven-of-swords',
  'eight-of-swords',
  'nine-of-swords',
  'ten-of-swords',
  'page-of-swords',
  'knight-of-swords',
  'queen-of-swords',
  'king-of-swords',
  // Wands
  'ace-of-wands',
  'two-of-wands',
  'three-of-wands',
  'four-of-wands',
  'five-of-wands',
  'six-of-wands',
  'seven-of-wands',
  'eight-of-wands',
  'nine-of-wands',
  'ten-of-wands',
  'page-of-wands',
  'knight-of-wands',
  'queen-of-wands',
  'king-of-wands',
] as const;

/**
 * Get all card keys from i18n messages (with fallback)
 */
function getAllCardKeysFromMessages(locale: Locale = 'en'): {
  major: string[];
  minor: string[];
} {
  try {
    const messages = getLocaleMessages(locale);
    const cards = messages.cards as Record<string, unknown> | undefined;

    if (!cards) {
      return {
        major: [...FALLBACK_MAJOR_ARCANA_KEYS],
        minor: [...FALLBACK_MINOR_ARCANA_KEYS],
      };
    }

    const names = cards.names as
      | {
          majorArcana?: Record<string, string>;
          minorArcana?: Record<string, Record<string, string> | undefined> & {
            cups?: Record<string, string>;
            pentacles?: Record<string, string>;
            swords?: Record<string, string>;
            wands?: Record<string, string>;
          };
        }
      | undefined;

    if (!names) {
      return {
        major: [...FALLBACK_MAJOR_ARCANA_KEYS],
        minor: [...FALLBACK_MINOR_ARCANA_KEYS],
      };
    }

    const major = names.majorArcana
      ? Object.keys(names.majorArcana)
      : [...FALLBACK_MAJOR_ARCANA_KEYS];

    const minor: string[] = [];
    if (names.minorArcana) {
      const suits = ['cups', 'pentacles', 'swords', 'wands'] as const;
      suits.forEach(suit => {
        const suitCards = names.minorArcana?.[suit];
        if (suitCards) {
          minor.push(...Object.keys(suitCards));
        }
      });
    }
    if (minor.length === 0) {
      minor.push(...FALLBACK_MINOR_ARCANA_KEYS);
    }

    return { major, minor };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error getting card keys from i18n:', error);
    return {
      major: [...FALLBACK_MAJOR_ARCANA_KEYS],
      minor: [...FALLBACK_MINOR_ARCANA_KEYS],
    };
  }
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
  const { major, minor } = getAllCardKeysFromMessages('en');
  return major.includes(cardKey) || minor.includes(cardKey);
}

/**
 * Get all Major Arcana card keys
 *
 * @returns Array of 22 Major Arcana card keys
 */
export function getMajorArcanaKeys(): string[] {
  const { major } = getAllCardKeysFromMessages('en');
  return [...major];
}

/**
 * Get all Minor Arcana card keys
 *
 * @returns Array of 56 Minor Arcana card keys
 */
export function getMinorArcanaKeys(): string[] {
  const { minor } = getAllCardKeysFromMessages('en');
  return [...minor];
}

/**
 * Get all card keys (Major + Minor Arcana)
 *
 * @returns Array of all 78 card keys
 */
export function getAllCardKeys(): string[] {
  const { major, minor } = getAllCardKeysFromMessages('en');
  return [...major, ...minor];
}
