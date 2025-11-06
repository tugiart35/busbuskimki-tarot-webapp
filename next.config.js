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

  // Source maps for better debugging and Lighthouse analysis
  productionBrowserSourceMaps: true,

  // Transpile problematic packages for Next.js 15
  transpilePackages: ['react-icons', '@supabase/supabase-js', '@supabase/ssr'],

  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60 * 60 * 24 * 365, // 1 year cache
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression
  compress: true,

  // Experimental features for performance
  experimental: {
    optimizePackageImports: [
      '@heroicons/react',
      'lucide-react',
      'react-icons',
      'framer-motion',
      'recharts', // Chart library optimization
      '@supabase/supabase-js', // Supabase optimization
      'react-hook-form', // Form library optimization
    ],

    // CSS optimization (Next.js 15 experimental)
    optimizeCss: true,

    // Server component HMR cache (development speed)
    serverComponentsHmrCache: true,
  },

  // Webpack configuration for large bundles
  webpack: (config, { isServer }) => {
    // Increase chunk size limits for large message files
    config.performance = {
      ...config.performance,
      maxAssetSize: 10000000, // 10MB (tr.json is very large)
      maxEntrypointSize: 10000000, // 10MB
    };

    // Optimize chunks for better loading
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Separate translation files per locale into their own chunks
            // Her dil (tr, en, sr) ayrı chunk olacak
            messages: {
              test: /[\\/]messages[\\/].*\.json$/,
              name(module) {
                // messages/tr.json -> i18n-tr
                const match = module.resource.match(/messages[\\/](.*)\.json$/);
                if (match) {
                  const locale = match[1]; // tr, en, or sr
                  return `i18n-${locale}`;
                }
                return 'i18n-common';
              },
              priority: 10,
              reuseExistingChunk: true,
            },
            // Common libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                // Safely extract package name from node_modules path
                if (!module.context) return 'npm.common';
                
                const match = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                );
                
                if (!match || !match[1]) return 'npm.common';
                
                const packageName = match[1].replace('@', '');
                return `npm.${packageName}`;
              },
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  async headers() {
    const headers = [
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
      // ... existing cache headers ...
    ];
  
    // Production ortamında indexing'e açıkça izin ver
    // Vercel'in preview deployment'larda otomatik noindex eklemesini override et
    if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production') {
      headers[0].headers.push({
        key: 'X-Robots-Tag',
        value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      });
    }
  
    return headers;
  },

  async rewrites() {
    return [
      // Turkish SEO-friendly URLs
      // SEO Fix: Removed /tr/anasayfa rewrite to avoid redirect chains
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
      // SEO Fix: Removed /en/home rewrite to avoid redirect chains
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
      // SEO Fix: Removed /sr/pocetna rewrite to avoid redirect chains
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
