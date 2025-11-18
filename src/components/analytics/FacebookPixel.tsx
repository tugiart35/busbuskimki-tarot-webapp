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
    __metaPixelScriptElement?: HTMLScriptElement | null;
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
  const initAttemptedRef = useRef(false);

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

  // Initialize pixel after script loads - CRITICAL for Conversions API deduplication
  useEffect(() => {
    if (
      !shouldRender ||
      !isScriptLoaded ||
      scriptInitializedRef.current ||
      initAttemptedRef.current ||
      typeof window === 'undefined'
    ) {
      return;
    }

    // Check if already initialized globally (prevent duplicate init)
    if (window.__metaPixelInitialized) {
      scriptInitializedRef.current = true;
      return;
    }

    // Double-check fbq is available and not already initialized
    if (typeof window.fbq === 'function' && FB_PIXEL_ID) {
      initAttemptedRef.current = true;
      
      try {
        // Only init if not already initialized (extra safety check)
        if (!window.__metaPixelInitialized) {
          window.fbq('init', FB_PIXEL_ID);
          window.__metaPixelInitialized = true;
          scriptInitializedRef.current = true;

          if (consentAllowsMeta) {
            applyMetaConsent(preferences);
          }

          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('[FacebookPixel] Pixel initialized successfully for Conversions API');
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Meta Pixel initialization error:', error);
        initAttemptedRef.current = false; // Allow retry on error
      }
    }
  }, [shouldRender, isScriptLoaded, consentAllowsMeta, preferences]);

  // Only render script once, even if component remounts (React Strict Mode protection)
  // SSR-safe check with DOM verification and global flag
  // This must check on every render to catch React Strict Mode double mounts
  const shouldLoadScript = useMemo(() => {
    if (!shouldRender) {
      return false;
    }

    // SSR check
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }

    // CRITICAL: Check global flag first (fastest check)
    if (window.__metaPixelScriptLoaded === true) {
      return false;
    }

    // Check if fbevents.js script is already loaded in DOM
    const existingScript = document.querySelector(
      'script[src*="fbevents.js"], script[id="facebook-pixel"]'
    );
    
    if (existingScript !== null) {
      return false;
    }

    // Check if fbq function already exists (script loaded but maybe not via our component)
    if (typeof window.fbq === 'function') {
      return false;
    }

    return true;
  }, [shouldRender]); // Re-check when shouldRender changes

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
        scriptInDOM: typeof window !== 'undefined' && typeof document !== 'undefined' 
          ? document.querySelector('script[src*="fbevents.js"], script[id="facebook-pixel"]') !== null
          : false,
        fbqExists: typeof window !== 'undefined' && typeof window.fbq === 'function',
        globalFlag: typeof window !== 'undefined' ? window.__metaPixelScriptLoaded : false,
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
            // CRITICAL: Mark script as loaded globally IMMEDIATELY to prevent duplicate loads
            // This must happen before any async operations
            if (typeof window !== 'undefined') {
              // Double-check we're not already loaded (React Strict Mode protection)
              if (window.__metaPixelScriptLoaded) {
                if (process.env.NODE_ENV === 'development') {
                  // eslint-disable-next-line no-console
                  console.warn('[FacebookPixel] Script already loaded, skipping duplicate load');
                }
                return;
              }

              // Set flag IMMEDIATELY to prevent duplicate loads
              window.__metaPixelScriptLoaded = true;
              
              // Store reference to script element for cleanup if needed
              const scriptElement = document.getElementById('facebook-pixel') as HTMLScriptElement;
              if (scriptElement) {
                window.__metaPixelScriptElement = scriptElement;
              }

              // Prevent duplicate initialization - initialize immediately after script loads
              // This is critical for Conversions API deduplication
              if (!window.__metaPixelInitialized && typeof window.fbq === 'function' && FB_PIXEL_ID) {
                try {
                  window.fbq('init', FB_PIXEL_ID);
                  window.__metaPixelInitialized = true;
                  scriptInitializedRef.current = true;
                  
                  if (consentAllowsMeta) {
                    applyMetaConsent(preferences);
                  }

                  if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('[FacebookPixel] Script loaded and initialized for Conversions API');
                  }
                } catch (error) {
                  // eslint-disable-next-line no-console
                  console.error('Meta Pixel initialization error in onLoad:', error);
                }
              }
            }
            setIsScriptLoaded(true);
          }}
          onError={e => {
            // eslint-disable-next-line no-console
            console.error('Meta Pixel script load error:', e);
            // Reset flag on error to allow retry
            if (typeof window !== 'undefined') {
              window.__metaPixelScriptLoaded = false;
            }
          }}
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              if(s&&s.parentNode){s.parentNode.insertBefore(t,s);}
              else{if(document.body){document.body.appendChild(t);}}}(window, document,'script',
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
