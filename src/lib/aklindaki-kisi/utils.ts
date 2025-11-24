// Aklındaki Kişi Kart Çekme Sistemi - Utility Functions

import { DrawnCard } from '@/types/aklindaki-kisi.types';

/**
 * Kartları görsel olarak karıştır (Fisher-Yates shuffle)
 */
export function shuffleCards<T>(cards: T[]): T[] {
  const shuffled = [...cards];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }
  return shuffled;
}

/**
 * Günlük limit kontrolü
 */
export function checkDailyLimit(
  lastDrawDate: string | null | undefined,
  cardsDrawnTodayCount: number
): {
  canDraw: boolean;
  shouldReset: boolean;
  remainingCards: number;
} {
  const now = new Date();
  const lastDraw = lastDrawDate ? new Date(lastDrawDate) : null;

  // 24 saat geçtiyse sayacı sıfırla
  let shouldReset = false;
  if (lastDraw) {
    const hoursSinceLastDraw =
      (now.getTime() - lastDraw.getTime()) / (1000 * 60 * 60);
    shouldReset = hoursSinceLastDraw >= 24;
  }

  const currentCount = shouldReset ? 0 : cardsDrawnTodayCount;
  const canDraw = currentCount < 3;
  const remainingCards = Math.max(0, 3 - currentCount);

  return {
    canDraw,
    shouldReset,
    remainingCards,
  };
}

/**
 * Son 24 çekilen kartları filtrele
 */
export function filterDrawnCards(
  allCards: Array<{ card_number: number }>,
  last24DrawnCards: number[]
): Array<{ card_number: number }> {
  return allCards.filter(card => !last24DrawnCards.includes(card.card_number));
}

/**
 * FIFO queue güncelleme - son 24 kartı yönet
 */
export function updateLast24DrawnCards(
  currentList: number[],
  newCardNumber: number
): number[] {
  // Yeni kartı başa ekle ve en fazla 24 kart tut
  return [newCardNumber, ...currentList].slice(0, 24);
}

/**
 * Kart numarasından görsel yolunu oluştur
 */
export function getCardImagePath(cardNumber: number): string {
  return `/cards/aklindakikisi/${cardNumber}.webp`;
}

/**
 * Arka yüz görsel yolu
 */
export function getBackImagePath(): string {
  return '/cards/aklindakikisi/Back.webp';
}

/**
 * Yerel saat diliminde bugünün tarihini al (YYYY-MM-DD formatında)
 */
export function getTodayInTimezone(timezone: string = 'UTC'): string {
  const now = new Date();
  const todayStr = now.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // Format: MM/DD/YYYY -> YYYY-MM-DD
  const parts = todayStr.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    if (month && day && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  // Fallback
  return now.toISOString().split('T')[0]!;
}

/**
 * ISO timestamp'ten yerel saat diliminde tarih çıkar (YYYY-MM-DD)
 */
export function getDateFromTimestamp(
  timestamp: string,
  timezone: string = 'UTC'
): string {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleString('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [month, day, year] = parts;
    if (month && day && year) {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  return date.toISOString().split('T')[0]!;
}

/**
 * Gece yarısı kontrolü ile geçerli kartları filtrele
 * Yerel saat diliminde bugün çekilen kartlar geçerli, diğerleri kapanır
 */
export function filterValidDrawnCardsByMidnight(
  drawnCards: DrawnCard[] | null | undefined,
  timezone: string = 'UTC'
): DrawnCard[] {
  if (!drawnCards || !Array.isArray(drawnCards)) {
    return [];
  }

  const today = getTodayInTimezone(timezone);

  return drawnCards.filter(drawnCard => {
    // Eski format (number[]) desteği - migration sırasında geçiş için
    if (typeof drawnCard === 'number') {
      return false;
    }

    // Yeni format (DrawnCard) kontrolü
    if (
      drawnCard &&
      typeof drawnCard === 'object' &&
      'cardNumber' in drawnCard &&
      'drawnAt' in drawnCard
    ) {
      // drawnAt'ten tarih hesapla
      const cardDate = getDateFromTimestamp(drawnCard.drawnAt, timezone);

      // Bugün çekilen kartlar geçerli
      return cardDate === today;
    }

    return false;
  });
}

/**
 * Son 7 günün kartlarını filtrele (bugün dahil)
 * Son 7 gün içinde çekilen kartlar geçerli, diğerleri kapanır
 * Bu fonksiyon kart seçiminde kullanılır - aynı kartın 7 gün içinde tekrar çekilmesini engeller
 */
export function filterLast7DaysDrawnCards(
  drawnCards: DrawnCard[] | null | undefined,
  timezone: string = 'UTC'
): DrawnCard[] {
  if (!drawnCards || !Array.isArray(drawnCards)) {
    return [];
  }

  const today = getTodayInTimezone(timezone);
  const todayDate = new Date(today + 'T00:00:00');

  // Son 7 günün tarihlerini hesapla (bugün dahil)
  const last7DaysDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(todayDate);
    date.setDate(date.getDate() - i);
    return getDateFromTimestamp(date.toISOString(), timezone);
  });

  return drawnCards.filter(drawnCard => {
    // Eski format (number[]) desteği
    if (typeof drawnCard === 'number') {
      return false;
    }

    // Yeni format (DrawnCard) kontrolü
    if (
      drawnCard &&
      typeof drawnCard === 'object' &&
      'cardNumber' in drawnCard &&
      'drawnAt' in drawnCard
    ) {
      // drawnAt'ten tarih hesapla
      const cardDate = getDateFromTimestamp(drawnCard.drawnAt, timezone);

      // Son 7 gün içinde çekilen kartlar geçerli
      return last7DaysDates.includes(cardDate);
    }

    return false;
  });
}
