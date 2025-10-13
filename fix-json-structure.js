#!/usr/bin/env node

/**
 * JSON Yapı Düzeltme Scripti
 *
 * Bu script:
 * 1. messages.* altındaki objeleri root seviyeye taşır/birleştirir
 * 2. blog.footer altındaki footer objesini root seviyeye taşır
 * 3. Backup oluşturur
 * 4. Tüm dil dosyalarını (tr, en, sr) düzeltir
 */

const fs = require('fs');
const path = require('path');

const LOCALES = ['tr', 'en', 'sr'];
const MESSAGES_DIR = './messages';

function deepMerge(target, source) {
  const output = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }

  return output;
}

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function fixJsonStructure(locale) {
  console.log(`\n🔧 ${locale.toUpperCase()} dosyası işleniyor...`);

  const jsonPath = path.join(MESSAGES_DIR, `${locale}.json`);

  if (!fs.existsSync(jsonPath)) {
    console.log(`❌ ${locale}.json bulunamadı, atlanıyor...`);
    return;
  }

  // Backup oluştur
  const backupPath = path.join(
    MESSAGES_DIR,
    `${locale}.backup-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  );
  fs.copyFileSync(jsonPath, backupPath);
  console.log(`✅ Backup oluşturuldu: ${path.basename(backupPath)}`);

  // JSON'u yükle
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const newData = { ...data };

  let changeCount = 0;

  // 1. messages.* altındaki objeleri root seviyeye taşı
  if (data.messages) {
    console.log('\n📦 messages.* objeleri root seviyeye taşınıyor...');

    const keysToMove = [
      'dashboard',
      'common',
      'footer',
      'navigation',
      'profile',
      'auth',
      'readings',
      'statistics',
    ];

    keysToMove.forEach(key => {
      if (data.messages[key]) {
        console.log(`   • messages.${key} -> ${key}`);

        if (newData[key]) {
          // Var olan ile birleştir
          newData[key] = deepMerge(newData[key], data.messages[key]);
          console.log(`     ↳ Mevcut ${key} ile birleştirildi`);
        } else {
          // Yeni ekle
          newData[key] = data.messages[key];
          console.log(`     ↳ Root seviyeye eklendi`);
        }
        changeCount++;
      }
    });
  }

  // 2. blog.footer -> root footer'a ekle
  if (data.blog?.footer) {
    console.log('\n📦 blog.footer root seviyeye taşınıyor...');
    console.log('   • blog.footer -> footer');

    if (newData.footer) {
      // Var olan footer ile birleştir
      newData.footer = deepMerge(newData.footer, data.blog.footer);
      console.log('     ↳ Mevcut footer ile birleştirildi');
    } else {
      // Yeni footer oluştur
      newData.footer = data.blog.footer;
      console.log('     ↳ Root seviyeye eklendi');
    }
    changeCount++;
  }

  // 3. footer.legalPages -> root legalPages'e de kopyala (kodda direkt legalPages. ile çağrılıyor)
  if (newData.footer?.legalPages) {
    console.log('\n📦 footer.legalPages legalPages olarak da kopyalanıyor...');
    console.log('   • footer.legalPages -> legalPages');

    if (newData.legalPages) {
      newData.legalPages = deepMerge(
        newData.legalPages,
        newData.footer.legalPages
      );
      console.log('     ↳ Mevcut legalPages ile birleştirildi');
    } else {
      newData.legalPages = newData.footer.legalPages;
      console.log('     ↳ Root seviyeye eklendi');
    }
    changeCount++;
  }

  // 4. blog.common -> root common'a birleştir (common.saving gibi eksiklikler için)
  if (data.blog?.common) {
    console.log('\n📦 blog.common root common ile birleştiriliyor...');
    console.log('   • blog.common -> common');

    if (newData.common) {
      newData.common = deepMerge(newData.common, data.blog.common);
      console.log('     ↳ Mevcut common ile birleştirildi');
    } else {
      newData.common = data.blog.common;
      console.log('     ↳ Root seviyeye eklendi');
    }
    changeCount++;
  }

  // 5. Güncellenmiş JSON'u kaydet
  if (changeCount > 0) {
    fs.writeFileSync(jsonPath, JSON.stringify(newData, null, 2), 'utf-8');
    console.log(`\n✅ ${locale}.json güncellendi (${changeCount} değişiklik)`);
  } else {
    console.log(`\n⚠️  ${locale}.json için değişiklik gerekmedi`);
  }

  return { locale, changeCount };
}

// Ana fonksiyon
async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║     JSON YAPI DÜZELTİCİ - Anahtar Yol Standardizasyonu     ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  const results = [];

  for (const locale of LOCALES) {
    const result = fixJsonStructure(locale);
    if (result) results.push(result);
  }

  // Özet
  console.log('\n\n╔════════════════════════════════════════════════════════╗');
  console.log('║                        ÖZET                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  results.forEach(({ locale, changeCount }) => {
    console.log(`${locale.toUpperCase()}: ${changeCount} değişiklik yapıldı`);
  });

  console.log('\n✨ İşlem tamamlandı!');
  console.log('\n💡 Sonraki adım: node find-missing-translations.js');
  console.log(
    '   (Güncellenmiş JSON ile eksik anahtarları tekrar kontrol et)\n'
  );
}

main().catch(error => {
  console.error('❌ Hata:', error);
  process.exit(1);
});
