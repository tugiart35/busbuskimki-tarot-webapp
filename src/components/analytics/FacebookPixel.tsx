'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useConsent } from '@/hooks/useConsent';
import { applyMetaConsent } from '@/lib/consent/metaConsentBridge';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? '';
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export function FacebookPixel() {
  const { ready, preferences } = useConsent();
  const [shouldRender, setShouldRender] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  const consentAllowsMeta = useMemo(() => {
    return preferences.marketing || preferences.advertising;
  }, [preferences.advertising, preferences.marketing]);

  useEffect(() => {
    if (!IS_PRODUCTION || !FB_PIXEL_ID) {
      setShouldRender(false);
      return;
    }

    if (!ready) {
      return;
    }

    if (consentAllowsMeta) {
      setShouldRender(true);
    } else {
      setShouldRender(false);
      setIsScriptLoaded(false);
      lastTrackedPath.current = null;
    }
  }, [ready, consentAllowsMeta]);

  useEffect(() => {
    if (!shouldRender || !isScriptLoaded || !pathname) {
      return;
    }

    if (lastTrackedPath.current === pathname) {
      return;
    }

    if (typeof window === 'undefined' || typeof window.fbq !== 'function') {
      return;
    }

    window.fbq('track', 'PageView');
    lastTrackedPath.current = pathname;
  }, [pathname, shouldRender, isScriptLoaded]);

  if (!IS_PRODUCTION || !FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      {shouldRender ? (
        <Script
          id='facebook-pixel'
          strategy='afterInteractive'
          onLoad={() => {
            setIsScriptLoaded(true);
            if (consentAllowsMeta) {
              applyMetaConsent(preferences);
            }
          }}
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f.fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              (function(){
                const w = window;
                if (!w.__metaPixelInitialized && typeof w.fbq === 'function') {
                  w.fbq('init', '${FB_PIXEL_ID}');
                  w.__metaPixelInitialized = true;
                }
              })();
            `,
          }}
        />
      ) : null}
      <noscript
        data-analytics='meta-pixel'
        dangerouslySetInnerHTML={{
          __html: FB_PIXEL_ID
            ? `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1" />`
            : '',
        }}
      />
    </>
  );
}
