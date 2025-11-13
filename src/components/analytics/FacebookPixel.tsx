'use client';

import { useEffect, useMemo, useState } from 'react';
import Script from 'next/script';
import { useConsent } from '@/hooks/useConsent';

const FB_PIXEL_ID =
  process.env.NEXT_PUBLIC_FB_PIXEL_ID || '815533441388621';

export function FacebookPixel() {
  const { ready, preferences } = useConsent();
  const [shouldRender, setShouldRender] = useState(false);

  const consentAllowsMeta = useMemo(() => {
    return preferences.marketing || preferences.advertising;
  }, [preferences.advertising, preferences.marketing]);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !FB_PIXEL_ID) {
      return;
    }

    if (ready && consentAllowsMeta) {
      setShouldRender(true);
    }
  }, [ready, consentAllowsMeta]);

  if (!shouldRender || process.env.NODE_ENV !== 'production' || !FB_PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script
        id='facebook-pixel'
        strategy='afterInteractive'
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
            fbq('init', '${FB_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1" />`,
        }}
      />
    </>
  );
}

