#!/usr/bin/env node

/**
 * Gelişmiş Çeviri Eksiklikleri Tespit Scripti
 *
 * Bu script:
 * 1. Kaynak koddaki t() ve useTranslation() çağrılarını bulur
 * 2. Namespace'leri dikkate alarak doğru anahtarları tespit eder
 * 3. JSON dosyalarındaki mevcut anahtarları listeler
 * 4. Eksik çeviri anahtarlarını tespit eder
 * 5. Hardcoded Türkçe metinleri bulur
 */

const fs = require('fs');
const path = require('path');

// Konfigürasyon
const CONFIG = {
  srcDir: './src',
  messagesDir: './messages',
  locales: ['tr', 'en', 'sr'],
  excludeDirs: ['node_modules', '.next', 'dist', 'build'],
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
};

// Çeviri pattern'leri
const TRANSLATION_PATTERNS = {
  // t('key') veya t("key")
  tCall: /\bt\s*\(\s*['"]([^'"]+)['"]/g,
  // useTranslations('namespace') - client component
  useTranslations: /useTranslations\s*\(\s*['"]([^'"]+)['"]/g,
  // getTranslations({ locale, namespace: 'x' }) - server component
  getTranslationsNamespace:
    /getTranslations\s*\(\s*\{[^}]*namespace:\s*['"]([^'"]+)['"]/g,
  // const t = await getTranslations('namespace')
  getTranslationsSimple: /getTranslations\s*\(\s*['"]([^'"]+)['"]/g,
};

// Hardcoded Türkçe metin pattern'leri
const TURKISH_TEXT_PATTERNS = [
  // JSX içindeki Türkçe karakterler
  />([^<]*[çÇğĞıİöÖşŞüÜ][^<]*)</g,
  // String literal'larda Türkçe
  /['"`]([^'"`]*[çÇğĞıİöÖşŞüÜ][^'"`]*)['"`]/g,
];

// Yardımcı fonksiyonlar
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!CONFIG.excludeDirs.includes(file)) {
        getAllFiles(filePath, fileList);
      }
    } else {
      const ext = path.extname(file);
      if (CONFIG.extensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

function extractNamespaces(content) {
  const namespaces = new Set();

  // useTranslations('namespace') pattern
  let match;
  const useTransPattern = TRANSLATION_PATTERNS.useTranslations;
  useTransPattern.lastIndex = 0;
  while ((match = useTransPattern.exec(content)) !== null) {
    namespaces.add(match[1]);
  }

  // getTranslations({ namespace: 'x' }) pattern
  const getTransNsPattern = TRANSLATION_PATTERNS.getTranslationsNamespace;
  getTransNsPattern.lastIndex = 0;
  while ((match = getTransNsPattern.exec(content)) !== null) {
    namespaces.add(match[1]);
  }

  // getTranslations('namespace') pattern
  const getTransSimplePattern = TRANSLATION_PATTERNS.getTranslationsSimple;
  getTransSimplePattern.lastIndex = 0;
  while ((match = getTransSimplePattern.exec(content)) !== null) {
    namespaces.add(match[1]);
  }

  return Array.from(namespaces);
}

function extractTranslationKeys(content, filePath) {
  const keys = new Set();
  const namespaces = extractNamespaces(content);

  // t('key') çağrılarını bul
  let match;
  const tCallPattern = TRANSLATION_PATTERNS.tCall;
  tCallPattern.lastIndex = 0;

  while ((match = tCallPattern.exec(content)) !== null) {
    let key = match[1];

    // Template literal değişkenlerini atla
    if (key.includes('${')) {
      continue;
    }

    // Eğer key zaten nokta içeriyorsa (tam yol), olduğu gibi kullan
    if (key.includes('.')) {
      keys.add(key);
    } else {
      // Anahtar nokta içermiyorsa ve namespace varsa, namespace ekle
      if (namespaces.length > 0) {
        // Her namespace için anahtar oluştur
        namespaces.forEach(ns => {
          keys.add(`${ns}.${key}`);
        });
      } else {
        // Namespace yoksa, olduğu gibi ekle
        keys.add(key);
      }
    }
  }

  return Array.from(keys);
}

function findHardcodedTurkish(content, filePath) {
  const hardcoded = [];

  // JSX text nodes
  const jsxMatches = content.matchAll(/>([^<]*[çÇğĞıİöÖşŞüÜ][^<]*)</g);
  for (const match of jsxMatches) {
    const text = match[1].trim();
    if (text && text.length > 2 && !text.match(/^[0-9\s\.\,\-\:\;]+$/)) {
      hardcoded.push({
        type: 'jsx',
        text: text.substring(0, 100),
        preview: match[0].substring(0, 150),
      });
    }
  }

  // String literals (sadece belirgin Türkçe cümleler)
  const stringMatches = content.matchAll(
    /['"`]([^'"`]*[çÇğĞıİöÖşŞüÜ]{2,}[^'"`]*)['"`]/g
  );
  for (const match of stringMatches) {
    const text = match[1].trim();
    // En az 10 karakter ve anlamlı bir metin olmalı
    if (text && text.length > 10 && text.split(' ').length > 1) {
      hardcoded.push({
        type: 'string',
        text: text.substring(0, 100),
        preview: match[0].substring(0, 150),
      });
    }
  }

  return hardcoded;
}

function getAllKeysFromJson(obj, prefix = '') {
  const keys = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeysFromJson(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }

  return keys;
}

// Ana analiz
async function analyzeTranslations() {
  console.log('🔍 Gelişmiş çeviri analizi başlatılıyor...\n');
  console.log('✨ Namespace desteği aktif!\n');

  // 1. Kaynak koddaki kullanılan anahtarları topla
  console.log('📂 Kaynak kod dosyaları taranıyor...');
  const files = getAllFiles(CONFIG.srcDir);
  console.log(`   ${files.length} dosya bulundu\n`);

  const usedKeys = new Map(); // key -> [files]
  const hardcodedTexts = new Map(); // file -> [texts]
  let filesWithNamespaces = 0;

  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');

    // Namespace kontrolü
    const namespaces = extractNamespaces(content);
    if (namespaces.length > 0) {
      filesWithNamespaces++;
    }

    // Kullanılan anahtarları bul
    const keys = extractTranslationKeys(content, file);
    keys.forEach(key => {
      if (!usedKeys.has(key)) {
        usedKeys.set(key, []);
      }
      usedKeys.get(key).push(file);
    });

    // Hardcoded Türkçe metinleri bul
    const hardcoded = findHardcodedTurkish(content, file);
    if (hardcoded.length > 0) {
      hardcodedTexts.set(file, hardcoded);
    }
  });

  console.log(`✅ ${usedKeys.size} benzersiz çeviri anahtarı bulundu`);
  console.log(
    `🔖 ${filesWithNamespaces} dosyada namespace kullanımı tespit edildi`
  );
  console.log(
    `⚠️  ${hardcodedTexts.size} dosyada hardcoded Türkçe metin tespit edildi\n`
  );

  // 2. Her dil için JSON'daki anahtarları yükle
  const localeKeys = {};

  CONFIG.locales.forEach(locale => {
    const jsonPath = path.join(CONFIG.messagesDir, `${locale}.json`);
    if (fs.existsSync(jsonPath)) {
      const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      localeKeys[locale] = new Set(getAllKeysFromJson(jsonContent));
      console.log(`📖 ${locale}.json: ${localeKeys[locale].size} anahtar`);
    } else {
      console.log(`❌ ${locale}.json bulunamadı`);
      localeKeys[locale] = new Set();
    }
  });

  console.log('');

  // 3. Eksik anahtarları tespit et
  const missingKeys = {};
  CONFIG.locales.forEach(locale => {
    missingKeys[locale] = [];
  });

  usedKeys.forEach((files, key) => {
    CONFIG.locales.forEach(locale => {
      if (!localeKeys[locale].has(key)) {
        missingKeys[locale].push({
          key,
          usedIn: files,
        });
      }
    });
  });

  // 4. Rapor oluştur
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalUsedKeys: usedKeys.size,
      totalFiles: files.length,
      filesWithNamespaces,
      hardcodedFilesCount: hardcodedTexts.size,
    },
    missingKeys,
    hardcodedTexts: Object.fromEntries(hardcodedTexts),
    localeStats: {},
  };

  CONFIG.locales.forEach(locale => {
    const totalInJson = localeKeys[locale].size;
    const missing = missingKeys[locale].length;
    const coverage =
      usedKeys.size > 0
        ? (((usedKeys.size - missing) / usedKeys.size) * 100).toFixed(2)
        : '100.00';

    report.localeStats[locale] = {
      totalKeys: totalInJson,
      missingKeys: missing,
      coverage: coverage + '%',
    };
  });

  // Raporu kaydet
  const reportPath = path.join(process.cwd(), 'translation-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  // Konsol özeti
  console.log('📊 SONUÇ ÖZETİ\n');
  console.log(`Toplam kullanılan anahtar: ${usedKeys.size}`);
  console.log(`Namespace kullanan dosya: ${filesWithNamespaces}`);
  console.log(`Taranan dosya sayısı: ${files.length}\n`);

  CONFIG.locales.forEach(locale => {
    console.log(`${locale.toUpperCase()}:`);
    console.log(`  ✓ JSON'da mevcut: ${localeKeys[locale].size}`);
    console.log(`  ✗ Eksik: ${missingKeys[locale].length}`);
    console.log(`  📈 Kapsam: ${report.localeStats[locale].coverage}\n`);
  });

  console.log(
    `⚠️  Hardcoded Türkçe metin içeren dosya: ${hardcodedTexts.size}\n`
  );

  // En çok eksik olan ilk 10 anahtarı göster
  if (missingKeys.tr && missingKeys.tr.length > 0) {
    console.log('❌ İLK 10 EKSİK ANAHTAR (TR):');
    missingKeys.tr.slice(0, 10).forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.key}`);
      console.log(`      → ${item.usedIn[0].replace(process.cwd(), '')}`);
    });
    console.log('');
  }

  // İlk 5 hardcoded metin örneği
  if (hardcodedTexts.size > 0) {
    console.log('⚠️  HARDCODED TÜRKÇE METİN ÖRNEKLERİ:');
    let count = 0;
    for (const [file, texts] of hardcodedTexts) {
      if (count >= 5) break;
      console.log(`   📄 ${file.replace(process.cwd(), '')}`);
      texts.slice(0, 2).forEach(item => {
        console.log(`      → [${item.type}] "${item.text}"`);
      });
      count++;
    }
    console.log('');
  }

  console.log(`💾 Detaylı rapor kaydedildi: ${reportPath}`);
  console.log('\n✨ Analiz tamamlandı!');

  return report;
}

// Script'i çalıştır
analyzeTranslations().catch(error => {
  console.error('❌ Hata:', error);
  process.exit(1);
});
