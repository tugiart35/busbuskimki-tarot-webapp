const withNextIntl = require('next-intl/plugin')('./src/lib/i18n/config.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,

  // Transpile problematic packages for Next.js 15
  transpilePackages: ['react-icons', '@supabase/supabase-js', '@supabase/ssr'],

  images: {
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // Turkish SEO-friendly URLs
      {
        source: '/tr/anasayfa',
        destination: '/tr',
      },
      {
        source: '/tr/tarot-okuma',
        destination: '/tr/tarotokumasi',
      },
      {
        source: '/tr/giris',
        destination: '/tr/auth',
      },
      {
        source: '/tr/panel',
        destination: '/tr/dashboard',
      },
      {
        source: '/tr/panel/:path*',
        destination: '/tr/dashboard/:path*',
      },

      // English SEO-friendly URLs
      {
        source: '/en/home',
        destination: '/en',
      },
      {
        source: '/en/tarot-reading',
        destination: '/en/tarotokumasi',
      },
      {
        source: '/en/numerology',
        destination: '/en/numeroloji',
      },
      {
        source: '/en/login',
        destination: '/en/auth',
      },
      {
        source: '/en/panel',
        destination: '/en/dashboard',
      },
      {
        source: '/en/panel/:path*',
        destination: '/en/dashboard/:path*',
      },

      // Serbian SEO-friendly URLs
      {
        source: '/sr/pocetna',
        destination: '/sr',
      },
      {
        source: '/sr/tarot-citanje',
        destination: '/sr/tarotokumasi',
      },
      {
        source: '/sr/numerologija',
        destination: '/sr/numeroloji',
      },
      {
        source: '/sr/prijava',
        destination: '/sr/auth',
      },
      {
        source: '/sr/panel',
        destination: '/sr/dashboard',
      },
      {
        source: '/sr/panel/:path*',
        destination: '/sr/dashboard/:path*',
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
