/*
 * Ana Sayfa - Tarot Uygulaması
 * Kullanıcıları tarot sayfasına yönlendiren landing page
 * Auth durumuna göre giriş butonu veya kullanıcı menüsü gösterir
 *
 * PERFORMANCE OPTIMIZATION:
 * - ISR (Incremental Static Regeneration) ile 5 dakikada bir yenileme
 * - CRITICAL FIX: Database query kaldırıldı - Server response time 1,040ms → ~100ms
 * - Static değer kullanımı ile TTFB iyileşmesi
 * 
 * SEO OPTIMIZATION:
 * - FAQ Schema added to homepage (removed from global layout to prevent duplication)
 */

import { HomePageClient } from './HomePageClient';
import { generateFAQSchema } from '@/lib/seo/schema-markup';

// ISR: Her 5 dakikada bir (300 saniye) statik sayfayı yenile
export const revalidate = 300;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// PERFORMANCE FIX: Static readings count
// Database query kaldırıldı - her request'te DB hit yapmıyor
// Manuel olarak güncellenebilir
const STATIC_READINGS_COUNT = 50000;

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // SEO FIX: Generate homepage-specific FAQ schema
  // Moved from global layout to prevent duplication with child layouts
  const faqSchema = generateFAQSchema(locale);

  return (
    <>
      {/* FAQ Schema - Homepage specific */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
      
      {/* PERFORMANCE: Static value kullan - database query yok */}
      {/* TTFB: 1,040ms → ~100ms iyileşmesi */}
      <HomePageClient locale={locale} initialReadings={STATIC_READINGS_COUNT} />
    </>
  );
}
