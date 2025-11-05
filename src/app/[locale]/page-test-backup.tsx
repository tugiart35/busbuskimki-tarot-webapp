// BACKUP - Original page.tsx
import { HomePageClient } from './HomePageClient';
import { setRequestLocale } from 'next-intl/server';

export const revalidate = 86400;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return [
    { locale: 'tr' },
    { locale: 'en' },
    { locale: 'sr' },
  ];
}

const STATIC_READINGS_COUNT = 50000;

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <HomePageClient locale={locale} initialReadings={STATIC_READINGS_COUNT} />;
}

