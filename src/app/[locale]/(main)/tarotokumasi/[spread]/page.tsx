/*
 * Dynamic Spread Page - Server Component Wrapper
 * Unwraps params promise and passes to client component
 */

import SpreadPageClient from './SpreadPageClient';

interface SpreadPageProps {
  params: Promise<{ spread: string; locale: string }>;
}

export default async function SpreadPage({ params }: SpreadPageProps) {
  const { spread: spreadId, locale } = await params;
  
  return <SpreadPageClient spreadId={spreadId} locale={locale} />;
}

