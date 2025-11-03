'use client';

/**
 * Client-side Widget Loader
 * 
 * Bu dosya tüm client-side widget'ları dynamic import ile yükler.
 * Next.js 15'te Server Component içinde `ssr: false` kullanılamaz,
 * ancak Client Component içinde kullanılabilir.
 */

import dynamic from 'next/dynamic';

// Loading fallback component
const LoadingWidget = () => (
  <div className="w-full p-8 bg-gray-50 rounded-xl animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
);

export const DailyCardWidget = dynamic(
  () => import('@/components/shared/DailyCardWidget'),
  { 
    ssr: false,
    loading: () => <LoadingWidget />
  }
);

export const TrendingCardsWidget = dynamic(
  () => import('@/components/shared/TrendingCardsWidget'),
  { 
    ssr: false,
    loading: () => <LoadingWidget />
  }
);

export const PageReactions = dynamic(
  () => import('@/components/shared/PageReactions'),
  { 
    ssr: false,
    loading: () => <LoadingWidget />
  }
);

export const CardStatsWidget = dynamic(
  () => import('@/components/shared/CardStatsWidget'),
  { 
    ssr: false,
    loading: () => <LoadingWidget />
  }
);

export const GeneralComments = dynamic(
  () => import('@/components/shared/GeneralComments'),
  { 
    ssr: false,
    loading: () => <LoadingWidget />
  }
);

export const ExpertCommentary = dynamic(
  () => import('@/components/shared/ExpertCommentary'),
  { 
    ssr: false,
    loading: () => <LoadingWidget />
  }
);

