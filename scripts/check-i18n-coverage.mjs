#!/usr/bin/env node
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const projectRoot = join(__dirname, '..');
const messagesDir = join(projectRoot, 'messages');
const srcDir = join(projectRoot, 'src');

// Locale dosyalarını yükle
const locales = ['tr', 'en', 'sr'];
const localeData = {};

console.log('='.repeat(80));
console.log('i18n Coverage Report');
console.log('Generated:', new Date().toISOString());
console.log('='.repeat(80));
console.log();

// Her locale için JSON'ları yükle
for (const locale of locales) {
  const filePath = join(messagesDir, `${locale}.json`);
  try {
    const content = readFileSync(filePath, 'utf-8');
    localeData[locale] = JSON.parse(content);
    console.log(`✓ Loaded ${locale}.json (${Object.keys(flattenObject(localeData[locale])).length} keys)`);
  } catch (error) {
    console.error(`✗ Error loading ${locale}.json:`, error.message);
    localeData[locale] = {};
  }
}

console.log();
console.log('-'.repeat(80));
console.log('ANALYSIS');
console.log('-'.repeat(80));
console.log();

// Nesneyi düzleştir (nested keys için)
function flattenObject(obj, prefix = '') {
  const result = {};
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(result, flattenObject(obj[key], fullKey));
    } else {
      result[fullKey] = obj[key];
    }
  }
  return result;
}

// Tüm dosyaları recursive olarak tara
function getAllFiles(dir, fileList = []) {
  const files = readdirSync(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const stat = statSync(filePath);
    
    if (stat.isDirectory()) {
      // node_modules ve diğer gereksiz klasörleri atla
      if (!file.startsWith('.') && file !== 'node_modules' && file !== '__tests__' && file !== 'test-utils') {
        getAllFiles(filePath, fileList);
      }
    } else {
      // Sadece TypeScript/TSX/JavaScript dosyalarını al
      const ext = extname(file);
      if (['.ts', '.tsx', '.js', '.jsx'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  
  return fileList;
}

// Kodda kullanılan i18n anahtarlarını bul
function findUsedKeys(content) {
  const keys = new Set();
  
  // useTranslations() hookunu kullanarak erişilen anahtarlar
  // Örnek: t('common.welcome')
  const tPattern = /\bt\(['"`]([^'"`]+)['"`]/g;
  let match;
  while ((match = tPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  // getTranslations() ile async kullanım
  // Örnek: t('common.welcome')
  const asyncTPattern = /\bt\(['"`]([^'"`]+)['"`]/g;
  while ((match = asyncTPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  // useFormatter veya başka kullanımlar
  // Örnek: messages['common.welcome']
  const messagesPattern = /messages\[['"`]([^'"`]+)['"`]\]/g;
  while ((match = messagesPattern.exec(content)) !== null) {
    keys.add(match[1]);
  }
  
  return Array.from(keys);
}

// Tüm kaynak dosyaları tara
const sourceFiles = getAllFiles(srcDir);
const usedKeys = new Set();

for (const file of sourceFiles) {
  try {
    const content = readFileSync(file, 'utf-8');
    const keys = findUsedKeys(content);
    keys.forEach(key => usedKeys.add(key));
  } catch (error) {
    // Sessizce atla
  }
}

console.log(`Found ${usedKeys.size} unique i18n keys used in source code`);
console.log();

// Her locale için analiz
for (const locale of locales) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`LOCALE: ${locale.toUpperCase()}`);
  console.log('='.repeat(80));
  
  const flatKeys = flattenObject(localeData[locale]);
  const availableKeys = new Set(Object.keys(flatKeys));
  
  console.log(`\nTotal keys in ${locale}.json: ${availableKeys.size}`);
  
  // Kullanılan ama mevcut olmayan anahtarlar
  const missingKeys = Array.from(usedKeys).filter(key => !availableKeys.has(key));
  
  // Mevcut ama kullanılmayan anahtarlar
  const unusedKeys = Array.from(availableKeys).filter(key => !usedKeys.has(key));
  
  if (missingKeys.length > 0) {
    console.log(`\n❌ MISSING KEYS (${missingKeys.length}):`);
    console.log('-'.repeat(80));
    missingKeys.sort().forEach((key, index) => {
      console.log(`${(index + 1).toString().padStart(4)}. ${key}`);
    });
  } else {
    console.log('\n✅ No missing keys - All used keys are present');
  }
  
  if (unusedKeys.length > 0 && unusedKeys.length < 50) {
    // Sadece 50'den az ise göster (çok fazla olabilir)
    console.log(`\n⚠️  UNUSED KEYS (${unusedKeys.length}):`);
    console.log('-'.repeat(80));
    unusedKeys.sort().slice(0, 20).forEach((key, index) => {
      console.log(`${(index + 1).toString().padStart(4)}. ${key}`);
    });
    if (unusedKeys.length > 20) {
      console.log(`     ... and ${unusedKeys.length - 20} more`);
    }
  } else if (unusedKeys.length >= 50) {
    console.log(`\n⚠️  ${unusedKeys.length} unused keys found (too many to display)`);
  }
  
  // Empty value kontrolü
  const emptyKeys = Object.entries(flatKeys)
    .filter(([_, value]) => !value || (typeof value === 'string' && value.trim() === ''))
    .map(([key]) => key);
  
  if (emptyKeys.length > 0) {
    console.log(`\n⚠️  EMPTY VALUES (${emptyKeys.length}):`);
    console.log('-'.repeat(80));
    emptyKeys.sort().forEach((key, index) => {
      console.log(`${(index + 1).toString().padStart(4)}. ${key}`);
    });
  }
}

// Locale karşılaştırması
console.log(`\n${'='.repeat(80)}`);
console.log('LOCALE COMPARISON');
console.log('='.repeat(80));

const trKeys = new Set(Object.keys(flattenObject(localeData['tr'])));
const enKeys = new Set(Object.keys(flattenObject(localeData['en'])));
const srKeys = new Set(Object.keys(flattenObject(localeData['sr'])));

console.log('\nMissing keys per locale:');
console.log('-'.repeat(80));

// EN'de olup TR'de olmayan
const missingInTr = Array.from(enKeys).filter(key => !trKeys.has(key));
if (missingInTr.length > 0) {
  console.log(`\n❌ Missing in TR (present in EN): ${missingInTr.length}`);
  missingInTr.sort().slice(0, 10).forEach((key, index) => {
    console.log(`${(index + 1).toString().padStart(4)}. ${key}`);
  });
  if (missingInTr.length > 10) {
    console.log(`     ... and ${missingInTr.length - 10} more`);
  }
}

// EN'de olup SR'de olmayan
const missingInSr = Array.from(enKeys).filter(key => !srKeys.has(key));
if (missingInSr.length > 0) {
  console.log(`\n❌ Missing in SR (present in EN): ${missingInSr.length}`);
  missingInSr.sort().slice(0, 10).forEach((key, index) => {
    console.log(`${(index + 1).toString().padStart(4)}. ${key}`);
  });
  if (missingInSr.length > 10) {
    console.log(`     ... and ${missingInSr.length - 10} more`);
  }
}

// TR'de olup EN'de olmayan
const extraInTr = Array.from(trKeys).filter(key => !enKeys.has(key));
if (extraInTr.length > 0) {
  console.log(`\n⚠️  Extra in TR (not in EN): ${extraInTr.length}`);
  extraInTr.sort().slice(0, 10).forEach((key, index) => {
    console.log(`${(index + 1).toString().padStart(4)}. ${key}`);
  });
  if (extraInTr.length > 10) {
    console.log(`     ... and ${extraInTr.length - 10} more`);
  }
}

console.log();
console.log('='.repeat(80));
console.log('END OF REPORT');
console.log('='.repeat(80));

