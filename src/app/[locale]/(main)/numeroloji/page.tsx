/**
 * Numeroloji Server Wrapper
 * Unwraps params promise and passes to client component
 * PERFORMANCE: Clean server/client separation
 */

import NumerologyPageClient from './NumerologyPageClient';

interface NumerologyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function NumerologyPage({ params }: NumerologyPageProps) {
  const { locale } = await params;
  
  return <NumerologyPageClient locale={locale} />;
}
