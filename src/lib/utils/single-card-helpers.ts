/**
 * Single Card Reading Helper Functions
 *
 * Centralized utilities for single card reading detection and operations
 */

import type { TarotConfig } from '@/features/tarot/shared/types/tarot-config.types';

/**
 * Check if a reading is a single card reading
 *
 * @param config - Tarot configuration object
 * @returns true if this is a single card reading
 */
export function isSingleCardReading(config: TarotConfig | null): boolean {
  if (!config) {
    return false;
  }
  return (
    config.isSingleCard === true ||
    config.cardCount === 1 ||
    config.spreadId === 'single-card' ||
    config.spreadId === 'single-card-spread'
  );
}

/**
 * Get single card reading metadata
 *
 * @param config - Tarot configuration object
 * @returns metadata object for single card reading
 */
export function getSingleCardMetadata(config: TarotConfig | null): {
  isSingleCard: boolean;
  cardCount: number;
  spreadId: string | null;
} {
  return {
    isSingleCard: isSingleCardReading(config),
    cardCount: config?.cardCount || 0,
    spreadId: config?.spreadId || null,
  };
}
