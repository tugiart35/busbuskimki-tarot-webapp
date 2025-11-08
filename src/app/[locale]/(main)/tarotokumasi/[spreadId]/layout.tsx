import { Metadata } from 'next';
import {
  generateSpreadMetadata,
  generateSpreadStructuredData,
} from '@/lib/seo/spread-seo-generator';

// SEO Metadata generation for individual spread pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; spreadId: string }>;
}): Promise<Metadata> {
  const { locale, spreadId } = await params;
  return generateSpreadMetadata(spreadId, locale);
}

export default async function SpreadLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string; spreadId: string }>;
}) {
  const { locale, spreadId } = await params;

  // Generate structured data for SEO
  const structuredData = generateSpreadStructuredData(spreadId, locale);

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.breadcrumb),
        }}
      />

      {/* WebPage Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.webpage),
        }}
      />

      {/* Service/Product Schema */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData.service),
        }}
      />

      {children}
    </>
  );
}
