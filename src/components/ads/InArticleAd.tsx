'use client';

import React from 'react';
import AdSenseAd from './AdSenseAd';

interface InArticleAdProps {
  slot: string;
  className?: string;
}

/**
 * InArticle Ad Component
 * Makale/içerik içerisinde kullanılan reklam formatı
 * Kart açıklamaları, tarot yorumları arasında görünür
 */
export default function InArticleAd({
  slot,
  className = '',
}: InArticleAdProps) {
  return (
    <div className={`my-12 ${className}`}>
      {/* Separator */}
      <div className='flex items-center gap-4 mb-6'>
        <div className='flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent'></div>
        <span className='text-xs text-purple-400 uppercase tracking-wider px-3'>
          Advertisement
        </span>
        <div className='flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent'></div>
      </div>

      <AdSenseAd
        slot={slot}
        format='fluid'
        responsive={true}
        className='min-h-[250px]'
      />

      {/* Separator */}
      <div className='mt-6 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent'></div>
    </div>
  );
}
