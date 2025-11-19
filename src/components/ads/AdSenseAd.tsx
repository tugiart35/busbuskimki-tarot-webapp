'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  hasAdSenseConsent,
  loadAdSenseAd,
  trackAdError,
  trackAdPerformance,
  canRenderAd,
  ADSENSE_CLIENT_ID,
} from '@/lib/adsense/adsense-manager';

interface AdSenseAdProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
  layout?: string;
  layoutKey?: string;
}

export default function AdSenseAd({
  slot,
  format = 'auto',
  responsive = true,
  style,
  className = '',
  layout,
  layoutKey,
}: AdSenseAdProps) {
  // AdSense deaktif kontrolü - tekrar aktif etmek için NEXT_PUBLIC_ADSENSE_ENABLED=true yapın
  if (process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'false') {
    return null;
  }

  const adRef = useRef<HTMLModElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  useEffect(() => {
    // Check consent
    const consent = hasAdSenseConsent();
    setHasConsent(consent);

    if (!consent) {
      console.log('AdSense ad skipped: no consent');
      return;
    }

    // Validate environment
    if (!canRenderAd()) {
      return;
    }

    // Load ad after a small delay for better UX
    const timer = setTimeout(() => {
      if (adRef.current) {
        try {
          loadAdSenseAd(adRef.current);
          setAdLoaded(true);
          trackAdPerformance(slot, 'impression');
          setShowPlaceholder(false);
        } catch (error) {
          console.error('Error loading AdSense ad:', error);
          trackAdError('render_failed', error, slot);
        }
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [slot]);

  // Don't render if no consent
  if (!hasConsent) {
    return (
      <div className='p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center'>
        <p className='text-sm text-gray-600 dark:text-gray-400'>
          🔒 Reklamları görmek için çerez tercihlerinizi güncelleyin
        </p>
      </div>
    );
  }

  // Don't render in invalid environment
  if (!canRenderAd()) {
    return null;
  }

  return (
    <div className={`adsense-ad-container relative ${className}`} style={style}>
      {/* Loading placeholder */}
      {showPlaceholder && (
        <div className='absolute inset-0 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg flex items-center justify-center'>
          <div className='text-center'>
            <div className='w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2'></div>
            <p className='text-xs text-gray-500'>Reklam yükleniyor...</p>
          </div>
        </div>
      )}

      {/* AdSense Ad */}
      <ins
        ref={adRef}
        className='adsbygoogle'
        style={{
          display: 'block',
          ...style,
        }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
        {...(layout && { 'data-ad-layout': layout })}
        {...(layoutKey && { 'data-ad-layout-key': layoutKey })}
      ></ins>

      {/* Error fallback (will be shown if ad fails to load) */}
      {adLoaded && (
        <div className='ad-fallback hidden'>
          <p className='text-xs text-gray-400 text-center py-4'>
            Reklam yüklenemedi
          </p>
        </div>
      )}
    </div>
  );
}
