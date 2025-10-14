/*
info:
---
Dosya Amacı:
- Problem Çözme açılımı için pozisyon bazlı kart anlamları
- Her kartın her pozisyonda nasıl yorumlanacağını belirler
- Pozisyon özel anlamlar + genel kart anlamlarını birleştirir
- Kart ismi eşleştirmesi ve arama fonksiyonları içerir

Bağlı Dosyalar:
- ProblemSolvingTarot.tsx (ana bileşen)
- problem-solving-config.ts (pozisyon bilgileri)
- card-name-mapping.ts (kart ismi eşleştirmesi)

Üretime Hazır mı?:
- Evet, temel yapı hazır, detaylı anlamlar eklenebilir
---

*/
'use client';

import { TarotCard } from '@/types/tarot';
import {
  position1Meanings,
  getProblemSolvingPosition1Meaning,
  getProblemSolvingPosition1MeaningByCardName,
} from './position-1-sorulan-soru';
import {
  position2Meanings,
  getProblemSolvingPosition2Meaning,
  getProblemSolvingPosition2MeaningByCardName,
} from './position-2-sorunun-engeli';
import {
  position3Meanings,
  getProblemSolvingPosition3Meaning,
  getProblemSolvingPosition3MeaningByCardName,
} from './position-3-suur-alti-konu';
import {
  position4Meanings,
  getProblemSolvingPosition4Meaning,
  getProblemSolvingPosition4MeaningByCardName,
} from './position-4-en-iyi-potansiyel';
import {
  position5Meanings,
  getProblemSolvingPosition5Meaning,
  getProblemSolvingPosition5MeaningByCardName,
} from './position-5-yakin-gecmiste';
import {
  position6Meanings,
  getProblemSolvingPosition6Meaning,
  getProblemSolvingPosition6MeaningByCardName,
} from './position-6-yakin-gelecek';
import {
  position7Meanings,
  getProblemSolvingPosition7Meaning,
  getProblemSolvingPosition7MeaningByCardName,
} from './position-7-mevcut-durum';
import {
  position8Meanings,
  getProblemSolvingPosition8Meaning,
  getProblemSolvingPosition8MeaningByCardName,
} from './position-8-dis-etkeler';
import {
  position9Meanings,
  getProblemSolvingPosition9Meaning,
  getProblemSolvingPosition9MeaningByCardName,
} from './position-9-korkular-endiseler';
import {
  position10Meanings,
  getProblemSolvingPosition10Meaning,
  getProblemSolvingPosition10MeaningByCardName,
} from './position-10-olayin-sonucu';
import { getCardNameMappingSync } from '@/features/tarot/lib/love/card-name-mapping';

/**
 * Problem Çözme açılımı için pozisyon bazlı anlam arayüzü
 */
export interface ProblemSolvingPositionMeaning {
  id: string;
  card: string;
  position: number;
  upright: string;
  reversed: string;
  keywords: string[];
  context: string;
  group: 'Majör Arkana' | 'Kupalar' | 'Kılıçlar' | 'Asalar' | 'Tılsımlar';
}

// Problem Çözme açılımı pozisyon bilgileri
export const problemSolvingPositions = {
  1: {
    title: 'Mevcut Durum',
    description: 'Şu anki problem durumunuz',
    question: 'Şu anda hangi problemle karşı karşıyasınız?',
  },
  2: {
    title: 'Problem Kaynağı',
    description: 'Problemin kökeni ve nedenleri',
    question: 'Bu problem nasıl ortaya çıktı?',
  },
  3: {
    title: 'Engeller',
    description: 'Çözüm önündeki engeller',
    question: 'Hangi engeller çözümü zorlaştırıyor?',
  },
  4: {
    title: 'Geçmiş Deneyimler',
    description: 'Geçmişteki benzer deneyimler',
    question: 'Geçmişte benzer problemleri nasıl çözdünüz?',
  },
  5: {
    title: 'Mevcut Kaynaklar',
    description: 'Çözüm için mevcut kaynaklar',
    question: 'Çözüm için hangi kaynaklara sahipsiniz?',
  },
  6: {
    title: 'Dış Faktörler',
    description: 'Dış etkiler ve faktörler',
    question: 'Dış faktörler problemi nasıl etkiliyor?',
  },
  7: {
    title: 'İç Görü',
    description: 'İç dünyanızdan gelen rehberlik',
    question: 'İç sesiniz size ne söylüyor?',
  },
  8: {
    title: 'Çözüm Yolu',
    description: 'Önerilen çözüm yaklaşımı',
    question: 'Hangi yaklaşım en etkili olacak?',
  },
  9: {
    title: 'Sonuç',
    description: 'Çözümün beklenen sonucu',
    question: 'Bu çözüm nasıl bir sonuç verecek?',
  },
  10: {
    title: 'Öğrenilen Dersler',
    description: 'Bu deneyimden çıkarılacak dersler',
    question: 'Bu problemden ne öğrenebilirsiniz?',
  },
};

/**
 * Problem Çözme açılımında belirli bir kartın belirli pozisyondaki anlamını döndürür
 * @param card - Tarot kartı
 * @param position - Pozisyon numarası (1-10)
 * @param isReversed - Kart ters mi?
 * @returns Pozisyon özel anlam veya null
 */
export function getProblemSolvingMeaningByCardAndPosition(
  card: TarotCard,
  position: number,
  isReversed: boolean = false
): ProblemSolvingPositionMeaning | null {
  // Pozisyon 1-10 arasında olmalı
  if (position < 1 || position > 10) {
    return null;
  }

  // Kart ismi mapping'ini al
  const cardNameMapping = getCardNameMappingSync();

  // Kart ismini İngilizce'ye çevir
  const englishCardName = cardNameMapping[card.nameTr] || card.nameTr;
    original: card.nameTr,
    mapped: englishCardName,
    position: position,
  });

  // Pozisyon özel anlamları kontrol et
  let positionMeaning = null;

  switch (position) {
    case 1:
        englishCardName,
        position,
        isReversed,
      });
      positionMeaning =
        getProblemSolvingPosition1MeaningByCardName(englishCardName);
        found: !!positionMeaning,
        card: positionMeaning?.card,
        upright: positionMeaning?.upright?.substring(0, 50) + '...',
      });
      break;
    case 2:
      positionMeaning =
        getProblemSolvingPosition2MeaningByCardName(englishCardName);
      break;
    case 3:
      positionMeaning =
        getProblemSolvingPosition3MeaningByCardName(englishCardName);
      break;
    case 4:
      positionMeaning =
        getProblemSolvingPosition4MeaningByCardName(englishCardName);
      break;
    case 5:
      positionMeaning =
        getProblemSolvingPosition5MeaningByCardName(englishCardName);
      break;
    case 6:
      positionMeaning =
        getProblemSolvingPosition6MeaningByCardName(englishCardName);
      break;
    case 7:
      positionMeaning =
        getProblemSolvingPosition7MeaningByCardName(englishCardName);
      break;
    case 8:
      positionMeaning =
        getProblemSolvingPosition8MeaningByCardName(englishCardName);
      break;
    case 9:
      positionMeaning =
        getProblemSolvingPosition9MeaningByCardName(englishCardName);
      break;
    case 10:
      positionMeaning =
        getProblemSolvingPosition10MeaningByCardName(englishCardName);
      break;
  }

  if (positionMeaning) {
    const result = {
      ...positionMeaning,
      // upright ve reversed alanlarını orijinal haliyle koru
      upright: positionMeaning.upright,
      reversed: positionMeaning.reversed,
    };
    return result;
  }

    '⚠️ No position-specific meaning found, using fallback for:',
    card.nameTr
  );

  // Fallback: Genel kart anlamlarını döndür
  const baseMeaning: ProblemSolvingPositionMeaning = {
    id: `${card.name.toLowerCase().replace(/\s+/g, '_')}_pos${position}`,
    card: card.name,
    position: position,
    upright: card.meaningTr.upright,
    reversed: card.meaningTr.reversed,
    keywords: card.keywordsTr || card.keywords || [],
    context: `Problem çözme açılımında ${position}. pozisyon (${problemSolvingPositions[position as keyof typeof problemSolvingPositions]?.title}) için ${card.nameTr} kartının anlamı`,
    group: getCardGroup(card),
  };

  const fallbackResult = {
    ...baseMeaning,
    upright: isReversed ? baseMeaning.reversed : baseMeaning.upright,
    reversed: isReversed ? baseMeaning.upright : baseMeaning.reversed,
  };

    '✅ Returning fallback meaning:',
    fallbackResult.upright.substring(0, 50) + '...'
  );
  return fallbackResult;
}

/**
 * Kartın grubunu belirler
 * @param card - Tarot kartı
 * @returns Kart grubu
 */
function getCardGroup(
  card: TarotCard
): 'Majör Arkana' | 'Kupalar' | 'Kılıçlar' | 'Asalar' | 'Tılsımlar' {
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
}

/**
 * Belirli bir pozisyon için tüm kart anlamlarını getirir
 * @param position - Pozisyon numarası (1-10)
 * @returns Pozisyon anlamları array'i veya null
 */
export function getProblemSolvingMeaningsByPosition(
  position: number
): ProblemSolvingPositionMeaning[] | null {
  if (position < 1 || position > 10) {
    return null;
  }

  // Pozisyon özel anlamları döndür
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
    case 8:
      return position8Meanings;
    case 9:
      return position9Meanings;
    case 10:
      return position10Meanings;
    default:
      return [];
  }
}

/**
 * Belirli bir kart için tüm pozisyon anlamlarını getirir
 * @param card - Tarot kartı
 * @returns Kart anlamları array'i
 */
export function getProblemSolvingMeaningsByCard(
  card: TarotCard
): ProblemSolvingPositionMeaning[] {
  const meanings: ProblemSolvingPositionMeaning[] = [];

  for (let position = 1; position <= 10; position++) {
    const meaning = getProblemSolvingMeaningByCardAndPosition(card, position);
    if (meaning) {
      meanings.push(meaning);
    }
  }

  return meanings;
}

/**
 * Tüm pozisyon anlamlarını getirir
 * @returns Tüm pozisyon anlamları
 */
export function getAllProblemSolvingMeanings(): Record<
  number,
  ProblemSolvingPositionMeaning[]
> {
  const allMeanings: Record<number, ProblemSolvingPositionMeaning[]> = {};

  for (let position = 1; position <= 10; position++) {
    allMeanings[position] = getProblemSolvingMeaningsByPosition(position) || [];
  }

  return allMeanings;
}

// Pozisyon bilgilerini alma fonksiyonu
export const getPositionInfo = (position: number) => {
  return problemSolvingPositions[
    position as keyof typeof problemSolvingPositions
  ];
};

// Tüm pozisyonları alma fonksiyonu
export const getAllPositions = () => {
  return Object.entries(problemSolvingPositions).map(([position, info]) => ({
    position: parseInt(position),
    ...info,
  }));
};

// Kart gruplarına göre filtreleme fonksiyonu
export const getMeaningsByGroup = (
  _group: 'Majör Arkana' | 'Kupalar' | 'Kılıçlar' | 'Asalar' | 'Tılsımlar'
): ProblemSolvingPositionMeaning[] => {
  // Şimdilik boş array döndür, ileride implement edilebilir
  return [];
};

// Pozisyon ve gruba göre filtreleme fonksiyonu
export const getMeaningsByPositionAndGroup = (
  position: number,
  group: 'Majör Arkana' | 'Kupalar' | 'Kılıçlar' | 'Asalar' | 'Tılsımlar'
): ProblemSolvingPositionMeaning[] => {
  const positionMeanings = getProblemSolvingMeaningsByPosition(position);
  if (!positionMeanings) {
    return [];
  }
  return positionMeanings.filter(meaning => meaning.group === group);
};

// Arama fonksiyonu (kart adına göre)
export const searchMeaningsByCardName = (
  _cardName: string
): ProblemSolvingPositionMeaning[] => {
  // Şimdilik boş array döndür, ileride implement edilebilir
  return [];
};

// Anahtar kelimeye göre arama fonksiyonu
export const searchMeaningsByKeyword = (
  _keyword: string
): ProblemSolvingPositionMeaning[] => {
  // Şimdilik boş array döndür, ileride implement edilebilir
  return [];
};

// İstatistik fonksiyonları
export const getStatistics = () => {
  const totalPositions = 10;
  const cardsPerPosition = 0; // Şimdilik 0, ileride hesaplanacak

  const groupStats = {
    'Majör Arkana': 0,
    Kupalar: 0,
    Kılıçlar: 0,
    Asalar: 0,
    Tılsımlar: 0,
  };

  return {
    totalCards: 0,
    totalPositions,
    cardsPerPosition,
    groupStats,
  };
};

/**
 * i18n destekli Problem Solving anlam fonksiyonu
 * @param cardName - Kart adı (örn: "The Fool")
 * @param position - Pozisyon numarası (1-10)
 * @param t - i18n translate fonksiyonu
 * @returns i18n destekli anlam veya null
 */
export const getI18nProblemSolvingMeaningByCardAndPosition = (
  cardName: string,
  position: number,
  t: (_key: string) => string
): ProblemSolvingPositionMeaning | null => {
  // Orijinal anlamı al
  let originalMeaning: ProblemSolvingPositionMeaning | null = null;

  switch (position) {
    case 1:
      originalMeaning = getProblemSolvingPosition1MeaningByCardName(cardName);
      break;
    case 2:
      originalMeaning = getProblemSolvingPosition2MeaningByCardName(cardName);
      break;
    case 3:
      originalMeaning = getProblemSolvingPosition3MeaningByCardName(cardName);
      break;
    case 4:
      originalMeaning = getProblemSolvingPosition4MeaningByCardName(cardName);
      break;
    case 5:
      originalMeaning = getProblemSolvingPosition5MeaningByCardName(cardName);
      break;
    case 6:
      originalMeaning = getProblemSolvingPosition6MeaningByCardName(cardName);
      break;
    case 7:
      originalMeaning = getProblemSolvingPosition7MeaningByCardName(cardName);
      break;
    case 8:
      originalMeaning = getProblemSolvingPosition8MeaningByCardName(cardName);
      break;
    case 9:
      originalMeaning = getProblemSolvingPosition9MeaningByCardName(cardName);
      break;
    case 10:
      originalMeaning = getProblemSolvingPosition10MeaningByCardName(cardName);
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
    `problem-solving.meanings.${cardKey}.position${position}.upright`
  );
  const i18nReversed = t(
    `problem-solving.meanings.${cardKey}.position${position}.reversed`
  );
  const i18nKeywords = t(
    `problem-solving.meanings.${cardKey}.position${position}.keywords`
  );
  const i18nContext = t(
    `problem-solving.meanings.${cardKey}.position${position}.context`
  );

  // i18n çevirisi mevcut değilse orijinali kullan
  const isI18nAvailable =
    i18nUpright && !i18nUpright.startsWith('problem-solving.meanings.');

  return {
    ...originalMeaning,
    upright: isI18nAvailable ? i18nUpright : originalMeaning.upright,
    reversed:
      i18nReversed && !i18nReversed.startsWith('problem-solving.meanings.')
        ? i18nReversed
        : originalMeaning.reversed,
    keywords: (() => {
      if (
        !i18nKeywords ||
        i18nKeywords.startsWith('problem-solving.meanings.')
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
          `[Problem Solving Position ${position}] Failed to parse keywords for ${cardName}:`,
          error
        );
        return originalMeaning.keywords;
      }
    })(),
    context:
      i18nContext && !i18nContext.startsWith('problem-solving.meanings.')
        ? i18nContext
        : originalMeaning.context,
  };
};

// Varsayılan export
const problemSolvingExports = {
  getProblemSolvingMeaningByCardAndPosition,
  getProblemSolvingMeaningsByPosition,
  getProblemSolvingMeaningsByCard,
  getAllProblemSolvingMeanings,
  problemSolvingPositions,
  getPositionInfo,
  getAllPositions,
  getMeaningsByGroup,
  getMeaningsByPositionAndGroup,
  searchMeaningsByCardName,
  searchMeaningsByKeyword,
  getStatistics,
  // i18n destekli fonksiyon
  getI18nProblemSolvingMeaningByCardAndPosition,
  // Tüm pozisyon özel fonksiyonları
  getProblemSolvingPosition1Meaning,
  getProblemSolvingPosition1MeaningByCardName,
  position1Meanings,
  getProblemSolvingPosition2Meaning,
  getProblemSolvingPosition2MeaningByCardName,
  position2Meanings,
  getProblemSolvingPosition3Meaning,
  getProblemSolvingPosition3MeaningByCardName,
  position3Meanings,
  getProblemSolvingPosition4Meaning,
  getProblemSolvingPosition4MeaningByCardName,
  position4Meanings,
  getProblemSolvingPosition5Meaning,
  getProblemSolvingPosition5MeaningByCardName,
  position5Meanings,
  getProblemSolvingPosition6Meaning,
  getProblemSolvingPosition6MeaningByCardName,
  position6Meanings,
  getProblemSolvingPosition7Meaning,
  getProblemSolvingPosition7MeaningByCardName,
  position7Meanings,
  getProblemSolvingPosition8Meaning,
  getProblemSolvingPosition8MeaningByCardName,
  position8Meanings,
  getProblemSolvingPosition9Meaning,
  getProblemSolvingPosition9MeaningByCardName,
  position9Meanings,
  getProblemSolvingPosition10Meaning,
  getProblemSolvingPosition10MeaningByCardName,
  position10Meanings,
};

export default problemSolvingExports;
