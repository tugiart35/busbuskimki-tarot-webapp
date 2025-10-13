#!/usr/bin/env node

/**
 * Eksik Çeviri Anahtarlarını Listeleyen Script
 *
 * translation-analysis.json'dan okuduğu verileri daha okunabilir hale getirir
 */

const fs = require('fs');
const path = require('path');

const reportPath = path.join(process.cwd(), 'translation-analysis.json');

if (!fs.existsSync(reportPath)) {
  console.error('❌ translation-analysis.json bulunamadı!');
  console.log(
    '💡 Önce "node find-missing-translations.js" komutunu çalıştırın.'
  );
  process.exit(1);
}

const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

console.log('\n═══════════════════════════════════════════════════════════');
console.log('📋 EKSİK ÇEVİRİ ANAHTARLARI LİSTESİ');
console.log('═══════════════════════════════════════════════════════════\n');

// Her dil için eksik anahtarları listele
Object.entries(report.missingKeys).forEach(([locale, missing]) => {
  console.log(
    `\n🌐 ${locale.toUpperCase()} - Eksik ${missing.length} anahtar:\n`
  );
  console.log('─'.repeat(70));

  if (missing.length === 0) {
    console.log('✅ Tüm anahtarlar mevcut!\n');
    return;
  }

  // Anahtarları grupla (namespace'e göre)
  const grouped = {};
  missing.forEach(item => {
    const namespace = item.key.split('.')[0];
    if (!grouped[namespace]) {
      grouped[namespace] = [];
    }
    grouped[namespace].push(item);
  });

  // Gruplara göre listele
  Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([namespace, items]) => {
      console.log(`\n📦 ${namespace} (${items.length} anahtar):`);
      items.forEach(item => {
        console.log(`   • ${item.key}`);
        // İlk kullanım yerini göster
        if (item.usedIn && item.usedIn.length > 0) {
          const shortPath = item.usedIn[0]
            .replace(process.cwd(), '')
            .substring(0, 80);
          console.log(`     └─ ${shortPath}`);
        }
      });
    });
});

// Hardcoded metinler özeti
console.log('\n\n═══════════════════════════════════════════════════════════');
console.log('⚠️  HARDCODED TÜRKÇE METİNLER (İlk 20 dosya)');
console.log('═══════════════════════════════════════════════════════════\n');

const hardcodedFiles = Object.entries(report.hardcodedTexts).slice(0, 20);
hardcodedFiles.forEach(([file, texts]) => {
  const shortPath = file.replace(process.cwd(), '');
  console.log(`\n📄 ${shortPath}`);
  console.log(`   ${texts.length} hardcoded metin bulundu:`);

  texts.slice(0, 3).forEach((item, idx) => {
    const preview =
      item.text.length > 60 ? item.text.substring(0, 60) + '...' : item.text;
    console.log(`   ${idx + 1}. [${item.type}] "${preview}"`);
  });

  if (texts.length > 3) {
    console.log(`   ... ve ${texts.length - 3} tane daha`);
  }
});

// Özet istatistikler
console.log('\n\n═══════════════════════════════════════════════════════════');
console.log('📊 İSTATİSTİKLER');
console.log('═══════════════════════════════════════════════════════════\n');

Object.entries(report.localeStats).forEach(([locale, stats]) => {
  console.log(`${locale.toUpperCase()}:`);
  console.log(`  • Toplam anahtar: ${stats.totalKeys}`);
  console.log(`  • Eksik anahtar: ${stats.missingKeys}`);
  console.log(`  • Kapsam: ${stats.coverage}`);
  console.log('');
});

console.log(
  `Hardcoded metin içeren dosya: ${report.summary.hardcodedFilesCount}`
);
console.log(
  `Namespace kullanan dosya: ${report.summary.filesWithNamespaces || 0}`
);
console.log(`Toplam taranan dosya: ${report.summary.totalFiles}`);

// JSON çıktı oluştur (sadece eksik anahtarlar)
const missingKeysOnly = {};
Object.entries(report.missingKeys).forEach(([locale, items]) => {
  missingKeysOnly[locale] = items.map(item => item.key);
});

const outputPath = path.join(process.cwd(), 'missing-keys-list.json');
fs.writeFileSync(outputPath, JSON.stringify(missingKeysOnly, null, 2));

console.log(`\n💾 Eksik anahtarlar listesi kaydedildi: missing-keys-list.json`);
console.log('═══════════════════════════════════════════════════════════\n');
