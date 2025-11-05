/**
 * Lighthouse Standalone Konfigürasyonu
 * Detaylı performans analizi için
 */

module.exports = {
  extends: 'lighthouse:default',
  
  settings: {
    // Rapor çıktıları
    output: ['html', 'json'],
    
    // Kategoriler
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
    
    // Ekran boyutu
    screenEmulation: {
      mobile: false,
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
      disabled: false,
    },
    
    // Throttling
    throttling: {
      rttMs: 40,
      throughputKbps: 10240,
      cpuSlowdownMultiplier: 1,
    },
    
    // Formfactor
    formFactor: 'desktop',
    
    // Ekstra HTTP başlıkları
    extraHeaders: {
      'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
    },
    
    // Kullanıcı ajanı
    emulatedUserAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    
    // Maksimum bekleme süresi
    maxWaitForFcp: 30 * 1000,
    maxWaitForLoad: 45 * 1000,
    
    // Performans budget
    budgets: [
      {
        path: '/*',
        timings: [
          { metric: 'first-contentful-paint', budget: 2000 },
          { metric: 'largest-contentful-paint', budget: 2500 },
          { metric: 'cumulative-layout-shift', budget: 0.1 },
          { metric: 'total-blocking-time', budget: 300 },
          { metric: 'speed-index', budget: 3000 },
          { metric: 'interactive', budget: 3500 },
        ],
        resourceSizes: [
          { resourceType: 'script', budget: 300 },
          { resourceType: 'image', budget: 500 },
          { resourceType: 'stylesheet', budget: 100 },
          { resourceType: 'document', budget: 50 },
          { resourceType: 'font', budget: 100 },
          { resourceType: 'total', budget: 1000 },
        ],
        resourceCounts: [
          { resourceType: 'script', budget: 15 },
          { resourceType: 'image', budget: 30 },
          { resourceType: 'stylesheet', budget: 5 },
          { resourceType: 'font', budget: 5 },
          { resourceType: 'third-party', budget: 10 },
          { resourceType: 'total', budget: 100 },
        ],
      },
    ],
  },
  
  // Özel audit'ler (opsiyonel)
  audits: [
    // Next.js spesifik audit'ler buraya eklenebilir
  ],
  
  // Kategoriler
  categories: {
    performance: {
      title: 'Performans',
      description: 'Web sitesinin yüklenme hızı ve performans metrikleri',
      auditRefs: [
        { id: 'first-contentful-paint', weight: 10 },
        { id: 'largest-contentful-paint', weight: 25 },
        { id: 'cumulative-layout-shift', weight: 15 },
        { id: 'total-blocking-time', weight: 30 },
        { id: 'speed-index', weight: 10 },
        { id: 'interactive', weight: 10 },
      ],
    },
  },
};

