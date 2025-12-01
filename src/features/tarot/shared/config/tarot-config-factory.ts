'use client';

import {
  TarotConfigSchema,
  TarotConfig,
  TarotTheme,
  ValidationKeys,
  I18nKeys,
  FormI18nKeys,
  CreditKeys,
} from '../schemas/tarot-config.schema';
import { PositionInfo, PositionLayout } from '../../../../types/tarot';
// @ts-ignore - useTranslations will be used in future updates
// eslint-disable-next-line no-unused-vars
import { useTranslations as _useTranslations } from '@/hooks/useTranslations';
// Position data will be fetched from i18n

const toCamelCase = (value: string): string => {
  return value
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_match, chr) => (chr ? chr.toUpperCase() : ''));
};

const toUpperSnakeCase = (value: string): string => {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[-\s]/g, '_')
    .toUpperCase();
};

/**
 * Spread key'ine göre position bilgilerini i18n'den çeker
 */
export const getPositionsFromI18n = (
  spreadKey: string,
  positionCount: number,
  t: (_key: string) => string
): PositionInfo[] => {
  const positions: PositionInfo[] = [];

  for (let i = 1; i <= positionCount; i++) {
    const title = t(`spreads.${spreadKey}.positions.${i}.title`);
    const description = t(`spreads.${spreadKey}.positions.${i}.description`);

    positions.push({
      id: i,
      title,
      desc: description,
      description,
    });
  }

  return positions;
};

// Career Spread Layout Data (CSS positions only)
// Position info now loaded from i18n via getPositionsFromI18n()

const CAREER_POSITIONS_LAYOUT: PositionLayout[] = [
  {
    id: 1,
    className:
      'absolute top-[15%] left-[65%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 2,
    className:
      'absolute top-[35%] left-[35%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 3,
    className:
      'absolute top-[55%] left-[15%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 4,
    className:
      'absolute top-[75%] left-[35%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 5,
    className:
      'absolute top-[85%] left-[65%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 6,
    className:
      'absolute top-[65%] left-[85%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 7,
    className:
      'absolute top-[25%] left-[85%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
];

// Love Spread Layout Data (CSS positions only)

const LOVE_POSITIONS_LAYOUT: PositionLayout[] = [
  {
    id: 1,
    className:
      'absolute top-1/2 left-[15%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 2,
    className:
      'absolute top-1/2 left-[38%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 3,
    className:
      'absolute top-1/2 left-[62%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 4,
    className:
      'absolute top-1/2 left-[85%] -translate-x-1/2 -translate-y-1/2 z-20 rotate-90',
  },
];

// Money Spread Layout Data (CSS positions only)

const MONEY_POSITIONS_LAYOUT: PositionLayout[] = [
  {
    id: 1,
    className:
      'absolute top-[85%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 2,
    className:
      'absolute top-[70%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 3,
    className:
      'absolute top-[70%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 4,
    className:
      'absolute top-[70%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 5,
    className:
      'absolute top-[45%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 6,
    className:
      'absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 7,
    className:
      'absolute top-[45%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 8,
    className:
      'absolute top-[20%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30',
  },
];

// Celtics Spread Layout Data (CSS positions only)

const PROBLEM_SOLVING_POSITIONS_LAYOUT: PositionLayout[] = [
  {
    id: 1,
    className:
      'absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 2,
    className:
      'absolute top-[45%] left-[45%] -translate-x-1/2 -translate-y-1/2 rotate-90 z-30',
  },
  {
    id: 3,
    className:
      'absolute top-[65%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 4,
    className:
      'absolute top-[25%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 5,
    className:
      'absolute top-[45%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 6,
    className:
      'absolute top-[45%] left-[20%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 7,
    className:
      'absolute top-[20%] right-[5%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 8,
    className:
      'absolute top-[35%] right-[5%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 9,
    className:
      'absolute top-[50%] right-[5%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
  {
    id: 10,
    className:
      'absolute top-[65%] right-[5%] -translate-x-1/2 -translate-y-1/2 z-20',
  },
];

// Marriage Spread Layout Data (CSS positions only)

const MARRIAGE_POSITIONS_LAYOUT: PositionLayout[] = [
  // Üst sıra (10, 9, 8)
  {
    id: 10,
    className:
      'absolute top-[15%] left-[15%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol üst
  {
    id: 9,
    className:
      'absolute top-[15%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Merkez üst
  {
    id: 8,
    className:
      'absolute top-[15%] left-[85%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ üst

  // Orta sıra - Sol daire (7, 6)
  {
    id: 7,
    className:
      'absolute top-[35%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol daire üst
  {
    id: 6,
    className:
      'absolute top-[55%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol daire alt

  // Orta sıra - Sağ daire (5, 4)
  {
    id: 5,
    className:
      'absolute top-[35%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ daire üst
  {
    id: 4,
    className:
      'absolute top-[55%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ daire alt

  // Alt sıra (3, 2, 1)
  {
    id: 3,
    className:
      'absolute top-[85%] left-[15%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol alt
  {
    id: 2,
    className:
      'absolute top-[85%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Merkez alt
  {
    id: 1,
    className:
      'absolute top-[85%] left-[85%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ alt
];

// Relationship Analysis Spread Layout Data (CSS positions only)

const RELATIONSHIP_ANALYSIS_POSITIONS_LAYOUT: PositionLayout[] = [
  {
    id: 1,
    className:
      'absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30',
  }, // Merkez - Mevcut Durum
  {
    id: 2,
    className:
      'absolute top-[20%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ üst - Sizin Hissleriniz
  {
    id: 3,
    className:
      'absolute top-[50%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ orta - Sizin Beklentileriniz
  {
    id: 4,
    className:
      'absolute top-[80%] left-[70%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ alt - Tavsiyeler
  {
    id: 5,
    className:
      'absolute top-[80%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol alt - Yol Haritası
  {
    id: 6,
    className:
      'absolute top-[50%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol orta - Partnerinizin Beklentileri
  {
    id: 7,
    className:
      'absolute top-[20%] left-[30%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol üst - Partnerinizin Hissleri
];

// Relationship Problems Spread Layout Data (CSS positions only)

const RELATIONSHIP_PROBLEMS_POSITIONS_LAYOUT: PositionLayout[] = [
  // Üst sıra (7, 8, 9)
  {
    id: 7,
    className:
      'absolute top-[85%] left-[85%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol üst
  {
    id: 8,
    className:
      'absolute top-[65%] left-[85%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Merkez üst
  {
    id: 9,
    className:
      'absolute top-[85%] left-[15%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ üst

  // Sağ daire (1, 2)
  {
    id: 1,
    className:
      'absolute top-[65%] left-[15%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ daire alt
  {
    id: 2,
    className:
      'absolute top-[65%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sağ daire üst

  // Sol daire (3, 4)
  {
    id: 3,
    className:
      'absolute top-[45%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol daire alt
  {
    id: 4,
    className:
      'absolute top-[25%] left-[85%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sol daire üst

  // Merkez kesişim (5, 6)
  {
    id: 5,
    className:
      'absolute top-[12%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30',
  }, // Merkez alt
  {
    id: 6,
    className:
      'absolute top-[25%] left-[15%] -translate-x-1/2 -translate-y-1/2 z-30',
  }, // Merkez üst
];

// New Lover Spread Layout Data (CSS positions only)

const NEW_LOVER_POSITIONS_LAYOUT: PositionLayout[] = [
  {
    id: 1,
    className:
      'absolute top-[65%] left-[55%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // sağ altta
  {
    id: 2,
    className:
      'absolute top-[65%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // sol altta
  {
    id: 3,
    className:
      'absolute top-[50%] left-[25%] -translate-x-1/2 -translate-y-1/2 -rotate-6 z-20',
  }, // en sol (hafif yana kayık)
  {
    id: 4,
    className:
      'absolute top-[30%] left-[45%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // üst sol
  {
    id: 5,
    className:
      'absolute top-[30%] left-[55%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // üst sağ
  {
    id: 6,
    className:
      'absolute top-[50%] left-[75%] -translate-x-1/2 -translate-y-1/2 rotate-6 z-20',
  }, // en sağ (hafif yana kayık)
];

// Single Card Spread Layout Data (CSS positions only)
// Tek kart merkezi konumda gösterilir
const SINGLE_CARD_POSITIONS_LAYOUT: PositionLayout[] = [
  {
    id: 1,
    className:
      'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30',
  },
];

// Situation Analysis Spread Layout Data (CSS positions only)

const SITUATION_ANALYSIS_POSITIONS_LAYOUT: PositionLayout[] = [
  {
    id: 1,
    className:
      'absolute top-[86%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10',
  }, // Geçmiş
  {
    id: 2,
    className:
      'absolute top-[61%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Şimdi (1 ve 3 ile hafif overlap)
  {
    id: 3,
    className:
      'absolute top-[36%] left-[25%] -translate-x-1/2 -translate-y-1/2 z-10',
  }, // Gelecek
  {
    id: 4,
    className:
      'absolute top-[18%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-30',
  }, // Tavsiye (üstte, 3'ün üstüne biner)
  {
    id: 5,
    className:
      'absolute top-[36%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Etkiler
  {
    id: 6,
    className:
      'absolute top-[61%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Engeller
  {
    id: 7,
    className:
      'absolute top-[86%] left-[75%] -translate-x-1/2 -translate-y-1/2 z-20',
  }, // Sonuç
];

const DEFAULT_CANVAS_I18N = {
  selectReadingTitle: 'reading.prompts.selectReadingTitle',
  selectReadingDescription: 'reading.prompts.selectReadingDescription',
  lockedTitle: 'reading.prompts.lockedStateTitle',
  lockedDescription: 'reading.prompts.lockedStateDescription',
} as const;

const createFormI18nKeys = (namespace: string): FormI18nKeys => ({
  personalInfo: `${namespace}.form.personalInfo`,
  firstName: `${namespace}.form.firstName`,
  lastName: `${namespace}.form.lastName`,
  birthDate: `${namespace}.form.birthDate`,
  birthDateUnknown: `${namespace}.form.birthDateUnknown`,
  relationshipStatus: `${namespace}.form.relationshipStatus`,
  selectRelationshipStatus: `${namespace}.form.selectRelationshipStatus`,
  relationshipStatusOptions: {
    single: `${namespace}.form.relationshipStatusOptions.single`,
    platonik: `${namespace}.form.relationshipStatusOptions.platonik`,
    in_relationship: `${namespace}.form.relationshipStatusOptions.in_relationship`,
    married: `${namespace}.form.relationshipStatusOptions.married`,
    separated: `${namespace}.form.relationshipStatusOptions.separated`,
    divorced: `${namespace}.form.relationshipStatusOptions.divorced`,
    widowed: `${namespace}.form.relationshipStatusOptions.widowed`,
    prefer_not_to_say: `${namespace}.form.relationshipStatusOptions.prefer_not_to_say`,
  },
  partnerInfo: `${namespace}.form.partnerInfo`,
  partnerName: `${namespace}.form.partnerName`,
  partnerBirthDate: `${namespace}.form.partnerBirthDate`,
  partnerBirthDateUnknown: `${namespace}.form.partnerBirthDateUnknown`,
  email: `${namespace}.form.email`,
  phone: `${namespace}.form.phone`,
  communicationMethod: `${namespace}.form.communicationMethod`,
  emailCommunication: `${namespace}.form.emailCommunication`,
  whatsappCommunication: `${namespace}.form.whatsappCommunication`,
  questions: `${namespace}.form.questions`,
  concernQuestion: `${namespace}.form.concernQuestion`,
  understandingQuestion: `${namespace}.form.understandingQuestion`,
  emotionalQuestion: `${namespace}.form.emotionalQuestion`,
  mainQuestion: `${namespace}.form.mainQuestion`,
  mainQuestionPlaceholder: `${namespace}.form.mainQuestionPlaceholder`,
  hasPartner: `${namespace}.form.hasPartner`,
  saving: `${namespace}.form.saving`,
  saveAndOpen: `${namespace}.form.saveAndOpen`,
  clearAll: `${namespace}.form.clearAll`,
  placeholders: {
    firstName: `${namespace}.form.placeholders.firstName`,
    lastName: `${namespace}.form.placeholders.lastName`,
    email: `${namespace}.form.placeholders.email`,
    phone: `${namespace}.form.placeholders.phone`,
    concernQuestion: `${namespace}.form.placeholders.concernQuestion`,
    understandingQuestion: `${namespace}.form.placeholders.understandingQuestion`,
    emotionalQuestion: `${namespace}.form.placeholders.emotionalQuestion`,
    mainQuestion: `${namespace}.form.placeholders.mainQuestion`,
  },
});

const mergeI18nKeys = (
  base: I18nKeys,
  overrides?: Partial<I18nKeys>
): I18nKeys => {
  if (!overrides) {
    return base;
  }

  return {
    modals: {
      ...base.modals,
      ...overrides.modals,
    },
    form: {
      ...base.form,
      ...overrides.form,
      placeholders: {
        ...(base.form.placeholders ?? {}),
        ...(overrides.form?.placeholders ?? {}),
      },
    },
    canvas: {
      ...base.canvas,
      ...overrides.canvas,
    },
  };
};

/**
 * Tarot konfigürasyonu oluşturma parametreleri
 */
export interface CreateTarotConfigParams {
  spreadId: string;
  spreadKey: string; // i18n key for spread (e.g., 'career', 'love', etc.)
  cardCount: number; // Position sayısı
  translationNamespace?: string;
  summaryKey?: string;
  spreadName?: string;
  positionsLayout: readonly PositionLayout[];
  positionsInfo?: readonly PositionInfo[]; // Optional: eğer verilmezse i18n'den çekilir
  theme: TarotTheme;
  icon: string;
  readingType: string;
  supabaseReadingType?: string;
  creditKeyPrefix?: string;
  customValidationKeys?: Partial<ValidationKeys>;
  customI18nKeys?: Partial<I18nKeys>;
  customCreditKeys?: Partial<CreditKeys>;
  backgroundImage?: string;
  backgroundAlt?: string;
  requiresPartnerInfo?: boolean;
  isSingleCard?: boolean; // Single card spread flag
  t?: (_key: string) => string; // i18n fonksiyonu (optional, fallback varsa)
}

/**
 * Tarot konfigürasyonu oluşturma fonksiyonu
 * Tüm spread'ler için standart konfigürasyon sağlar
 */
export function createTarotConfig(
  params: CreateTarotConfigParams
): TarotConfig {
  const {
    spreadId,
    spreadKey,
    cardCount,
    translationNamespace,
    summaryKey,
    spreadName,
    positionsLayout,
    positionsInfo: providedPositionsInfo,
    theme,
    icon,
    readingType,
    supabaseReadingType,
    creditKeyPrefix,
    customValidationKeys,
    customI18nKeys,
    customCreditKeys,
    backgroundImage,
    backgroundAlt,
    requiresPartnerInfo = false,
    isSingleCard = false,
    t,
  } = params;

  const namespace = translationNamespace ?? toCamelCase(spreadId);
  const summaryKeyValue = summaryKey ?? `${namespace}Spread`;
  const supabaseReadingTypeValue = supabaseReadingType ?? namespace;
  const creditPrefix = creditKeyPrefix ?? toUpperSnakeCase(namespace);

  const formI18nKeys = createFormI18nKeys(namespace);

  // Position bilgilerini i18n'den çek (eğer t fonksiyonu varsa) veya sağlanan positionsInfo'yu kullan
  const positionsInfo = providedPositionsInfo?.length
    ? providedPositionsInfo
    : t
      ? getPositionsFromI18n(spreadKey, cardCount, t)
      : Array.from({ length: cardCount }, (_, i) => ({
          id: i + 1,
          title: `Pozisyon ${i + 1}`,
          desc: '',
          description: '',
        }));

  const defaultCreditKeys: CreditKeys = {
    detailed: `${creditPrefix}_DETAILED`,
    written: `${creditPrefix}_WRITTEN`,
    simple: `${creditPrefix}_SIMPLE`,
    ...customCreditKeys,
  };

  // Varsayılan validasyon anahtarları
  const defaultValidationKeys: ValidationKeys = {
    nameMinLength: `${namespace}.validation.nameMinLength`,
    surnameMinLength: `${namespace}.validation.surnameMinLength`,
    birthDateRequired: `${namespace}.validation.birthDateRequired`,
    relationshipStatusRequired: `${namespace}.validation.relationshipStatusRequired`,
    partnerNameRequired: `${namespace}.validation.partnerNameRequired`,
    partnerBirthDateRequired: `${namespace}.validation.partnerBirthDateRequired`,
    emailInvalid: `${namespace}.validation.emailInvalid`,
    questionMinLength: `${namespace}.validation.questionMinLength`,
    ...customValidationKeys,
  };

  // Varsayılan i18n anahtarları
  const defaultI18nKeys: I18nKeys = {
    modals: {
      // i18n-ally: love.modals.infoTitle
      infoTitle: `${namespace}.modals.infoTitle`,
      // i18n-ally: love.modals.aboutSpread
      aboutSpread: `${namespace}.modals.aboutSpread`,
      // i18n-ally: love.modals.aboutSpreadText
      aboutSpreadText: `${namespace}.modals.aboutSpreadText`,
      // i18n-ally: love.modals.cardCount
      cardCount: `${namespace}.modals.cardCount`,
      // i18n-ally: love.modals.cardCountText
      cardCountText: `${namespace}.modals.cardCountText`,
      // i18n-ally: love.modals.loveAttentionInfo
      loveAttentionInfo: `${namespace}.modals.loveAttentionInfo`,
      // i18n-ally: love.modals.loveAttention
      loveAttention: `${namespace}.modals.loveAttention`,
      // i18n-ally: love.modals.detailedReading
      detailedReading: `${namespace}.modals.detailedReading`,
      // i18n-ally: love.modals.detailedReadingText
      detailedReadingText: `${namespace}.modals.detailedReadingText`,
      // i18n-ally: love.modals.writtenReading
      writtenReading: `${namespace}.modals.writtenReading`,
      // i18n-ally: love.modals.writtenReadingText
      writtenReadingText: `${namespace}.modals.writtenReadingText`,
      // i18n-ally: love.modals.process
      process: `${namespace}.modals.process`,
      // i18n-ally: love.modals.step1
      step1: `${namespace}.modals.step1`,
      // i18n-ally: love.modals.step2
      step2: `${namespace}.modals.step2`,
      // i18n-ally: love.modals.step3
      step3: `${namespace}.modals.step3`,
      // i18n-ally: love.modals.step4
      step4: `${namespace}.modals.step4`,
      // i18n-ally: love.modals.cancel
      cancel: `${namespace}.modals.cancel`,
      // i18n-ally: love.modals.continue
      continue: `${namespace}.modals.continue`,
      // i18n-ally: love.modals.creditConfirm
      creditConfirm: `${namespace}.modals.creditConfirm`,
      // i18n-ally: love.modals.creditConfirmMessage
      creditConfirmMessage: `${namespace}.modals.creditConfirmMessage`,
      // i18n-ally: love.modals.processing
      processing: `${namespace}.modals.processing`,
      // i18n-ally: love.modals.confirm
      confirm: `${namespace}.modals.confirm`,
      // i18n-ally: love.modals.savingReading
      savingReading: `${namespace}.modals.savingReading`,
      // i18n-ally: love.modals.saveReading
      saveReading: `${namespace}.modals.saveReading`,
      // i18n-ally: love.modals.successTitle
      successTitle: `${namespace}.modals.successTitle`,
      // i18n-ally: love.modals.successMessage
      successMessage: `${namespace}.modals.successMessage`,
      // i18n-ally: love.modals.redirecting
      redirecting: `${namespace}.modals.redirecting`,
    },
    form: formI18nKeys,
    canvas: { ...DEFAULT_CANVAS_I18N },
  };

  // Konfigürasyon objesi
  const config: TarotConfig = {
    spreadId,
    translationNamespace: namespace,
    summaryKey: summaryKeyValue,
    spreadName: spreadName || `${namespace}.data.spreadName`,
    cardCount, // Parametre olarak alınan değeri kullan
    positionsInfo: positionsInfo as any,
    positionsLayout: positionsLayout as any,
    theme,
    icon,
    backgroundImage: backgroundImage || `/images/bg-${spreadId}-tarot.jpg`,
    backgroundAlt: backgroundAlt || `${spreadId} Tarot Reading background`,
    readingType,
    supabaseReadingType: supabaseReadingTypeValue,
    creditKeyPrefix: creditPrefix,
    requiresPartnerInfo,
    isSingleCard: isSingleCard ?? false,
    creditKeys: defaultCreditKeys,
    validationKeys: defaultValidationKeys,
    i18nKeys: mergeI18nKeys(defaultI18nKeys, customI18nKeys),
  };

  return TarotConfigSchema.parse(config);
}

/**
 * Career spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createCareerConfig(t?: (_key: string) => string): TarotConfig {
  return createTarotConfig({
    spreadId: 'career',
    spreadKey: 'career',
    cardCount: 7,
    translationNamespace: 'career',
    summaryKey: 'careerSpread',
    positionsLayout: CAREER_POSITIONS_LAYOUT as readonly PositionLayout[],
    theme: 'blue',
    icon: '💼',
    readingType: 'CAREER_SPREAD',
    supabaseReadingType: 'career', // Veritabanında mevcut enum değeri
    creditKeyPrefix: 'CAREER_SPREAD',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'Career Tarot Reading background',
    ...(t && { t }),
  });
}

/**
 * Love spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createLoveConfig(t?: (_key: string) => string): TarotConfig {
  return createTarotConfig({
    spreadId: 'love',
    spreadKey: 'love',
    cardCount: 4,
    translationNamespace: 'love',
    summaryKey: 'loveSpread',
    positionsLayout: LOVE_POSITIONS_LAYOUT,
    theme: 'pink',
    icon: '💕',
    readingType: 'LOVE_SPREAD',
    supabaseReadingType: 'love', // Veritabanında mevcut enum değeri
    creditKeyPrefix: 'LOVE_SPREAD',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'Love Tarot Reading background',
    requiresPartnerInfo: false, // Partner bilgisi opsiyonel - hasPartner toggle ile kontrol edilir
    ...(t && { t }),
  });
}

/**
 * Money spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createMoneyConfig(t?: (_key: string) => string): TarotConfig {
  return createTarotConfig({
    spreadId: 'money',
    spreadKey: 'money',
    cardCount: 8,
    translationNamespace: 'money',
    summaryKey: 'moneySpread',
    positionsLayout: MONEY_POSITIONS_LAYOUT,
    theme: 'green',
    icon: '💰',
    readingType: 'MONEY_SPREAD',
    supabaseReadingType: 'money', // Veritabanında mevcut enum değeri
    creditKeyPrefix: 'MONEY_SPREAD',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'Money Tarot Reading background',
    ...(t && { t }),
  });
}

/**
 * Celtics spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createProblemSolvingConfig(
  t?: (_key: string) => string
): TarotConfig {
  return createTarotConfig({
    spreadId: 'problem-solving',
    spreadKey: 'problemSolving',
    cardCount: 10,
    spreadName: 'problemSolving',
    translationNamespace: 'problemSolving',
    summaryKey: 'problemSolvingSpread',
    positionsLayout: PROBLEM_SOLVING_POSITIONS_LAYOUT,
    theme: 'orange',
    icon: '🧩',
    readingType: 'PROBLEM_SOLVING_SPREAD',
    supabaseReadingType: 'problem-solving', // Veritabanında mevcut enum değeri
    creditKeyPrefix: 'PROBLEM_SOLVING',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'Celtics Tarot Reading background',
    ...(t && { t }),
  });
}

/**
 * Marriage spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createMarriageConfig(
  t?: (_key: string) => string
): TarotConfig {
  return createTarotConfig({
    spreadId: 'marriage',
    spreadKey: 'marriage',
    cardCount: 10,
    translationNamespace: 'marriage',
    summaryKey: 'marriageSpread',
    positionsLayout: MARRIAGE_POSITIONS_LAYOUT,
    theme: 'purple',
    icon: '💍',
    readingType: 'MARRIAGE_SPREAD',
    supabaseReadingType: 'marriage', // Veritabanında mevcut enum değeri
    creditKeyPrefix: 'MARRIAGE',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'Marriage Tarot Reading background',
    requiresPartnerInfo: false,
    ...(t && { t }),
  });
}

/**
 * Relationship Analysis spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createRelationshipAnalysisConfig(
  t?: (_key: string) => string
): TarotConfig {
  return createTarotConfig({
    spreadId: 'relationship-analysis',
    spreadKey: 'relationshipAnalysis',
    cardCount: 7,
    translationNamespace: 'relationshipAnalysis',
    summaryKey: 'relationshipAnalysisSpread',
    positionsLayout: RELATIONSHIP_ANALYSIS_POSITIONS_LAYOUT,
    theme: 'blue',
    icon: '💙',
    readingType: 'RELATIONSHIP_ANALYSIS_SPREAD',
    supabaseReadingType: 'relationship-analysis', // Veritabanında mevcut enum değeri
    creditKeyPrefix: 'RELATIONSHIP_ANALYSIS',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'Relationship Analysis Tarot Reading background',
    ...(t && { t }),
  });
}

/**
 * Relationship Problems spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createRelationshipProblemsConfig(
  t?: (_key: string) => string
): TarotConfig {
  return createTarotConfig({
    spreadId: 'relationship-problems',
    spreadKey: 'relationshipProblems',
    cardCount: 9,
    translationNamespace: 'relationshipProblems',
    summaryKey: 'relationshipProblemsSpread',
    positionsLayout: RELATIONSHIP_PROBLEMS_POSITIONS_LAYOUT,
    theme: 'red',
    icon: '💔',
    readingType: 'RELATIONSHIP_PROBLEMS_SPREAD',
    supabaseReadingType: 'relationship-problems', // Veritabanında mevcut enum değeri
    creditKeyPrefix: 'RELATIONSHIP_PROBLEMS',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'Relationship Problems Tarot Reading background',
    requiresPartnerInfo: false,
    ...(t && { t }),
  });
}

/**
 * New Lover spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createNewLoverConfig(
  t?: (_key: string) => string
): TarotConfig {
  return createTarotConfig({
    spreadId: 'new-lover',
    spreadKey: 'newLover',
    cardCount: 6,
    translationNamespace: 'newLover',
    summaryKey: 'newLoverSpread',
    positionsLayout: NEW_LOVER_POSITIONS_LAYOUT,
    theme: 'pink',
    icon: '💕',
    readingType: 'NEW_LOVER_SPREAD',
    supabaseReadingType: 'new-lover',
    creditKeyPrefix: 'NEW_LOVER',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'New Lover Tarot Reading background',
    requiresPartnerInfo: false,
    ...(t && { t }),
  });
}

/**
 * Situation Analysis spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createSituationAnalysisConfig(
  t?: (_key: string) => string
): TarotConfig {
  return createTarotConfig({
    spreadId: 'situation-analysis',
    spreadKey: 'situationAnalysis',
    cardCount: 7,
    translationNamespace: 'situationAnalysis',
    summaryKey: 'situationAnalysisSpread',
    spreadName: 'situationAnalysis.data.spreadName',
    positionsLayout: SITUATION_ANALYSIS_POSITIONS_LAYOUT,
    theme: 'purple',
    icon: '🔮',
    readingType: 'SITUATION_ANALYSIS_SPREAD',
    supabaseReadingType: 'situation-analysis', // Veritabanında mevcut enum değeri
    creditKeyPrefix: 'SITUATION_ANALYSIS',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'Situation Analysis Tarot Reading background',
    ...(t && { t }),
  });
}

/**
 * Single Card spread için özel konfigürasyon
 * @param t - i18n translation function (optional)
 */
export function createSingleCardConfig(
  t?: (_key: string) => string
): TarotConfig {
  return createTarotConfig({
    spreadId: 'single-card',
    spreadKey: 'singleCard',
    cardCount: 1,
    translationNamespace: 'spreads.singleCard', // Çeviri dosyasında spreads.singleCard altında
    summaryKey: 'singleCardSpread',
    positionsLayout: SINGLE_CARD_POSITIONS_LAYOUT,
    theme: 'purple',
    icon: '🎴',
    readingType: 'SINGLE_CARD_SPREAD',
    supabaseReadingType: 'single-card', // Veritabanında mevcut enum değeri
    creditKeyPrefix: 'SINGLE_CARD',
    backgroundImage: '/new-lover.png',
    backgroundAlt: 'Single Card Tarot Reading background',
    requiresPartnerInfo: false, // Partner bilgisi opsiyonel
    isSingleCard: true, // Single card spread flag
    ...(t && { t }),
  });
}
