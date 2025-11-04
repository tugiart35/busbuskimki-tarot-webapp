/**
 * Client-side Widget Loader
 *
 * Bu dosya tüm client-side widget'ları re-export eder.
 * Dynamic import yerine doğrudan export kullanılır çünkü
 * component'ler zaten 'use client' directive'ine sahip.
 * Bu yaklaşım Next.js 15 + next-intl ile daha uyumlu çalışır.
 */

// Named exports
export { DailyCardWidget } from './DailyCardWidget';
export { TrendingCardsWidget } from './TrendingCardsWidget';
export { PageReactions } from './PageReactions';
export { GeneralComments } from './GeneralComments';
export { ExpertCommentary } from './ExpertCommentary';
export { ExpertCommentaryModal } from './ExpertCommentaryModal';

// Default export (CardStatsWidget uses export default)
export { default as CardStatsWidget } from './CardStatsWidget';
