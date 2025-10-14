'use client';

/*
info:
Bağlantılı dosyalar:
- '@/lib/types/tarot': Tarot kartı tipi tanımları
- '@/lib/constants/tarotSpreads': Tarot açılım konfigürasyonları

Dosyanın amacı:
- Durum Analizi (Situation Analysis) Tarot açılımında her pozisyon için kart anlamlarını yönetir
- Pozisyona, karta, anahtar kelimeye göre anlam arama ve filtreleme fonksiyonları sunar
- Pozisyon başlıkları, açıklamaları ve ilgili meta verileri içerir
- i18n desteği ile çoklu dil desteği sağlar

Supabase değişkenleri ve tablolar:
- Bu dosya sadece frontend tarafında kullanılır, doğrudan Supabase bağlantısı yok

Geliştirme önerileri:
- i18n desteği eklenebilir
- Kart ismi mapping sistemi genişletilebilir
- Arama ve filtreleme fonksiyonları geliştirilebilir

Tespit edilen hatalar:
- Yok

Kullanım durumları:
- getSituationAnalysisMeaningByCardAndPosition: gerekli
- getSituationAnalysisPositions: gerekli
- getSituationAnalysisStatistics: gerekli
*/

import { TarotCard } from '@/types/tarot';
import { getCardNameMappingSync } from '@/features/tarot/lib/love/card-name-mapping';
import {
  position1Meanings,
  getSituationAnalysisPosition1Meaning,
  getSituationAnalysisPosition1MeaningByCardName,
} from './position-1-gecmis-sebepler';
import {
  position2Meanings,
  getSituationAnalysisPosition2Meaning,
  getSituationAnalysisPosition2MeaningByCardName,
} from './position-2-suanki-durum';
import {
  position3Meanings,
  getSituationAnalysisPosition3Meaning,
  getSituationAnalysisPosition3MeaningByCardName,
} from './position-3-gizli-etkenler';
import {
  position4Meanings,
  getSituationAnalysisPosition4Meaning,
  getSituationAnalysisPosition4MeaningByCardName,
} from './position-4-merkez-kart';
import {
  position5Meanings,
  getSituationAnalysisPosition5Meaning,
  getSituationAnalysisPosition5MeaningByCardName,
} from './position-5-dis-etkenler';
import {
  position6Meanings,
  getSituationAnalysisPosition6Meaning,
  getSituationAnalysisPosition6MeaningByCardName,
} from './position-6-tavsiye';
import {
  position7Meanings,
  getSituationAnalysisPosition7Meaning,
  getSituationAnalysisPosition7MeaningByCardName,
} from './position-7-olasi-gelecek-sonuc';

export interface SituationAnalysisPositionMeaning {
  id: string;
  position: number;
  card: string;
  cardName?: string;
  isReversed?: boolean;
  upright: string;
  reversed: string;
  keywords: string[];
  advice?: string;
  context: string;
  group: 'Majör Arkana' | 'Kupalar' | 'Kılıçlar' | 'Asalar' | 'Tılsımlar';
}

// Kart grubunu belirleme fonksiyonu
function getCardGroup(
  card: TarotCard | string
): 'Majör Arkana' | 'Kupalar' | 'Kılıçlar' | 'Asalar' | 'Tılsımlar' {
  if (typeof card === 'object') {
    // TarotCard objesi ise
    if (card.suit === 'major') {
      return 'Majör Arkana';
    }
    if (card.suit === 'cups') {
      return 'Kupalar';
    }
    if (card.suit === 'swords') {
      return 'Kılıçlar';
    }
    if (card.suit === 'wands') {
      return 'Asalar';
    }
    if (card.suit === 'pentacles') {
      return 'Tılsımlar';
    }
    return 'Majör Arkana'; // fallback
  } else {
    // String ise
    const name = card.toLowerCase();

    if (
      name.includes('kupalar') ||
      name.includes('kadehler') ||
      name.includes('pehara')
    ) {
      return 'Kupalar';
    } else if (name.includes('kılıçlar') || name.includes('mačeva')) {
      return 'Kılıçlar';
    } else if (name.includes('asalar') || name.includes('štapova')) {
      return 'Asalar';
    } else if (
      name.includes('tılsımlar') ||
      name.includes('altınlar') ||
      name.includes('pentakla')
    ) {
      return 'Tılsımlar';
    } else {
      return 'Majör Arkana';
    }
  }
}

/**
 * Durum Analizi açılımında kartın pozisyonuna göre anlamını döndürür
 */
export function getSituationAnalysisMeaningByCardAndPosition(
  card: TarotCard,
  position: number,
  isReversed: boolean = false
): SituationAnalysisPositionMeaning {
  // Pozisyon 1-7 arasında olmalı
  if (position < 1 || position > 7) {
    return {
      id: `situation-analysis-${position}-${card.id}-${isReversed ? 'reversed' : 'upright'}`,
      position: 0,
      card: card.name,
      cardName: card.nameTr,
      isReversed,
      upright: card.meaningTr.upright,
      reversed: card.meaningTr.reversed,
      keywords: card.keywordsTr || card.keywords || [],
      advice: 'Bu pozisyon için özel bir anlam tanımlanmamış.',
      context: 'Tanımlanmamış pozisyon',
      group: getCardGroup(card),
    };
  }

  // Kart ismi mapping'ini al
  const cardNameMapping = getCardNameMappingSync();

  // Kart ismini İngilizce'ye çevir - önce nameTr'yi dene, sonra name'i
  const englishCardName =
    cardNameMapping[card.nameTr] || cardNameMapping[card.name] || card.name;

  // Pozisyon özel anlamları kontrol et
  let positionMeaning = null;

  switch (position) {
    case 1:
      positionMeaning =
        getSituationAnalysisPosition1MeaningByCardName(englishCardName);
      break;
    case 2:
      positionMeaning =
        getSituationAnalysisPosition2MeaningByCardName(englishCardName);
      break;
    case 3:
      positionMeaning =
        getSituationAnalysisPosition3MeaningByCardName(englishCardName);
      break;
    case 4:
      positionMeaning =
        getSituationAnalysisPosition4MeaningByCardName(englishCardName);
      break;
    case 5:
      positionMeaning =
        getSituationAnalysisPosition5MeaningByCardName(englishCardName);
      break;
    case 6:
      positionMeaning =
        getSituationAnalysisPosition6MeaningByCardName(englishCardName);
      break;
    case 7:
      positionMeaning =
        getSituationAnalysisPosition7MeaningByCardName(englishCardName);
      break;
  }

  if (positionMeaning) {
    const result = {
      ...positionMeaning,
      cardName: card.nameTr, // cardName alanını ekle
      // upright ve reversed alanlarını orijinal haliyle koru
      upright: positionMeaning.upright,
      reversed: positionMeaning.reversed,
    };
    return result;
  }

  // Fallback: Genel kart anlamlarını döndür
  const baseMeaning: SituationAnalysisPositionMeaning = {
    id: `situation-analysis-${position}-${card.id}-${isReversed ? 'reversed' : 'upright'}`,
    position: position,
    card: card.name,
    cardName: card.nameTr,
    isReversed,
    upright: card.meaningTr.upright,
    reversed: card.meaningTr.reversed,
    keywords: card.keywordsTr || card.keywords || [],
    context: `Durum analizi açılımında ${position}. pozisyon (${situationAnalysisPositions[position as keyof typeof situationAnalysisPositions]?.title}) için ${card.nameTr} kartının anlamı`,
    group: getCardGroup(card),
  };

  const fallbackResult = {
    ...baseMeaning,
    upright: isReversed ? baseMeaning.reversed : baseMeaning.upright,
    reversed: isReversed ? baseMeaning.upright : baseMeaning.reversed,
  };

  return fallbackResult;
}

// Pozisyon bilgileri ve açıklamaları
export const situationAnalysisPositions = {
  1: {
    title: 'Geçmiş ya da Sebepler',
    description: 'Mevcut durumun geçmişteki kökenleri',
    question: 'Bu durumun geçmişteki sebepleri nelerdir?',
  },
  2: {
    title: 'Şu Anki Durum',
    description: 'Mevcut durum ve koşullar',
    question: 'Şu anda yaşadığınız durum nasıl?',
  },
  3: {
    title: 'Gizli Etkenler',
    description: 'Bilinçaltı ve gizli faktörler',
    question: 'Fark etmediğiniz hangi faktörler etkili?',
  },
  4: {
    title: 'Merkez Kart',
    description: 'Durumun merkezi ve odak noktası',
    question: 'Bu durumun en önemli unsuru nedir?',
  },
  5: {
    title: 'Dış Etkenler',
    description: 'Dış dünyadan gelen etkiler',
    question: 'Dış faktörler nasıl etkiliyor?',
  },
  6: {
    title: 'Tavsiye',
    description: 'Önerilen hareket tarzı',
    question: 'Bu durumda ne yapmalısınız?',
  },
  7: {
    title: 'Olası Gelecek - Sonuç',
    description: 'Gelecekteki potansiyel sonuç',
    question: 'Bu durum nereye gidiyor?',
  },
};

// Pozisyon bilgilerini alma fonksiyonu
export const getSituationAnalysisPositionInfo = (position: number) => {
  return situationAnalysisPositions[
    position as keyof typeof situationAnalysisPositions
  ];
};

// Tüm pozisyonları alma fonksiyonu
export const getAllSituationAnalysisPositions = () => {
  return Object.entries(situationAnalysisPositions).map(([position, info]) => ({
    position: parseInt(position),
    ...info,
  }));
};

// Kart adına ve pozisyona göre anlam bulma fonksiyonu
export const getSituationAnalysisMeaningByCardNameAndPosition = (
  cardName: string,
  position: number,
  isReversed: boolean = false
): SituationAnalysisPositionMeaning | undefined => {
  // Bu fonksiyon TarotCard objesi gerektirir, bu yüzden mock bir obje oluşturuyoruz
  const mockCard: TarotCard = {
    id: 0,
    name: cardName,
    nameTr: cardName,
    suit: 'major', // Varsayılan
    number: 0,
    meaning: {
      upright: 'Temel anlam',
      reversed: 'Ters anlam',
    },
    meaningTr: {
      upright: 'Temel anlam',
      reversed: 'Ters anlam',
    },
    keywords: [],
    keywordsTr: [],
    image: '',
  };

  return getSituationAnalysisMeaningByCardAndPosition(
    mockCard,
    position,
    isReversed
  );
};

// Tüm pozisyon anlamlarını birleştiren ana array
export const allSituationAnalysisPositionMeanings: SituationAnalysisPositionMeaning[] =
  [
    ...position1Meanings,
    ...position2Meanings,
    ...position3Meanings,
    ...position4Meanings,
    ...position5Meanings,
    ...position6Meanings,
    ...position7Meanings,
  ];

// Pozisyon bazlı anlam alma fonksiyonları
export function getSituationAnalysisMeaningsByPosition(
  position: number
): SituationAnalysisPositionMeaning[] | null {
  if (position < 1 || position > 7) {
    return null;
  }

  switch (position) {
    case 1:
      return position1Meanings;
    case 2:
      return position2Meanings;
    case 3:
      return position3Meanings;
    case 4:
      return position4Meanings;
    case 5:
      return position5Meanings;
    case 6:
      return position6Meanings;
    case 7:
      return position7Meanings;
    default:
      return [];
  }
}

// Kart bazlı anlam alma fonksiyonu
export function getSituationAnalysisMeaningsByCard(
  card: TarotCard
): SituationAnalysisPositionMeaning[] {
  const meanings: SituationAnalysisPositionMeaning[] = [];

  for (let position = 1; position <= 7; position++) {
    const meaning = getSituationAnalysisMeaningByCardAndPosition(
      card,
      position
    );
    if (meaning) {
      meanings.push(meaning);
    }
  }

  return meanings;
}

// Tüm anlamları alma fonksiyonu
export function getAllSituationAnalysisMeanings(): Record<
  number,
  SituationAnalysisPositionMeaning[]
> {
  const allMeanings: Record<number, SituationAnalysisPositionMeaning[]> = {};

  for (let position = 1; position <= 7; position++) {
    allMeanings[position] =
      getSituationAnalysisMeaningsByPosition(position) || [];
  }

  return allMeanings;
}

// Kart gruplarına göre filtreleme fonksiyonu
export const getSituationAnalysisMeaningsByGroup = (
  group: 'Majör Arkana' | 'Kupalar' | 'Kılıçlar' | 'Asalar' | 'Tılsımlar'
): SituationAnalysisPositionMeaning[] => {
  return allSituationAnalysisPositionMeanings.filter(
    meaning => meaning.group === group
  );
};

// Pozisyon ve gruba göre filtreleme fonksiyonu
export const getSituationAnalysisMeaningsByPositionAndGroup = (
  position: number,
  group: 'Majör Arkana' | 'Kupalar' | 'Kılıçlar' | 'Asalar' | 'Tılsımlar'
): SituationAnalysisPositionMeaning[] => {
  return allSituationAnalysisPositionMeanings.filter(
    meaning => meaning.position === position && meaning.group === group
  );
};

// Arama fonksiyonu (kart adına göre)
export const searchSituationAnalysisMeaningsByCardName = (
  cardName: string
): SituationAnalysisPositionMeaning[] => {
  return allSituationAnalysisPositionMeanings.filter(
    meaning =>
      (meaning.cardName &&
        meaning.cardName.toLowerCase().includes(cardName.toLowerCase())) ||
      meaning.card.toLowerCase().includes(cardName.toLowerCase())
  );
};

// Anahtar kelimeye göre arama fonksiyonu
export const searchSituationAnalysisMeaningsByKeyword = (
  keyword: string
): SituationAnalysisPositionMeaning[] => {
  return allSituationAnalysisPositionMeanings.filter(meaning =>
    meaning.keywords.some(kw =>
      kw.toLowerCase().includes(keyword.toLowerCase())
    )
  );
};

// İstatistik fonksiyonları
export const getSituationAnalysisStatistics = () => {
  const totalCards = allSituationAnalysisPositionMeanings.length;
  const totalPositions = 7;
  const cardsPerPosition = totalCards > 0 ? totalCards / totalPositions : 0;

  const groupStats = {
    'Majör Arkana': allSituationAnalysisPositionMeanings.filter(
      m => m.group === 'Majör Arkana'
    ).length,
    Kupalar: allSituationAnalysisPositionMeanings.filter(
      m => m.group === 'Kupalar'
    ).length,
    Kılıçlar: allSituationAnalysisPositionMeanings.filter(
      m => m.group === 'Kılıçlar'
    ).length,
    Asalar: allSituationAnalysisPositionMeanings.filter(
      m => m.group === 'Asalar'
    ).length,
    Tılsımlar: allSituationAnalysisPositionMeanings.filter(
      m => m.group === 'Tılsımlar'
    ).length,
  };

  return {
    totalCards,
    totalPositions,
    cardsPerPosition,
    groupStats,
    positions: Object.keys(situationAnalysisPositions).length,
    groups: ['Majör Arkana', 'Kupalar', 'Kılıçlar', 'Asalar', 'Tılsımlar'],
  };
};

/**
 * i18n destekli Situation Analysis anlam fonksiyonu
 * @param cardName - Kart adı (örn: "The Fool")
 * @param position - Pozisyon numarası (1-7)
 * @param t - i18n translate fonksiyonu
 * @returns i18n destekli anlam veya null
 */
export const getI18nSituationAnalysisMeaningByCardAndPosition = (
  cardName: string,
  position: number,
  t: (_key: string) => string
): SituationAnalysisPositionMeaning | null => {
  // Orijinal anlamı al
  let originalMeaning: SituationAnalysisPositionMeaning | null = null;

  switch (position) {
    case 1:
      originalMeaning =
        getSituationAnalysisPosition1MeaningByCardName(cardName) ?? null;
      break;
    case 2:
      originalMeaning =
        getSituationAnalysisPosition2MeaningByCardName(cardName) ?? null;
      break;
    case 3:
      originalMeaning =
        getSituationAnalysisPosition3MeaningByCardName(cardName) ?? null;
      break;
    case 4:
      originalMeaning =
        getSituationAnalysisPosition4MeaningByCardName(cardName) ?? null;
      break;
    case 5:
      originalMeaning =
        getSituationAnalysisPosition5MeaningByCardName(cardName) ?? null;
      break;
    case 6:
      originalMeaning =
        getSituationAnalysisPosition6MeaningByCardName(cardName) ?? null;
      break;
    case 7:
      originalMeaning =
        getSituationAnalysisPosition7MeaningByCardName(cardName) ?? null;
      break;
    default:
      return null;
  }

  if (!originalMeaning) {
    return null;
  }

  // i18n'den çevirileri al
  const cardKey = cardName
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');

  const i18nUpright = t(
    `situation-analysis.meanings.${cardKey}.position${position}.upright`
  );
  const i18nReversed = t(
    `situation-analysis.meanings.${cardKey}.position${position}.reversed`
  );
  const i18nKeywords = t(
    `situation-analysis.meanings.${cardKey}.position${position}.keywords`
  );
  const i18nContext = t(
    `situation-analysis.meanings.${cardKey}.position${position}.context`
  );

  // i18n çevirisi mevcut değilse orijinali kullan
  const isI18nAvailable =
    i18nUpright && !i18nUpright.startsWith('situation-analysis.meanings.');

  return {
    ...originalMeaning,
    upright: isI18nAvailable ? i18nUpright : originalMeaning.upright,
    reversed:
      i18nReversed && !i18nReversed.startsWith('situation-analysis.meanings.')
        ? i18nReversed
        : originalMeaning.reversed,
    keywords: (() => {
      if (
        !i18nKeywords ||
        i18nKeywords.startsWith('situation-analysis.meanings.')
      ) {
        return originalMeaning.keywords;
      }
      // Keywords zaten array olabilir veya JSON string olabilir
      if (Array.isArray(i18nKeywords)) {
        return i18nKeywords;
      }
      try {
        const parsed = JSON.parse(i18nKeywords);
        if (Array.isArray(parsed)) {
          return parsed;
        }
        return originalMeaning.keywords;
      } catch (error) {
        console.error(
          `[Situation Analysis Position ${position}] Failed to parse keywords for ${cardName}:`,
          error
        );
        return originalMeaning.keywords;
      }
    })(),
    context:
      i18nContext && !i18nContext.startsWith('situation-analysis.meanings.')
        ? i18nContext
        : originalMeaning.context,
  };
};

// Varsayılan export
const situationAnalysisExports = {
  getSituationAnalysisMeaningByCardAndPosition,
  getSituationAnalysisMeaningByCardNameAndPosition,
  getSituationAnalysisMeaningsByPosition,
  getSituationAnalysisMeaningsByCard,
  getAllSituationAnalysisMeanings,
  allSituationAnalysisPositionMeanings,
  situationAnalysisPositions,
  getSituationAnalysisPositionInfo,
  getAllSituationAnalysisPositions,
  getSituationAnalysisMeaningsByGroup,
  getSituationAnalysisMeaningsByPositionAndGroup,
  searchSituationAnalysisMeaningsByCardName,
  searchSituationAnalysisMeaningsByKeyword,
  getSituationAnalysisStatistics,
  // i18n destekli fonksiyon
  getI18nSituationAnalysisMeaningByCardAndPosition,
  // Tüm pozisyon özel fonksiyonları
  getSituationAnalysisPosition1Meaning,
  getSituationAnalysisPosition1MeaningByCardName,
  position1Meanings,
  getSituationAnalysisPosition2Meaning,
  getSituationAnalysisPosition2MeaningByCardName,
  position2Meanings,
  getSituationAnalysisPosition3Meaning,
  getSituationAnalysisPosition3MeaningByCardName,
  position3Meanings,
  getSituationAnalysisPosition4Meaning,
  getSituationAnalysisPosition4MeaningByCardName,
  position4Meanings,
  getSituationAnalysisPosition5Meaning,
  getSituationAnalysisPosition5MeaningByCardName,
  position5Meanings,
  getSituationAnalysisPosition6Meaning,
  getSituationAnalysisPosition6MeaningByCardName,
  position6Meanings,
  getSituationAnalysisPosition7Meaning,
  getSituationAnalysisPosition7MeaningByCardName,
  position7Meanings,
};

export default situationAnalysisExports;
