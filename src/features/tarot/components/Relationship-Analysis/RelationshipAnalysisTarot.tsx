'use client';

import type { TarotCard } from '@/types/tarot';
import { useTranslations } from '@/hooks/useTranslations';
import { createTarotReadingComponent } from '@/features/tarot/shared/components';
import { createRelationshipAnalysisConfig } from '@/features/tarot/shared/config';
import { getI18nRelationshipAnalysisMeaningByCardAndPosition } from '@/features/tarot/lib/relationship-analysis/position-meanings-index';

export default function RelationshipAnalysisReading(props: any) {
  // i18n hook'unu component içinde kullan
  const { t } = useTranslations();

  // TarotComponent'i hook'ların içinde oluştur
  const TarotComponent = createTarotReadingComponent({
    getConfig: () => createRelationshipAnalysisConfig(t),
    interpretationEmoji: '💕',
    readingType: 'RELATIONSHIP_ANALYSIS_DETAILED',
    getCardMeaning: (
      card: TarotCard | null,
      position: number,
      isReversed: boolean
    ) => {
      if (!card) {
        return '';
      }

      // i18n destekli anlam al - t fonksiyonu closure ile erişilebilir!
      const meaning = getI18nRelationshipAnalysisMeaningByCardAndPosition(
        card.name,
        position,
        t
      );

      if (!meaning) {
        // Fallback: kartın kendi Türkçe anlamını kullan
        return isReversed ? card.meaningTr.reversed : card.meaningTr.upright;
      }

      // Context bilgisini döndür
      const interpretation = isReversed ? meaning.reversed : meaning.upright;
      return {
        interpretation,
        context: meaning.context || '',
        keywords: meaning.keywords || [],
      };
    },
  });

  return <TarotComponent {...props} />;
}
