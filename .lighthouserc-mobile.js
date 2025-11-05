/**
 * Lighthouse CI - Mobile Konfigürasyonu
 * TaraTarot - Mobil Cihazlar için Optimizasyon Denetimi
 */

module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000',
        'http://localhost:3000/tr',
        'http://localhost:3000/tr/tarot/love-spread',
        'http://localhost:3000/tr/tarot/career-spread',
        'http://localhost:3000/tr/tarot/daily-card',
      ],
      numberOfRuns: 3,
      settings: {
        preset: 'mobile', // Mobil preset
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        // Mobil throttling (4G)
        throttling: {
          rttMs: 150,
          throughputKbps: 1.6 * 1024,
          requestLatencyMs: 150,
          downloadThroughputKbps: 1.6 * 1024,
          uploadThroughputKbps: 750,
          cpuSlowdownMultiplier: 4,
        },
        // Mobil ekran ayarları
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false,
        },
        formFactor: 'mobile',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
      },
      startServerCommand: 'npm run build && npm run start',
      startServerReadyPattern: 'Ready on',
      startServerReadyTimeout: 60000,
    },
    assert: {
      assertions: {
        // Mobil için daha esnek eşikler
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:pwa': ['warn', { minScore: 0.85 }],
        
        // Mobil Core Web Vitals (daha sıkı)
        'first-contentful-paint': ['warn', { maxNumericValue: 2500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 3500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 500 }],
        'speed-index': ['warn', { maxNumericValue: 4000 }],
        'interactive': ['warn', { maxNumericValue: 5000 }],
        
        // PWA özellikleri
        'installable-manifest': 'warn',
        'splash-screen': 'warn',
        'themed-omnibox': 'warn',
        'viewport': 'error',
        'content-width': 'error',
        'apple-touch-icon': 'warn',
        'maskable-icon': 'warn',
        'service-worker': 'warn',
        'offline-start-url': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};

