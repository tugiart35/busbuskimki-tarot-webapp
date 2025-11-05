const withNextIntl = require('next-intl/plugin')('./src/i18n/request.ts');

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
      'next-intl', // PERFORMANCE: Tree-shaking for i18n
      '@supabase/supabase-js', // PERFORMANCE: Tree-shaking for Supabase
    ],
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
          maxInitialRequests: 25, // PERFORMANCE: Allow more parallel chunk loading
          minSize: 20000, // PERFORMANCE: Minimum chunk size (20KB)
          cacheGroups: {
            default: false,
            vendors: false,
            // PERFORMANCE: Framework chunk - React/Next.js core (highest priority)
            framework: {
              test: /[\\/]node_modules[\\/](react|react-dom|next|scheduler)[\\/]/,
              name: 'framework',
              priority: 40,
              enforce: true,
              reuseExistingChunk: true,
            },
            // PERFORMANCE: Analytics chunk - Vercel tracking
            analytics: {
              test: /[\\/]node_modules[\\/](@vercel[\\/]analytics|@vercel[\\/]speed-insights|web-vitals)[\\/]/,
              name: 'npm.analytics',
              priority: 35,
              enforce: true,
              reuseExistingChunk: true,
            },
            // PERFORMANCE: Supabase chunk - Database client
            supabase: {
              test: /[\\/]node_modules[\\/]@supabase[\\/]/,
              name: 'npm.supabase',
              priority: 30,
              enforce: true,
              reuseExistingChunk: true,
            },
            // PERFORMANCE: Icons chunk - react-icons library
            reactIcons: {
              test: /[\\/]node_modules[\\/]react-icons[\\/]/,
              name: 'npm.react-icons',
              priority: 20,
              enforce: true,
              reuseExistingChunk: true,
            },
            // CRITICAL FIX: Locale-based message splitting
            // Split each language into separate chunks for better caching and parallel loading
            messagesTr: {
              test: /[\\/]messages[\\/]tr\.json$/,
              name: 'messages-tr',
              priority: 15,
              enforce: true,
              reuseExistingChunk: true,
            },
            messagesEn: {
              test: /[\\/]messages[\\/]en\.json$/,
              name: 'messages-en',
              priority: 15,
              enforce: true,
              reuseExistingChunk: true,
            },
            messagesSr: {
              test: /[\\/]messages[\\/]sr\.json$/,
              name: 'messages-sr',
              priority: 15,
              enforce: true,
              reuseExistingChunk: true,
            },
            // PERFORMANCE: Common libraries - shared dependencies
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
              minChunks: 2, // PERFORMANCE: Must be used in at least 2 places
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
          // SECURITY FIX: HSTS (HTTP Strict Transport Security)
          // Lighthouse Best Practices improvement - forces HTTPS
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
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
