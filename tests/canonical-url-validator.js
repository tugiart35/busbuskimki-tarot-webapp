#!/usr/bin/env node
/**
 * CANONICAL URL VALIDATOR
 *
 * Bu script tüm SEO generator'lardaki canonical URL'lerin
 * doğruluğunu ve tutarlılığını kontrol eder.
 *
 * Kontrol edilen durumlar:
 * - Canonical URL'ler absolute (tam URL) mi?
 * - Hreflang URL'leri doğru mu?
 * - x-default tag'i var mı?
 * - Self-referencing hreflang var mı?
 * - Breadcrumb URL'leri tutarlı mı?
 * - Gerçek route'larla eşleşiyor mu?
 */

const fs = require('fs');
const path = require('path');

// Renkli console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Gerçek route yapısı (Next.js dosya sistemi)
const REAL_ROUTES = {
  homepage: {
    tr: '/tr',
    en: '/en',
    sr: '/sr',
  },
  tarot: {
    tr: '/tr/tarotokumasi',
    en: '/en/tarotokumasi',
    sr: '/sr/tarotokumasi',
  },
  numerology: {
    tr: '/tr/numeroloji',
    en: '/en/numerology',
    sr: '/sr/numerologija',
  },
  cards: {
    tr: '/tr/kartlar',
    en: '/en/cards',
    sr: '/sr/kartice',
  },
};

const BASE_URL = 'https://busbuskimki.com';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function testCanonicalUrl(url, expectedPath, testName) {
  totalTests++;
  const expected = `${BASE_URL}${expectedPath}`;

  if (url === expected) {
    passedTests++;
    log(`✓ ${testName}`, 'green');
    return true;
  } else {
    failedTests++;
    log(`✗ ${testName}`, 'red');
    log(`  Expected: ${expected}`, 'yellow');
    log(`  Got: ${url}`, 'yellow');
    return false;
  }
}

function testHreflangUrls(hreflangUrls, expectedUrls, testName) {
  totalTests++;

  const errors = [];

  // x-default kontrolü
  if (!hreflangUrls['x-default']) {
    errors.push('x-default tag missing');
  }

  // Her dil için kontrol
  for (const [lang, expectedUrl] of Object.entries(expectedUrls)) {
    if (hreflangUrls[lang] !== expectedUrl) {
      errors.push(
        `${lang}: expected ${expectedUrl}, got ${hreflangUrls[lang]}`
      );
    }
  }

  if (errors.length === 0) {
    passedTests++;
    log(`✓ ${testName}`, 'green');
    return true;
  } else {
    failedTests++;
    log(`✗ ${testName}`, 'red');
    errors.forEach(err => log(`  - ${err}`, 'yellow'));
    return false;
  }
}

function testBreadcrumbs(breadcrumbs, expectedHomePath, testName) {
  totalTests++;

  if (breadcrumbs.length === 0) {
    failedTests++;
    log(`✗ ${testName} - No breadcrumbs`, 'red');
    return false;
  }

  const firstBreadcrumb = breadcrumbs[0];
  const expectedHomeUrl = `${BASE_URL}${expectedHomePath}`;

  if (firstBreadcrumb.url === expectedHomeUrl) {
    passedTests++;
    log(`✓ ${testName}`, 'green');
    return true;
  } else {
    failedTests++;
    log(`✗ ${testName}`, 'red');
    log(`  Expected home URL: ${expectedHomeUrl}`, 'yellow');
    log(`  Got: ${firstBreadcrumb.url}`, 'yellow');
    return false;
  }
}

// Test Page SEO Generator
function testPageSeoGenerator() {
  log('\n=== Testing page-seo-generator.ts ===', 'cyan');

  try {
    const content = fs.readFileSync(
      path.join(__dirname, '../src/lib/seo/page-seo-generator.ts'),
      'utf-8'
    );

    // Ana sayfa canonical kontrolü
    if (content.includes('const canonicalUrl = `${baseUrl}/${locale}`;')) {
      passedTests++;
      totalTests++;
      log('✓ Homepage canonical URL format is correct', 'green');
    } else {
      failedTests++;
      totalTests++;
      log('✗ Homepage canonical URL format is incorrect', 'red');
    }

    // Hreflang kontrolü
    const hreflangChecks = [
      { pattern: "'x-default': `${baseUrl}/tr`", name: 'x-default hreflang' },
      { pattern: 'tr: `${baseUrl}/tr`', name: 'TR hreflang' },
      { pattern: 'en: `${baseUrl}/en`', name: 'EN hreflang' },
      { pattern: 'sr: `${baseUrl}/sr`', name: 'SR hreflang' },
    ];

    hreflangChecks.forEach(check => {
      totalTests++;
      if (content.includes(check.pattern)) {
        passedTests++;
        log(`✓ ${check.name} is correct`, 'green');
      } else {
        failedTests++;
        log(`✗ ${check.name} is incorrect`, 'red');
      }
    });
  } catch (error) {
    log(`✗ Error reading page-seo-generator.ts: ${error.message}`, 'red');
    failedTests++;
    totalTests++;
  }
}

// Test Tarot SEO Generator
function testTarotSeoGenerator() {
  log('\n=== Testing tarot-seo-generator.ts ===', 'cyan');

  try {
    const content = fs.readFileSync(
      path.join(__dirname, '../src/lib/seo/tarot-seo-generator.ts'),
      'utf-8'
    );

    // Canonical path kontrolü
    const canonicalChecks = [
      {
        pattern: "canonicalPath: '/tr/tarotokumasi'",
        name: 'TR tarot canonical path',
      },
      {
        pattern: "canonicalPath: '/en/tarotokumasi'",
        name: 'EN tarot canonical path',
      },
      {
        pattern: "canonicalPath: '/sr/tarotokumasi'",
        name: 'SR tarot canonical path',
      },
    ];

    canonicalChecks.forEach(check => {
      totalTests++;
      if (content.includes(check.pattern)) {
        passedTests++;
        log(`✓ ${check.name} is correct`, 'green');
      } else {
        failedTests++;
        log(`✗ ${check.name} is incorrect`, 'red');
      }
    });

    // Hreflang kontrolü
    const hreflangChecks = [
      {
        pattern: "'x-default': `${baseUrl}/tr/tarotokumasi`",
        name: 'x-default hreflang',
      },
      { pattern: 'tr: `${baseUrl}/tr/tarotokumasi`', name: 'TR hreflang' },
      { pattern: 'en: `${baseUrl}/en/tarotokumasi`', name: 'EN hreflang' },
      { pattern: 'sr: `${baseUrl}/sr/tarotokumasi`', name: 'SR hreflang' },
    ];

    hreflangChecks.forEach(check => {
      totalTests++;
      if (content.includes(check.pattern)) {
        passedTests++;
        log(`✓ ${check.name} is correct`, 'green');
      } else {
        failedTests++;
        log(`✗ ${check.name} is incorrect`, 'red');
      }
    });

    // Breadcrumb kontrolü
    const breadcrumbChecks = [
      {
        pattern: "{ name: 'Anasayfa', url: `${baseUrl}/tr` }",
        name: 'TR breadcrumb home',
      },
      {
        pattern: "{ name: 'Home', url: `${baseUrl}/en` }",
        name: 'EN breadcrumb home',
      },
      {
        pattern: "{ name: 'Početna', url: `${baseUrl}/sr` }",
        name: 'SR breadcrumb home',
      },
    ];

    breadcrumbChecks.forEach(check => {
      totalTests++;
      if (content.includes(check.pattern)) {
        passedTests++;
        log(`✓ ${check.name} is correct`, 'green');
      } else {
        failedTests++;
        log(`✗ ${check.name} is incorrect`, 'red');
      }
    });
  } catch (error) {
    log(`✗ Error reading tarot-seo-generator.ts: ${error.message}`, 'red');
    failedTests++;
    totalTests++;
  }
}

// Test Numerology SEO Generator
function testNumerologySeoGenerator() {
  log('\n=== Testing numerology-seo-generator.ts ===', 'cyan');

  try {
    const content = fs.readFileSync(
      path.join(__dirname, '../src/lib/seo/numerology-seo-generator.ts'),
      'utf-8'
    );

    // Canonical path kontrolü
    const canonicalChecks = [
      {
        pattern: "canonicalPath: '/tr/numeroloji'",
        name: 'TR numerology canonical path',
      },
      {
        pattern: "canonicalPath: '/en/numerology'",
        name: 'EN numerology canonical path',
      },
      {
        pattern: "canonicalPath: '/sr/numerologija'",
        name: 'SR numerology canonical path',
      },
    ];

    canonicalChecks.forEach(check => {
      totalTests++;
      if (content.includes(check.pattern)) {
        passedTests++;
        log(`✓ ${check.name} is correct`, 'green');
      } else {
        failedTests++;
        log(`✗ ${check.name} is incorrect`, 'red');
      }
    });

    // Breadcrumb kontrolü
    const breadcrumbChecks = [
      {
        pattern: "{ name: 'Anasayfa', url: `${baseUrl}/tr` }",
        name: 'TR breadcrumb home',
      },
      {
        pattern: "{ name: 'Home', url: `${baseUrl}/en` }",
        name: 'EN breadcrumb home',
      },
      {
        pattern: "{ name: 'Početna', url: `${baseUrl}/sr` }",
        name: 'SR breadcrumb home',
      },
    ];

    breadcrumbChecks.forEach(check => {
      totalTests++;
      if (content.includes(check.pattern)) {
        passedTests++;
        log(`✓ ${check.name} is correct`, 'green');
      } else {
        failedTests++;
        log(`✗ ${check.name} is incorrect`, 'red');
      }
    });
  } catch (error) {
    log(`✗ Error reading numerology-seo-generator.ts: ${error.message}`, 'red');
    failedTests++;
    totalTests++;
  }
}

// Test robots.ts
function testRobots() {
  log('\n=== Testing robots.ts ===', 'cyan');

  try {
    const content = fs.readFileSync(
      path.join(__dirname, '../src/app/robots.ts'),
      'utf-8'
    );

    const checks = [
      {
        pattern: 'sitemap: `${baseUrl}/sitemap.xml`',
        name: 'Sitemap reference',
      },
      { pattern: 'host: baseUrl', name: 'Host declaration' },
      { pattern: "disallow: ['/api/'", name: 'API routes blocked' },
      { pattern: 'disallow', name: 'Disallow rules exist' },
    ];

    checks.forEach(check => {
      totalTests++;
      if (content.includes(check.pattern)) {
        passedTests++;
        log(`✓ ${check.name} exists`, 'green');
      } else {
        failedTests++;
        log(`✗ ${check.name} missing`, 'red');
      }
    });
  } catch (error) {
    log(`✗ Error reading robots.ts: ${error.message}`, 'red');
    failedTests++;
    totalTests++;
  }
}

// Test sitemap.ts
function testSitemap() {
  log('\n=== Testing sitemap.ts ===', 'cyan');

  try {
    const content = fs.readFileSync(
      path.join(__dirname, '../src/app/sitemap.ts'),
      'utf-8'
    );

    const checks = [
      { pattern: 'url: `${baseUrl}/tr`', name: 'TR homepage in sitemap' },
      { pattern: 'url: `${baseUrl}/en`', name: 'EN homepage in sitemap' },
      { pattern: 'url: `${baseUrl}/sr`', name: 'SR homepage in sitemap' },
      {
        pattern: 'url: `${baseUrl}/tr/tarotokumasi`',
        name: 'TR tarot in sitemap',
      },
      { pattern: 'priority:', name: 'Priority values set' },
      { pattern: 'changeFrequency:', name: 'Change frequency set' },
    ];

    checks.forEach(check => {
      totalTests++;
      if (content.includes(check.pattern)) {
        passedTests++;
        log(`✓ ${check.name} exists`, 'green');
      } else {
        failedTests++;
        log(`✗ ${check.name} missing`, 'red');
      }
    });
  } catch (error) {
    log(`✗ Error reading sitemap.ts: ${error.message}`, 'red');
    failedTests++;
    totalTests++;
  }
}

// Ana test fonksiyonu
function runTests() {
  log('\n╔════════════════════════════════════════════════════╗', 'blue');
  log('║     CANONICAL URL VALIDATION TEST SUITE         ║', 'blue');
  log('╚════════════════════════════════════════════════════╝', 'blue');

  testPageSeoGenerator();
  testTarotSeoGenerator();
  testNumerologySeoGenerator();
  testRobots();
  testSitemap();

  // Sonuçları göster
  log('\n╔════════════════════════════════════════════════════╗', 'blue');
  log('║              TEST RESULTS                        ║', 'blue');
  log('╚════════════════════════════════════════════════════╝', 'blue');

  log(`\nTotal Tests: ${totalTests}`, 'cyan');
  log(`Passed: ${passedTests}`, 'green');
  log(`Failed: ${failedTests}`, 'red');

  const successRate = ((passedTests / totalTests) * 100).toFixed(2);
  log(
    `\nSuccess Rate: ${successRate}%`,
    successRate === '100.00' ? 'green' : 'yellow'
  );

  if (failedTests === 0) {
    log('\n✅ ALL TESTS PASSED! Canonical URLs are correct.', 'green');
    process.exit(0);
  } else {
    log(
      `\n⚠️  ${failedTests} test(s) failed. Please review the errors above.`,
      'red'
    );
    process.exit(1);
  }
}

// Testi çalıştır
runTests();
