// Kart slug'larından metadata çeken yardımcı fonksiyonlar
import { CardService } from '@/lib/data/card-service';

export interface CardMetadata {
  id: string;
  name: { tr: string; en: string; sr: string };
  imageUrl: string;
  url: { tr: string; en: string; sr: string };
}

/**
 * Kart slug'ından metadata'yı döndürür
 * @param slug - Kart slug'ı (herhangi bir dildeki)
 * @returns CardMetadata veya null
 */
export function getCardMetadataBySlug(slug: string): CardMetadata | null {
  // Her dil için kartı kontrol et
  const locales: ('tr' | 'en' | 'sr')[] = ['tr', 'en', 'sr'];

  for (const locale of locales) {
    const card = CardService.getCardBySlug(slug, locale);
    if (card) {
      return {
        id: card.id,
        name: card.names,
        imageUrl: getCardImagePath(card.id),
        url: {
          tr: CardService.getCardUrl(card, 'tr'),
          en: CardService.getCardUrl(card, 'en'),
          sr: CardService.getCardUrl(card, 'sr'),
        },
      };
    }
  }

  return null;
}

/**
 * Kart ID'sinden resim yolunu döndürür
 * @param cardId - Kart ID'si
 * @returns Resim yolu
 */
function getCardImagePath(cardId: string): string {
  // Major Arcana mapping
  const majorArcanaMapping: { [key: string]: string } = {
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
    'wheel-of-fortune': 'X-WheelOfFortune',
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

  if (majorArcanaMapping[cardId]) {
    return `/cards/rws/${majorArcanaMapping[cardId]}.webp`;
  }

  // Minor Arcana için
  const suit = cardId.includes('cups')
    ? 'Cups'
    : cardId.includes('pentacles')
      ? 'Pentacles'
      : cardId.includes('swords')
        ? 'Swords'
        : 'Wands';

  let cardName = '';
  if (cardId.includes('ace')) {
    cardName = 'Ace';
  } else if (cardId.includes('page')) {
    cardName = 'Page';
  } else if (cardId.includes('knight')) {
    cardName = 'Knight';
  } else if (cardId.includes('queen')) {
    cardName = 'Queen';
  } else if (cardId.includes('king')) {
    cardName = 'King';
  } else {
    // Sayı kartları için
    const numbers: { [key: string]: string } = {
      two: 'Two',
      three: 'Three',
      four: 'Four',
      five: 'Five',
      six: 'Six',
      seven: 'Seven',
      eight: 'Eight',
      nine: 'Nine',
      ten: 'Ten',
    };

    for (const [key, value] of Object.entries(numbers)) {
      if (cardId.includes(key)) {
        cardName = value;
        break;
      }
    }
  }

  return `/cards/rws/${cardName}${suit}.webp`;
}

/**
 * Tüm kartların metadata'sını döndürür
 * @returns CardMetadata dizisi
 */
export function getAllCardsMetadata(): CardMetadata[] {
  const allCards = CardService.getAllCards();

  return allCards.map(card => ({
    id: card.id,
    name: card.names,
    imageUrl: getCardImagePath(card.id),
    url: {
      tr: CardService.getCardUrl(card, 'tr'),
      en: CardService.getCardUrl(card, 'en'),
      sr: CardService.getCardUrl(card, 'sr'),
    },
  }));
}
