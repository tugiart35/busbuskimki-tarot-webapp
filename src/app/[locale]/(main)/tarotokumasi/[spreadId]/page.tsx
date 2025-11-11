import { tarotSpreads } from '@/lib/constants/tarotSpreads';
import { getAllSpreadIds } from '@/lib/seo/spread-seo-generator';
import SpreadPageClient from './SpreadPageClient';

// ISR Configuration for optimal performance
export const revalidate = 3600; // 1 hour cache
export const dynamic = 'force-static'; // Full static generation
export const dynamicParams = true; // Allow dynamic params for hidden spreads (admin-only links)

/**
 * Generate static params for all tarot spreads
 * Hidden spreads are included for admin-only link access
 */
export async function generateStaticParams() {
  // getAllSpreadIds() hidden spread'leri filtreler, ama biz hidden spread'leri de dahil etmeliyiz
  // çünkü admin link üzerinden erişilebilir olmalılar
  const visibleSpreadIds = getAllSpreadIds();
  const allSpreadIds = tarotSpreads.map(spread => spread.id);
  
  // Hem visible hem hidden spread'leri dahil et
  const allIds = [...new Set([...visibleSpreadIds, ...allSpreadIds])];
  
  return allIds.map(spreadId => ({
    spreadId,
  }));
}

/**
 * Individual Tarot Spread Page
 * SEO-optimized dynamic route for each spread type
 */
export default async function SpreadPage({
  params,
}: {
  params: Promise<{ locale: string; spreadId: string }>;
}) {
  const { locale, spreadId } = await params;

  // Verify spread exists
  const spread = tarotSpreads.find(s => s.id === spreadId);

  if (!spread) {
    return (
      <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <main className='flex-1 px-6 py-8'>
          <div className='max-w-4xl mx-auto text-center py-20'>
            <div className='text-8xl mb-6'>🔮</div>
            <h1 className='text-3xl font-bold text-white mb-4'>
              Tarot Açılımı Bulunamadı
            </h1>
            <p className='text-gray-400 mb-8'>
              Aradığınız tarot açılımı bulunamadı.
            </p>
          </div>
        </main>
      </div>
    );
  }

  return <SpreadPageClient locale={locale} spreadId={spreadId} />;
}
