'use client';

import type { TarotCard } from '@/types/tarot';
import { useTranslations } from '@/hooks/useTranslations';
import { createTarotReadingComponent } from '@/features/tarot/shared/components';
import { createSingleCardConfig } from '@/features/tarot/shared/config';

export default function SingleCardReading(props: any) {
  // i18n hook'unu component içinde kullan
  const { t } = useTranslations();

  // Kart ismini JSON key'ine dönüştür (örn: "The Fool" -> "the-fool")
  const getCardKeyFromName = (cardName: string): string => {
    return cardName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  // TarotComponent'i hook'ların içinde oluştur
  const TarotComponent = createTarotReadingComponent({
    getConfig: () => createSingleCardConfig(t), // t fonksiyonunu parametre olarak ver
    interpretationEmoji: '🎴',
    getCardMeaning: (
      card: TarotCard | null,
      _position: number,
      isReversed: boolean
    ) => {
      if (!card) {
        return '';
      }

      // Tek kart okuması için blog.cards'dan anlamı çek
      const cardKey = getCardKeyFromName(card.name);
      const meaningKey = isReversed
        ? `blog.cards.${cardKey}.meanings.reversed.general`
        : `blog.cards.${cardKey}.meanings.upright.general`;
      
      const meaning = t(meaningKey);
      
      // Eğer çeviri bulunamazsa (key dönerse), fallback olarak kartın kendi anlamını kullan
      if (meaning === meaningKey) {
        return isReversed ? card.meaningTr.reversed : card.meaningTr.upright;
      }

      return meaning;
    },
  });

  return <TarotComponent {...props} />;
}

