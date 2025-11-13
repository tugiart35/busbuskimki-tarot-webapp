/**
 * Google Analytics Component
 *
 * Loads gtag.js only after analytics or advertising consent is granted.
 */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import { useConsent } from '@/hooks/useConsent';

const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-HYE4L3NKCL';

export function GoogleAnalytics() {
  const { ready, preferences } = useConsent();
  const [shouldRender, setShouldRender] = useState(false);

  const consentAllowsAnalytics = useMemo(() => {
    return preferences.analytics || preferences.advertising;
  }, [preferences.analytics, preferences.advertising]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (ready && consentAllowsAnalytics) {
      setShouldRender(true);
    }
  }, [ready, consentAllowsAnalytics]);

  if (!shouldRender || process.env.NODE_ENV !== 'production') {
    return null;
  }

  return (
    <>
      <Script
        id='ga-script'
        strategy='afterInteractive'
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id='ga-init'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
}
