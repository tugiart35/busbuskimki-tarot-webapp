import { notFound } from 'next/navigation';
import CardPage from '@/features/tarot-cards/components/CardPage';
import { CardData } from '@/features/tarot-cards/lib/card-data';
import { CardSEO } from '@/features/tarot-cards/lib/card-seo';
import BottomNavigation from '@/features/shared/layout/BottomNavigation';
import Footer from '@/features/shared/layout/Footer';
import { getTranslations } from 'next-intl/server';
import { logger } from '@/lib/logger';
import { generateArticleSchema, generateBreadcrumbSchema } from '@/lib/seo/schema-markup';
import { getCardIdFromSlug, getCardAlternateFullUrls } from '@/lib/i18n/card-url-mapper';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  // Serbian routes only - return only slug, locale comes from parent
  const slugs = [
    // Serbian Major Arcana
    'joker',
    'visoka-svestenica',
    'carobnjak',
    'carica',
    'car',
    'prvosveštenica',
    'ljubavnici',
    'ratna-kolica',
    'snaga',
    'pustinjak',
    'kolo-srece',
    'pravda',
    'obeseni',
    'smrt',
    'umerenost',
    'djavol',
    'kula',
    'zvezda',
    'mesec',
    'sunce',
    'sud',
    'svet',

    // Cups suit - Serbian
    'kupa-as',
    'kupa-dvojka',
    'kupa-trojka',
    'kupa-cetvorka',
    'kupa-petica',
    'kupa-sestica',
    'kupa-sedmica',
    'kupa-osmica',
    'kupa-devetka',
    'kupa-desetka',
    'kupa-paz',
    'kupa-vitez',
    'kupa-kraljica',
    'kupa-kralj',

    // Swords suit - Serbian
    'mace-as',
    'mace-dvojka',
    'mace-trojka',
    'mace-cetvorka',
    'mace-petica',
    'mace-sestica',
    'mace-sedmica',
    'mace-osmica',
    'mace-devetka',
    'mace-desetka',
    'mace-paz',
    'mace-vitez',
    'mace-kraljica',
    'mace-kralj',

    // Wands suit - Serbian
    'stap-as',
    'stap-dvojka',
    'stap-trojka',
    'stap-cetvorka',
    'stap-petica',
    'stap-sestica',
    'stap-sedmica',
    'stap-osmica',
    'stap-devetka',
    'stap-desetka',
    'stap-paz',
    'stap-vitez',
    'stap-kraljica',
    'stap-kralj',

    // Pentacles suit - Serbian
    'novcic-as',
    'novcic-dvojka',
    'novcic-trojka',
    'novcic-cetvorka',
    'novcic-petica',
    'novcic-sestica',
    'novcic-sedmica',
    'novcic-osmica',
    'novcic-devetka',
    'novcic-desetka',
    'novcic-paz',
    'novcic-vitez',
    'novcic-kraljica',
    'novcic-kralj',
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
    logger.error('Error generating metadata for kartice route', error);
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

    // Generate Article schema for this card
    const articleSchema = generateArticleSchema({
      title: cardData.seo.metaTitle,
      description: cardData.seo.metaDescription,
      imageUrl: cardData.card.imageUrl,
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      authorName: 'BüşBüşKimKi',
      locale: locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'sr-RS',
    });

    // Generate Breadcrumb schema
    const breadcrumbSchema = generateBreadcrumbSchema([
      {
        name: locale === 'tr' ? 'Anasayfa' : locale === 'en' ? 'Home' : 'Početna',
        url: `https://busbuskimki.com/${locale}`,
      },
      {
        name: locale === 'tr' ? 'Kartlar' : locale === 'en' ? 'Cards' : 'Kartice',
        url: `https://busbuskimki.com/${locale}/${locale === 'tr' ? 'kartlar' : locale === 'en' ? 'cards' : 'kartice'}`,
      },
      {
        name: cardData.seo.metaTitle,
        url: `https://busbuskimki.com/${locale}/${locale === 'tr' ? 'kartlar' : locale === 'en' ? 'cards' : 'kartice'}/${slug}`,
      },
    ]);

    return (
      <>
        {/* Article Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
        {/* Breadcrumb Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbSchema),
          }}
        />

        <CardPage card={cardData} locale={locale as 'tr' | 'en' | 'sr'} />
        <BottomNavigation />
        <Footer />
      </>
    );
  } catch (error) {
    logger.error('Error loading card from kartice route', error);
    notFound();
  }
}
