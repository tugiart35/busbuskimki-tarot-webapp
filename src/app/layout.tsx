/*
info:
Bağlantılı dosyalar:
- ./globals.css: Tüm uygulama genelinde geçerli stiller için (gerekli)
- ../config/metadata.ts: Metadata ve viewport ayarları için (gerekli)
- ../lib/i18n/config.ts: i18n yapılandırması için (gerekli)
- ../components/layout/HeadTags.tsx: HTML head etiketlerini yönetmek için (gerekli)
- ../components/layout/Footer.tsx: Alt bilgi bileşeni için (gerekli)

Dosyanın amacı:
- Next.js projesi için zorunlu olan kök layout'u sağlamak.
- Global metadata ve viewport ayarlarını dışa aktarmak.
- i18n desteği ile locale routing sağlamak.
- Tüm sayfa ve bileşenleri ortak layout yapısı ile sarmalamak.

Güncellemeler:
- i18n desteği eklendi
- Locale routing için yapılandırma
- Metadata güncellemeleri
*/

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import './globals.css';

// Modüler dosyalardan import'lar
import { defaultMetadata, viewport } from '@/lib/config/metadata';
import { APP_CONFIG } from '@/lib/config/app-config';
import { HeadTags, Footer } from '@/features/shared/layout';
import { defaultLocale } from '@/lib/i18n/config';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

// Analytics components - lazy load for better performance
// Named exports için .then() ile extract edelim
const WebVitals = dynamic(() =>
  import('@/components/WebVitals').then(mod => mod.WebVitals)
);

const GoogleAnalytics = dynamic(() =>
  import('@/components/analytics/GoogleAnalytics').then(
    mod => mod.GoogleAnalytics
  )
);

// Optimize font loading with display swap and preload
const inter = Inter({
  subsets: ['latin', 'latin-ext'], // Turkish characters support
  display: 'swap', // Prevent invisible text (FOIT)
  preload: true,
  variable: '--font-inter',
  fallback: [
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'arial',
  ],
  adjustFontFallback: true, // Automatic font metric adjustments
  weight: ['400', '500', '600', '700'], // Only load needed weights
});

// Next.js için metadata export'u
export const metadata = defaultMetadata;

// Next.js 14 için viewport export'u
export { viewport };

// Ana layout fonksiyonu
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang={defaultLocale}
      className={`h-full ${inter.className}`}
      data-scroll-behavior='smooth'
    >
      <head>
        <HeadTags />

        {/* Google Site Verification */}
        <meta
          name='google-site-verification'
          content='9jC0OHEYEMjbGS1yL65eyZ-QRAN_uPHn0lRvxtdK9GU'
        />

        {/* Bing Site Verification */}
        <meta
          name='msvalidate.01'
          content={process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || ''}
        />

        {/* Google AdSense - YENİ KOD */}
        <script
          async
          defer
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1429338163231803'
          crossOrigin='anonymous'
        />

        {/* Performance Optimization: Preconnect (daha hızlı DNS + TLS) */}
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        <link rel='preconnect' href='https://www.google-analytics.com' />
        <link rel='preconnect' href='https://pagead2.googlesyndication.com' />
        <link rel='dns-prefetch' href='//connect.facebook.net' />

        {/* Preload critical assets */}
        <link
          rel='preload'
          href='/icons/icon.svg'
          as='image'
          type='image/svg+xml'
        />
        <link rel='preload' href='/favicon.ico' as='image' />
      </head>
      <body
        className='h-full overflow-x-hidden antialiased'
        style={{ backgroundColor: APP_CONFIG.theme.backgroundColor }}
      >
        <GoogleAnalytics />
        <WebVitals />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
