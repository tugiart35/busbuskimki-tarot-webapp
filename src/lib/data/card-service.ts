// Card Service - Reads from local JSON file instead of Supabase
import { getCardName } from '@/lib/tarot/card-names';
import {
  MAJOR_ARCANA_CARDS,
  MINOR_ARCANA_CARDS,
} from '@/features/tarot/card-listing/cardData';
import {
  getCardUrl as buildRelativeCardUrl,
  getCardImagePath,
} from '@/features/tarot/card-listing/helpers';
import {
  getCardIdFromSlug,
  getSlugsForCardId,
} from '@/lib/i18n/card-url-mapper';
import type { SupportedLocale } from '@/features/tarot/card-listing/config';
import { BlogCardService } from './blog-card-service';

export interface TarotCard {
  id: string;
  names: Record<SupportedLocale, string>;
  short_description: string;
  related?: string[];
}

export class CardService {
  private static cards: TarotCard[] | null = null;

  private static readonly CARD_IDS: string[] = [
    ...MAJOR_ARCANA_CARDS.map(card => card.key),
    ...MINOR_ARCANA_CARDS.map(card => card.key),
  ];

  private static ensureCards() {
    if (this.cards) {
      return;
    }

    this.cards = this.CARD_IDS.map(cardId => this.createCard(cardId));
  }

  private static createCard(cardId: string): TarotCard {
    const baseLocaleOrder: SupportedLocale[] = ['en', 'tr', 'sr'];
    let baseData: ReturnType<typeof BlogCardService.getCardById> | null = null;

    for (const locale of baseLocaleOrder) {
      const data = BlogCardService.getCardById(cardId, locale);
      if (data) {
        baseData = data;
        break;
      }
    }

    return {
      id: cardId,
      names: {
        tr: getCardName(cardId, 'tr'),
        en: getCardName(cardId, 'en'),
        sr: getCardName(cardId, 'sr'),
      },
      short_description: baseData?.short_description ?? '',
      related: baseData?.related_cards ?? [],
    };
  }

  static getCardById(id: string): TarotCard | null {
    this.ensureCards();
    return this.cards?.find(card => card.id === id) || null;
  }

  static getCardBySlug(
    slug: string,
    locale: SupportedLocale
  ): TarotCard | null {
    this.ensureCards();

    const normalizedSlug = slug.toLowerCase();
    const mappedId = getCardIdFromSlug(normalizedSlug);
    if (mappedId) {
      return this.getCardById(mappedId);
    }

    // Fallback: compare generated slugs
    return (
      this.cards?.find(card => {
        const generatedSlug = this.getCardSlug(card, locale);
        return generatedSlug === normalizedSlug;
      }) || null
    );
  }

  static getCardsByLocale(
    locale: SupportedLocale
  ): Array<TarotCard & { name: string; url: string }> {
    this.ensureCards();
    if (!this.cards) {
      return [];
    }

    return this.cards.map(card => ({
      ...card,
      name: card.names[locale],
      url: this.getCardUrl(card, locale),
    }));
  }

  static getRelatedCards(cardId: string, limit: number = 4): TarotCard[] {
    const relatedIds =
      BlogCardService.getCardById(cardId, 'en')?.related_cards ?? [];

    if (!relatedIds.length) {
      return [];
    }

    const relatedCards = relatedIds
      .map(relatedId => this.getCardById(relatedId))
      .filter(Boolean as unknown as <T>(value: T) => value is Exclude<T, null>)
      .slice(0, limit);

    return relatedCards as TarotCard[];
  }

  static getAllCards(): TarotCard[] {
    this.ensureCards();
    return this.cards ? [...this.cards] : [];
  }

  static getCardSlug(card: TarotCard, locale: SupportedLocale): string {
    const slugs = getSlugsForCardId(card.id);
    if (slugs && slugs[locale]) {
      return slugs[locale];
    }

    // Fallback: sanitize localized name
    const localizedName = card.names[locale] || card.names.en;
    return this.sanitizeSlug(localizedName);
  }

  static getCardUrl(card: TarotCard, locale: SupportedLocale): string {
    const relativeUrl = buildRelativeCardUrl(locale, card.id);
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';
    return `${baseUrl}${relativeUrl}`;
  }

  static getCardImage(card: TarotCard): string {
    return getCardImagePath(card.id);
  }

  private static sanitizeSlug(value: string): string {
    return value
      .toLowerCase()
      .replace(/ç/g, 'c')
      .replace(/ğ/g, 'g')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ş/g, 's')
      .replace(/ü/g, 'u')
      .replace(/ć/g, 'c')
      .replace(/č/g, 'c')
      .replace(/đ/g, 'd')
      .replace(/š/g, 's')
      .replace(/ž/g, 'z')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
}
