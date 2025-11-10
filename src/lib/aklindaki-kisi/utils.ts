// Aklındaki Kişi Kart Çekme Sistemi - Utility Functions

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
