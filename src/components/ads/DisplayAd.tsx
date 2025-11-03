'use client';

import React from 'react';
import AdSenseAd from './AdSenseAd';

interface DisplayAdProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Display Ad Component
 * Standart display reklam formatı
 * Sidebar, header, footer gibi alanlarda kullanılır
 */
export default function DisplayAd({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  style,
}: DisplayAdProps) {
  return (
    <div className={`display-ad-wrapper ${className}`}>
      <div className='text-center mb-2'>
        <span className='text-xs text-gray-400 uppercase tracking-wider'>
          Reklam
        </span>
      </div>
      <div className='bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 p-4 rounded-lg border border-purple-200/30 dark:border-purple-800/30'>
        <AdSenseAd
          slot={slot}
          format={format}
          responsive={responsive}
          className='min-h-[250px]'
          {...(style && { style })}
        />
      </div>
    </div>
  );
}

