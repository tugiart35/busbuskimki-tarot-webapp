'use client';

import type { TarotCard } from '@/types/tarot';
import { createTarotReadingComponent } from '@/features/tarot/shared/components';
import { createMarriageConfig } from '@/features/tarot/shared/config';
import { getI18nMarriageMeaningByCardAndPosition } from '@/features/tarot/lib/marriage/position-meanings-index';
import { useTranslations } from '@/hooks/useTranslations';

export default function MarriageReading(props: any) {
  const { t } = useTranslations(); // Hook component içinde

  const TarotComponent = createTarotReadingComponent({
    getConfig: () => createMarriageConfig(),
    interpretationEmoji: '💒',
    readingType: 'MARRIAGE_SPREAD_DETAILED',
    getCardMeaning: (
      card: TarotCard | null,
      position: number,
      isReversed: boolean
    ) => {
      if (!card) {
        return '';
      }

      const meaning = getI18nMarriageMeaningByCardAndPosition(
        card.name,
        position,
        t
      );

      if (!meaning) {
        return isReversed ? card.meaningTr.reversed : card.meaningTr.upright;
      }

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