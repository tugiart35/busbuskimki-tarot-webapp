'use client';

import dynamic from 'next/dynamic';

export const DynamicBottomNavigation = dynamic(
  () => import('@/features/shared/layout/BottomNavigation'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-md border-t border-slate-700 animate-pulse" />
    )
  }
);

export const DynamicFooter = dynamic(
  () => import('@/features/shared/layout/Footer'),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-slate-900 animate-pulse" />
    )
  }
);

