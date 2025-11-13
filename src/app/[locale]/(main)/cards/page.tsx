import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CardListingPageContent } from '@/features/tarot/card-listing/CardListingPageContent';
import {
  buildCardListingMetadata,
  resolveRedirectTarget,
  type SupportedLocale,
} from '@/features/tarot/card-listing/config';
import { DynamicBottomNavigation } from './[slug]/DynamicCardComponents';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

const EN_LOCALE: SupportedLocale = 'en';

export function generateStaticParams() {
  return [{ locale: EN_LOCALE }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await params;
  return buildCardListingMetadata(EN_LOCALE);
}

export default async function CardsPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== EN_LOCALE) {
    const target = resolveRedirectTarget(locale);
    if (target) {
      redirect(target);
    }

    redirect('/en/cards');
  }

  return (
    <CardListingPageContent
      locale={EN_LOCALE}
      bottomNavigation={DynamicBottomNavigation}
    />
  );
}


