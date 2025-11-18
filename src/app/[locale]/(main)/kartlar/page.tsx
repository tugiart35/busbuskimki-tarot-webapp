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

const TR_LOCALE: SupportedLocale = 'tr';

export function generateStaticParams() {
  return [{ locale: TR_LOCALE }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await params;
  return buildCardListingMetadata(TR_LOCALE);
}

export default async function KartlarPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== TR_LOCALE) {
    const target = resolveRedirectTarget(locale);
    if (target) {
      redirect(target);
    }

    redirect('/tr/kartlar');
  }

  return (
    <CardListingPageContent
      locale={TR_LOCALE}
      bottomNavigation={DynamicBottomNavigation}
    />
  );
}




