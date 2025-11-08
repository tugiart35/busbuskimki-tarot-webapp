import { Metadata } from 'next';
import {
  generateTarotPageMetadata,
  generateTarotPageStructuredData,
} from '@/lib/seo/tarot-seo-generator';

// Performance Optimization: ISR + Static Generation
export const revalidate = 3600; // 1 saat cache
export const dynamic = 'force-static'; // Full static generation
export const fetchCache = 'force-cache'; // Aggressive caching

// Static generation için locale params
export async function generateStaticParams() {
  return [{ locale: 'tr' }, { locale: 'en' }, { locale: 'sr' }];
}

// SEO Metadata generation for Tarot Reading page using tarotsayfasi.md data
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  // Use the new tarot SEO generator with tarotsayfasi.md data
  return generateTarotPageMetadata(locale);
}

export default async function TarotLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Generate structured data using tarotsayfasi.md data
  const structuredData = generateTarotPageStructuredData(locale);

  return (
    <>
      {/* Organization Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.organization),
        }}
      />

      {/* Website Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.website),
        }}
      />

      {/* Service Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.service),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.breadcrumb),
        }}
      />

      {/* FAQ Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.faq),
        }}
      />

      {children}
    </>
  );
}
