'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';
import { useConsent } from '@/hooks/useConsent';
import { applyMetaConsent } from '@/lib/consent/metaConsentBridge';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? '';
// Development'ta da test edebilmek için IS_PRODUCTION kontrolünü kaldırıyoruz
// Production'da zaten çalışacak, development'ta da test edilebilir
const ENABLE_PIXEL = FB_PIXEL_ID !== '';

// Global flag to ensure script is only loaded once
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    __metaPixelScriptLoaded?: boolean;
    __metaPixelInitialized?: boolean;
    fbq?: (..._args: unknown[]) => void;
  }
}

export function FacebookPixel() {
  const { ready, preferences } = useConsent();
  const [shouldRender, setShouldRender] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const scriptInitializedRef = useRef(false);

  const consentAllowsMeta = useMemo(() => {
    return preferences.marketing || preferences.advertising;
  }, [preferences.advertising, preferences.marketing]);

  useEffect(() => {
    if (!ENABLE_PIXEL || !FB_PIXEL_ID) {
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

  // Initialize pixel after script loads
  useEffect(() => {
    if (
      !shouldRender ||
      !isScriptLoaded ||
      scriptInitializedRef.current ||
      typeof window === 'undefined'
    ) {
      return;
    }

    // Check if already initialized globally
    if (window.__metaPixelInitialized) {
      scriptInitializedRef.current = true;
      return;
    }

    // Initialize pixel only once
    if (typeof window.fbq === 'function' && FB_PIXEL_ID) {
      try {
        window.fbq('init', FB_PIXEL_ID);
        window.__metaPixelInitialized = true;
        scriptInitializedRef.current = true;

        if (consentAllowsMeta) {
          applyMetaConsent(preferences);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Meta Pixel initialization error:', error);
      }
    }
  }, [shouldRender, isScriptLoaded, consentAllowsMeta, preferences]);

  // Only render script once, even if component remounts
  // SSR-safe check
  const shouldLoadScript =
    shouldRender &&
    (typeof window === 'undefined' || !window.__metaPixelScriptLoaded);

  // Debug logging (development only)
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.log('[FacebookPixel Debug]', {
        ENABLE_PIXEL,
        FB_PIXEL_ID: FB_PIXEL_ID ? 'SET' : 'MISSING',
        ready,
        consentAllowsMeta,
        shouldRender,
        shouldLoadScript,
        isScriptLoaded,
        scriptInitialized: scriptInitializedRef.current,
      });
    }
  }, [
    ready,
    consentAllowsMeta,
    shouldRender,
    shouldLoadScript,
    isScriptLoaded,
  ]);

  // Early return if pixel is not enabled
  if (!ENABLE_PIXEL || !FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      {shouldLoadScript ? (
        <Script
          id='facebook-pixel'
          strategy='afterInteractive'
          onLoad={() => {
            // Mark script as loaded globally
            if (typeof window !== 'undefined') {
              window.__metaPixelScriptLoaded = true;
            }
            setIsScriptLoaded(true);
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.log('[FacebookPixel] Script loaded successfully');
            }
          }}
          onError={e => {
            // eslint-disable-next-line no-console
            console.error('Meta Pixel script load error:', e);
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
