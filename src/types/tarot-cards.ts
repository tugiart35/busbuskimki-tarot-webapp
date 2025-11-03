// Tarot Card Types
export interface TarotCard {
  id: string;
  englishName: string;
  turkishName: string;
  serbianName: string;
  arcanaType: 'major' | 'minor';
  suit?: 'cups' | 'swords' | 'wands' | 'pentacles';
  number?: number;
  imageUrl: string;
  additionalImages?: Array<{
    url: string;
    alt: string;
    caption?: string;
    type?: 'symbolism' | 'detail' | 'variation' | 'comparison';
    priority?: boolean;
  }>;
  slug: {
    tr: string;
    en: string;
    sr: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CardContent {
  id: string;
  cardId: string;
  locale: 'tr' | 'en' | 'sr';
  name: string;
  short_description: string;
  meanings: {
    upright: {
      general: string;
      love: string;
      career: string;
      money: string;
      spiritual: string;
    };
    reversed: {
      general: string;
      love: string;
      career: string;
      money: string;
      spiritual: string;
    };
  };
  context: {
    mythology: string;
    history?: string;
    celtic_cross?: {
      future: string;
      hidden_influences: string;
    };
  };
  story?: {
    title: string;
    description: string;
    history: string;
    historytitle: string;
    history_message: string;
    mystic_title: string;
    mystic_message: string;
    cultural_title: string;
    cultural_message: string;
  };
  symbolism?: Array<{
    symbol: string;
    meaning: string;
  }>;
  numerology?: {
    number: number;
    essence: string;
    message: string;
  };
  keywords?: {
    keywords_title: string;
    keywords_message: string;
    positive_title: string;
    positive_message: string;
    balance_title: string;
    balance_message: string;
    soul_title: string;
    soul_message: string;
  };
  // Yeni alanlar
  associations?: {
    title: string;
    astrology: string;
    numerology: string;
    element: string;
    chakra: string;
  };
  card_combinations?: {
    title: string;
    combinations: Array<{
      card: string;
      meaning: string;
      slug?: string;
    }>;
  };
  affirmations?: {
    title: string;
    affirmation_list: string[];
  };
  psychologist_perspective?: {
    title: string;
    summary: string;
    insights: string[];
  };
  image_gallery?: Array<{
    src: string;
    alt: string;
    caption?: string;
    priority?: boolean;
    type?: 'symbolism' | 'detail' | 'variation' | 'comparison';
  }>;
  daily_practices?: Array<{
    title: string;
    description: string;
  }>;
  cta: {
    main: string;
    micro: string;
  };
  faq: FAQItem[];
  related_cards: string[];
  imageUrl: string;
  additionalImages?: Array<{
    url: string;
    alt: string;
    caption?: string;
    type?: 'symbolism' | 'detail' | 'variation' | 'comparison';
  }>;
  readingTime?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CardSEO {
  id: string;
  cardId: string;
  locale: 'tr' | 'en' | 'sr';
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  twitterImage: string;
  keywords: string[];
  faq: FAQItem[];
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface CardPage {
  locale: 'tr' | 'en' | 'sr';
  slug: string;
  cardId: string;
  path: string;
  isActive: boolean;
  lastModified: Date;
}

// Combined card data for page rendering
export interface CardPageData {
  card: TarotCard;
  content: CardContent;
  seo: CardSEO;
  relatedCards: TarotCard[];
}

// State management interfaces
export interface CardState {
  cards: TarotCard[];
  currentCard: TarotCard | null;
  currentContent: CardContent | null;
  currentSEO: CardSEO | null;
  loading: boolean;
  error: string | null;
}

export interface CardActions {
  loadCard: (_slug: string, _locale: string) => Promise<void>;
  loadRelatedCards: (_cardId: string, _arcanaType: string) => Promise<void>;
  updateCard: (_cardId: string, _updates: Partial<TarotCard>) => Promise<void>;
  clearError: () => void;
}

export interface URLState {
  locale: 'tr' | 'en' | 'sr';
  slug: string;
  path: string;
  canonicalUrl: string;
  alternateUrls: {
    tr: string;
    en: string;
    sr: string;
  };
}
