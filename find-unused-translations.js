#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Kullanılmayan çeviri anahtarları taranıyor...\n');

// tr.json dosyasını oku
const trJsonPath = path.join(__dirname, 'messages', 'tr.json');
const trJson = JSON.parse(fs.readFileSync(trJsonPath, 'utf8'));

// Tüm anahtarları düz liste olarak çıkar (obje anahtarları dahil)
function flattenKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    // Her anahtarı ekle (obje olsa bile)
    keys.push(fullKey);
    
    // Eğer obje ise, içindeki anahtarları da ekle
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      keys.push(...flattenKeys(value, fullKey));
    }
  }
  
  return keys;
}

const allKeys = flattenKeys(trJson);
console.log(`📊 Toplam ${allKeys.length} çeviri anahtarı bulundu (obje anahtarları dahil).\n`);

// Taranacak dizinler ve uzantılar
const searchDirs = ['src'];
const fileExtensions = ['.tsx', '.ts', '.jsx', '.js'];

// Kullanılmayan anahtarları bul
const unusedKeys = [];
const usedKeys = [];
let checkedCount = 0;

console.log('🔎 Anahtarlar kontrol ediliyor...');

for (const key of allKeys) {
  checkedCount++;
  
  // İlerleme göstergesi
  if (checkedCount % 1000 === 0) {
    console.log(`   ${checkedCount}/${allKeys.length} kontrol edildi...`);
  }
  
  // Anahtarın farklı kullanım şekillerini ara
  const searchPatterns = [
    `"${key}"`, // "dashboard.errors.statsLoadFailed"
    `'${key}'`, // 'dashboard.errors.statsLoadFailed'
    `\`${key}\``, // `dashboard.errors.statsLoadFailed`
    key.replace(/\./g, '\\.'), // Regex için escape edilmiş
  ];
  
  let isUsed = false;
  
  for (const pattern of searchPatterns) {
    try {
      // grep ile ara (daha hızlı)
      const grepCmd = `grep -r --include="*.tsx" --include="*.ts" --include="*.jsx" --include="*.js" "${pattern}" ${searchDirs.join(' ')} 2>/dev/null || true`;
      const result = execSync(grepCmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
      
      if (result.trim()) {
        isUsed = true;
        break;
      }
    } catch (error) {
      // Hata durumunda devam et
    }
  }
  
  if (isUsed) {
    usedKeys.push(key);
  } else {
    unusedKeys.push(key);
  }
}

// Sonuçları göster
console.log('\n' + '='.repeat(80));
console.log(`\n📈 SONUÇLAR:\n`);
console.log(`✅ Kullanılan anahtarlar: ${usedKeys.length}`);
console.log(`❌ Kullanılmayan anahtarlar: ${unusedKeys.length}`);
console.log(`📊 Kullanım oranı: ${((usedKeys.length / allKeys.length) * 100).toFixed(2)}%\n`);

if (unusedKeys.length > 0) {
  // Sonuçları dosyaya kaydet
  const outputPath = path.join(__dirname, 'unused-translations.json');
  const output = {
    timestamp: new Date().toISOString(),
    totalKeys: allKeys.length,
    usedKeys: usedKeys.length,
    unusedKeys: unusedKeys.length,
    unusedKeysList: unusedKeys.sort(),
    statistics: {
      topLevelBreakdown: {},
      leafNodeCount: 0,
      objectKeyCount: 0
    }
  };
  
  // Üst seviye kategorilere göre grupla ve leaf/object ayır
  unusedKeys.forEach(key => {
    const topLevel = key.split('.')[0];
    if (!output.statistics.topLevelBreakdown[topLevel]) {
      output.statistics.topLevelBreakdown[topLevel] = 0;
    }
    output.statistics.topLevelBreakdown[topLevel]++;
    
    // Leaf node mu obje mi kontrol et
    const value = key.split('.').reduce((obj, k) => obj?.[k], trJson);
    if (typeof value === 'object' && value !== null) {
      output.statistics.objectKeyCount++;
    } else {
      output.statistics.leafNodeCount++;
    }
  });
  
  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`💾 Detaylı rapor kaydedildi: ${outputPath}\n`);
  
  // İlk 50 kullanılmayan anahtarı göster
  console.log('❌ Kullanılmayan anahtarların ilk 50 tanesi:\n');
  unusedKeys.slice(0, 50).forEach((key, index) => {
    const value = key.split('.').reduce((obj, k) => obj?.[k], trJson);
    const type = typeof value === 'object' && value !== null ? '[OBJE]' : '[STRING]';
    console.log(`   ${(index + 1).toString().padStart(3, ' ')}. ${type} ${key}`);
  });
  
  if (unusedKeys.length > 50) {
    console.log(`\n   ... ve ${unusedKeys.length - 50} tane daha\n`);
  }
  
  // Kategorilere göre dağılım
  console.log('\n📊 Kullanılmayan anahtarların kategorilere göre dağılımı:\n');
  const breakdown = output.statistics.topLevelBreakdown;
  Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      const percentage = ((count / unusedKeys.length) * 100).toFixed(1);
      console.log(`   ${category.padEnd(30, ' ')}: ${count.toString().padStart(5, ' ')} (%${percentage})`);
    });
  
  console.log(`\n📊 Kullanılmayan obje anahtarları: ${output.statistics.objectKeyCount}`);
  console.log(`📊 Kullanılmayan string değerleri: ${output.statistics.leafNodeCount}`);
  
  console.log('\n' + '='.repeat(80));
  console.log('\n💡 İpucu: unused-translations.json dosyasında tüm detayları bulabilirsiniz.\n');
} else {
  console.log('🎉 Tebrikler! Tüm çeviri anahtarları kullanılıyor.\n');
}

