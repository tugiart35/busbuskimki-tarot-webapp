import { notFound } from 'next/navigation';
import CardPage from '@/features/tarot-cards/components/CardPage';
import { CardData } from '@/features/tarot-cards/lib/card-data';
import { CardSEO } from '@/features/tarot-cards/lib/card-seo';
import { getTranslations } from 'next-intl/server';
import { logger } from '@/lib/logger';
import { getCardIdFromSlug, getCardAlternateFullUrls } from '@/lib/i18n/card-url-mapper';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // English routes only - return only slug, locale comes from parent
  const slugs = [
    // English Major Arcana
    'the-fool',
    'the-high-priestess',
    'the-magician',
    'the-empress',
    'the-emperor',
    'the-hierophant',
    'the-lovers',
    'the-chariot',
    'strength',
    'the-hermit',
    'wheel-of-fortune',
    'justice',
    'the-hanged-man',
    'death',
    'temperance',
    'the-devil',
    'the-tower',
    'the-star',
    'the-moon',
    'the-sun',
    'judgement',
    'the-world',

    // Cups suit - English
    'ace-of-cups',
    'two-of-cups',
    'three-of-cups',
    'four-of-cups',
    'five-of-cups',
    'six-of-cups',
    'seven-of-cups',
    'eight-of-cups',
    'nine-of-cups',
    'ten-of-cups',
    'page-of-cups',
    'knight-of-cups',
    'queen-of-cups',
    'king-of-cups',

    // Swords suit - English
    'ace-of-swords',
    'two-of-swords',
    'three-of-swords',
    'four-of-swords',
    'five-of-swords',
    'six-of-swords',
    'seven-of-swords',
    'eight-of-swords',
    'nine-of-swords',
    'ten-of-swords',
    'page-of-swords',
    'knight-of-swords',
    'queen-of-swords',
    'king-of-swords',

    // Wands suit - English
    'ace-of-wands',
    'two-of-wands',
    'three-of-wands',
    'four-of-wands',
    'five-of-wands',
    'six-of-wands',
    'seven-of-wands',
    'eight-of-wands',
    'nine-of-wands',
    'ten-of-wands',
    'page-of-wands',
    'knight-of-wands',
    'queen-of-wands',
    'king-of-wands',

    // Pentacles suit - English
    'ace-of-pentacles',
    'two-of-pentacles',
    'three-of-pentacles',
    'four-of-pentacles',
    'five-of-pentacles',
    'six-of-pentacles',
    'seven-of-pentacles',
    'eight-of-pentacles',
    'nine-of-pentacles',
    'ten-of-pentacles',
    'page-of-pentacles',
    'knight-of-pentacles',
    'queen-of-pentacles',
    'king-of-pentacles',
  ];

  return slugs.map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'cards.errors' });

  try {
    const cardData = await CardData.getCardBySlug(
      slug,
      locale as 'tr' | 'en' | 'sr'
    );
    if (!cardData) {
      return {
        title: t('notFound'),
        description: t('notFoundDescription'),
      };
    }

    const metadata = CardSEO.generateMetadata(
      cardData.card,
      cardData.seo,
      locale as 'tr' | 'en' | 'sr'
    );

    // Dil alternatifleri için URL'leri oluştur
    const cardId = getCardIdFromSlug(slug);
    const alternateUrls = cardId ? getCardAlternateFullUrls(cardId) : null;

    // Metadata'ya alternates ekle
    return {
      ...metadata,
      alternates: alternateUrls
        ? {
            canonical: alternateUrls[locale as 'tr' | 'en' | 'sr'],
            languages: {
              'tr': alternateUrls.tr,
              'en': alternateUrls.en,
              'sr': alternateUrls.sr,
            },
          }
        : undefined,
    };
  } catch (error) {
    logger.error('Error generating metadata for cards route', error);
    return {
      title: t('notFound'),
      description: t('notFoundDescription'),
    };
  }
}

export default async function CardPageRoute({ params }: PageProps) {
  const { locale, slug } = await params;

  try {
    const cardData = await CardData.getCardBySlug(
      slug,
      locale as 'tr' | 'en' | 'sr'
    );

    if (!cardData) {
      notFound();
    }

    // ✅ Schema'lar CardPage component'i içinde oluşturuluyor
    // Duplicate schema'dan kaçınmak için burada oluşturmuyoruz
    // ✅ Footer ve BottomNavigation layout'tan geliyor, burada tekrar eklemeye gerek yok
    return <CardPage card={cardData} locale={locale as 'tr' | 'en' | 'sr'} slug={slug} />;
  } catch (error) {
    logger.error('Error loading card from cards route', error);
    notFound();
  }
}
