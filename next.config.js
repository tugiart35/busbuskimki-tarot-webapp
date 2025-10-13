const withNextIntl = require('next-intl/plugin')('./src/lib/i18n/config.ts');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable standalone output for Docker deployment
  output: 'standalone',

  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Compression and performance
  compress: true,
  productionBrowserSourceMaps: false,

  // Headers for caching and compression
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
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
    ];
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Framework chunk (react, react-dom)
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // Commons chunk
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            // Lib chunk for large libraries
            lib: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )?.[1];
                return `npm.${packageName?.replace('@', '')}`;
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },
};

module.exports = withBundleAnalyzer(withNextIntl(nextConfig));
