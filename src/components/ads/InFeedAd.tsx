'use client';

import React from 'react';
import AdSenseAd from './AdSenseAd';

interface InFeedAdProps {
  slot: string;
  className?: string;
  layoutKey?: string;
}

/**
 * InFeed Ad Component
 * Content feed içerisinde kullanılan reklam formatı
 * Kart listeleri, blog gönderileri arasında görünür
 */
export default function InFeedAd({
  slot,
  className = '',
  layoutKey,
}: InFeedAdProps) {
  return (
    <div className={`my-8 ${className}`}>
      <div className='text-center mb-2'>
        <span className='text-xs text-gray-400 uppercase tracking-wider'>
          Sponsor İçerik
        </span>
      </div>
      <AdSenseAd
        slot={slot}
        format='fluid'
        layout='in-article'
        {...(layoutKey && { layoutKey })}
        className='min-h-[200px]'
      />
    </div>
  );
}
