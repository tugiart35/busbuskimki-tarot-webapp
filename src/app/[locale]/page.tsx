/*
 * Ana Sayfa - Tarot Uygulaması
 * Kullanıcıları tarot sayfasına yönlendiren landing page
 * Auth durumuna göre giriş butonu veya kullanıcı menüsü gösterir
 *
 * PERFORMANCE OPTIMIZATION:
 * - ISR (Incremental Static Regeneration) ile 5 dakikada bir yenileme
 * - Server-side'da readings sayısı cache'leniyor
 * - Client'ta gereksiz database query'si kaldırıldı
 */

import { HomePageClient } from './HomePageClient';
import { createClient } from '@supabase/supabase-js';

// ISR: Her 5 dakikada bir (300 saniye) statik sayfayı yenile
export const revalidate = 300;

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// Server-side'da readings sayısını çek (cache'lenmiş)
async function getTotalReadings(): Promise<number> {
  try {
    // Supabase client oluştur
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { count, error } = await supabase
      .from('readings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (error || !count) {
      return 42000; // Fallback değer
    }

    return count;
  } catch {
    return 42000; // Fallback değer
  }
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Server-side'da readings sayısını çek (ISR ile cache'lenir)
  const totalReadings = await getTotalReadings();

  return <HomePageClient locale={locale} initialReadings={totalReadings} />;
}
