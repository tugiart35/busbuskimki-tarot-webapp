/**
 * Google Tag Manager Component
 *
 * Loads GTM only after analytics or advertising consent is granted.
 */
'use client';

import { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import { useConsent } from '@/hooks/useConsent';

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || '';

export function GoogleTagManager() {
  const { ready, preferences } = useConsent();
  const [shouldRender, setShouldRender] = useState(false);

  const consentAllowsAnalytics = useMemo(() => {
    return preferences.analytics || preferences.advertising;
  }, [preferences.analytics, preferences.advertising]);

  useEffect(() => {
    if (!GTM_ID) {
      return;
    }

    if (ready && consentAllowsAnalytics) {
      setShouldRender(true);
    }
  }, [ready, consentAllowsAnalytics]);

  if (!shouldRender || !GTM_ID) {
    return null;
  }

  return (
    <Script
      id='gtm-script'
      strategy='afterInteractive'
      dangerouslySetInnerHTML={{
        __html: `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `,
      }}
    />
  );
}

export function GoogleTagManagerNoscript() {
  const GTM_ID_VALUE = process.env.NEXT_PUBLIC_GTM_ID || '';
  
  if (!GTM_ID_VALUE) {
    return null;
  }

  return (
    <noscript
      data-analytics='gtm-noscript'
      dangerouslySetInnerHTML={{
        __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID_VALUE}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
      }}
    />
  );
}


