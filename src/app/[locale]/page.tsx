
import { MetadataHelper } from '@/lib/seo/metadata-helper';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const titles = {
  "tr": "Büşbüşkimki - Tarot ve Numeroloji",
  "en": "Busbuskimki - Tarot and Numerology",
  "sr": "Busbuskimki - Tarot i Numerologija"
};
  const descriptions = {
  "tr": "Profesyonel tarot falı ve numeroloji analizi",
  "en": "Professional tarot reading and numerology analysis",
  "sr": "Profesionalno tarot čitanje i numerološka analiza"
};

  const path = `/${locale}`;

  return MetadataHelper.generateMetadata({
    title: titles[locale as keyof typeof titles] || titles.tr,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.tr,
    path,
    locale,
    keywords: ['tarot', 'numeroloji', 'home'],
    noindex: false,
  });
}

import { HomePageClient } from './HomePageClient';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return <HomePageClient locale={locale} />;
}
