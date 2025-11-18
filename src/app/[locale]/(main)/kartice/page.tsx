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

const SR_LOCALE: SupportedLocale = 'sr';

export function generateStaticParams() {
  return [{ locale: SR_LOCALE }];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  await params;
  return buildCardListingMetadata(SR_LOCALE);
}

export default async function KarticePage({ params }: PageProps) {
  const { locale } = await params;

  if (locale !== SR_LOCALE) {
    const target = resolveRedirectTarget(locale);
    if (target) {
      redirect(target);
    }

    redirect('/sr/kartice');
  }

  return (
    <CardListingPageContent
      locale={SR_LOCALE}
      bottomNavigation={DynamicBottomNavigation}
    />
  );
}






