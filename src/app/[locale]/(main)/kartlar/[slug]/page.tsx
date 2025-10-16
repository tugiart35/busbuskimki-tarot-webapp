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
  // Turkish routes only - return only slug, locale comes from parent
  const slugs = [
    // Turkish Major Arcana
    'joker',
    'yuksek-rahibe',
    'buyucu',
    'imparatorice',
    'imparator',
    'basrahip',
    'asiklar',
    'savas-arabasi',
    'guc',
    'ermis',
    'kader-carki',
    'adalet',
    'asili-adam',
    'olum',
    'olcululuk',
    'seytan',
    'kule',
    'yildiz',
    'ay',
    'gunes',
    'yargi',
    'dunya',

    // Cups suit - Turkish
    'kupalar-asi',
    'kupalar-ikili',
    'kupalar-uclu',
    'kupalar-dortlu',
    'kupalar-besli',
    'kupalar-altili',
    'kupalar-yedili',
    'kupalar-sekizli',
    'kupalar-dokuzlu',
    'kupalar-onlu',
    'kupalar-prensi',
    'kupalar-sovalyesi',
    'kupalar-kralicesi',
    'kupalar-krali',

    // Swords suit - Turkish
    'kiliclar-asi',
    'kiliclar-ikili',
    'kiliclar-uclu',
    'kiliclar-dortlu',
    'kiliclar-besli',
    'kiliclar-altili',
    'kiliclar-yedili',
    'kiliclar-sekizli',
    'kiliclar-dokuzlu',
    'kiliclar-onlu',
    'kiliclar-prensi',
    'kiliclar-sovalyesi',
    'kiliclar-kralicesi',
    'kiliclar-krali',

    // Wands suit - Turkish
    'asalar-asi',
    'asalar-ikili',
    'asalar-uclu',
    'asalar-dortlu',
    'asalar-besli',
    'asalar-altili',
    'asalar-yedili',
    'asalar-sekizli',
    'asalar-dokuzlu',
    'asalar-onlu',
    'asalar-prensi',
    'asalar-sovalyesi',
    'asalar-kralicesi',
    'asalar-krali',

    // Pentacles suit - Turkish
    'yildizlar-asi',
    'yildizlar-ikili',
    'yildizlar-uclu',
    'yildizlar-dortlu',
    'yildizlar-besli',
    'yildizlar-altili',
    'yildizlar-yedili',
    'yildizlar-sekizli',
    'yildizlar-dokuzlu',
    'yildizlar-onlu',
    'yildizlar-prensi',
    'yildizlar-sovalyesi',
    'yildizlar-kralicesi',
    'yildizlar-krali',
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
    logger.error('Error generating metadata for kartlar route', error);
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
    logger.error('Error loading card from kartlar route', error);
    notFound();
  }
}
