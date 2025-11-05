/**
 * Lighthouse CI Konfigürasyonu
 * TaraTarot - Kapsamlı Web Performans, SEO ve Erişilebilirlik Denetimi
 */

module.exports = {
  ci: {
    collect: {
      // Test edilecek sayfalar
      url: [
        'http://localhost:3000',
        'http://localhost:3000/tr',
        'http://localhost:3000/tr/tarot/love-spread',
        'http://localhost:3000/tr/tarot/career-spread',
        'http://localhost:3000/tr/tarot/daily-card',
        'http://localhost:3000/tr/about',
        'http://localhost:3000/tr/numerology',
        'http://localhost:3000/tr/dashboard',
      ],
      // Her URL için 3 kez test (tutarlılık için)
      numberOfRuns: 3,
      // Headless Chrome ayarları
      settings: {
        preset: 'desktop',
        // Mobil test için de ayar eklenebilir
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        // Performans throttling
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 1,
        },
        // Ekran ayarları
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
      // Rapor formatları
      startServerCommand: 'npm run build && npm run start',
      startServerReadyPattern: 'Ready on',
      startServerReadyTimeout: 60000,
    },
    assert: {
      // Performans eşikleri
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:pwa': ['warn', { minScore: 0.8 }],
        
        // Core Web Vitals
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3000 }],
        
        // Erişilebilirlik
        'color-contrast': 'error',
        'html-has-lang': 'error',
        'meta-viewport': 'error',
        'document-title': 'error',
        'aria-allowed-attr': 'error',
        'aria-required-attr': 'error',
        'button-name': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        
        // SEO
        'meta-description': 'error',
        'link-text': 'warn',
        'is-crawlable': 'error',
        'robots-txt': 'warn',
        'canonical': 'error',
        'hreflang': 'warn',
        
        // Best Practices
        'uses-https': 'error',
        'uses-http2': 'warn',
        'no-vulnerable-libraries': 'error',
        'errors-in-console': 'warn',
        'valid-source-maps': 'warn',
        
        // Performans
        'uses-text-compression': 'warn',
        'uses-responsive-images': 'warn',
        'offscreen-images': 'warn',
        'render-blocking-resources': 'warn',
        'unminified-css': 'error',
        'unminified-javascript': 'error',
        'unused-css-rules': 'warn',
        'unused-javascript': 'warn',
        'modern-image-formats': 'warn',
        'uses-optimized-images': 'warn',
        'uses-rel-preconnect': 'warn',
        'uses-rel-preload': 'warn',
        'font-display': 'warn',
        'prioritize-lcp-image': 'warn',
      },
    },
    upload: {
      // Raporları saklamak için
      target: 'temporary-public-storage',
      // Alternatif: GitHub'a yükle
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: process.env.LHCI_TOKEN,
    },
    server: {},
    wizard: {},
  },
};

