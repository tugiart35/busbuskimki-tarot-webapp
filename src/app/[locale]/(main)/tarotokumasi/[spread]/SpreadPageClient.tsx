/*
 * Spread Page Client Component
 * Client-side rendering for spread interaction
 */

'use client';

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { tarotSpreads } from '@/lib/constants/tarotSpreads';
import { BottomNavigation } from '@/features/shared/layout';
import { useTranslations } from '@/hooks/useTranslations';

interface SpreadPageClientProps {
  spreadId: string;
  locale: string;
}

export default function SpreadPageClient({ spreadId, locale }: SpreadPageClientProps) {
  const { t } = useTranslations();
  
  // Find the current spread
  const currentSpread = tarotSpreads.find(s => s.id === spreadId);
  if (!currentSpread) notFound();
  
  const CurrentComponent = currentSpread.component;
  if (!CurrentComponent) notFound();

  // Get other spreads (exclude current)
  const otherSpreads = tarotSpreads.filter(s => s.id !== spreadId);

  return (
    <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      <main className='flex-1 px-6 py-8'>
        {/* Breadcrumb Navigation - SEO Enhancement */}
        <nav className='mb-6 text-sm' aria-label='Breadcrumb'>
          <ol className='flex items-center space-x-2'>
            <li>
              <Link 
                href={`/${locale}/tarotokumasi`} 
                className='text-gray-400 hover:text-purple-400 transition-colors'
              >
                {t('tarot.allSpreads')}
              </Link>
            </li>
            <li>
              <span className='text-gray-600'>/</span>
            </li>
            <li>
              <span className='text-purple-400 font-medium'>
                {t(currentSpread.name)}
              </span>
            </li>
          </ol>
        </nav>

        {/* Main Spread Component - Reused from existing components */}
        <div className='mb-12'>
          <Suspense 
            fallback={
              <div className='flex items-center justify-center py-12'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500'></div>
                <span className='ml-3 text-gray-400'>
                  {t('tarot.page.loadingSpread')}
                </span>
              </div>
            }
          >
            <CurrentComponent 
              onComplete={() => {}} 
              onReadingTypeSelected={() => {}} 
            />
          </Suspense>
        </div>

        {/* Related Spreads Section - Internal Linking for SEO */}
        <section className='mt-12 border-t border-slate-700 pt-8'>
          <h2 className='text-2xl font-bold text-white mb-6'>
            {t('tarot.otherSpreads')}
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {otherSpreads.map(spread => (
              <Link
                key={spread.id}
                href={`/${locale}/tarotokumasi/${spread.id}`}
                className='group p-4 bg-slate-800/50 rounded-lg hover:bg-slate-700/70 transition-all duration-200 border border-slate-700 hover:border-purple-500'
              >
                <div className='text-4xl mb-3 group-hover:scale-110 transition-transform duration-200'>
                  {spread.icon}
                </div>
                <h3 className='text-white font-medium text-sm group-hover:text-purple-400 transition-colors'>
                  {t(spread.name)}
                </h3>
                <p className='text-gray-500 text-xs mt-1 line-clamp-2'>
                  {t(spread.description)}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Back to All Spreads Link */}
        <div className='mt-8 text-center'>
          <Link
            href={`/${locale}/tarotokumasi`}
            className='inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors'
          >
            <svg 
              className='w-4 h-4 mr-2' 
              fill='none' 
              stroke='currentColor' 
              viewBox='0 0 24 24'
            >
              <path 
                strokeLinecap='round' 
                strokeLinejoin='round' 
                strokeWidth={2} 
                d='M10 19l-7-7m0 0l7-7m-7 7h18' 
              />
            </svg>
            {t('tarot.backToAllSpreads')}
          </Link>
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}

