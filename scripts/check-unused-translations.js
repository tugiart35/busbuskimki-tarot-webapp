const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Nested objeyi flat key'lere çevir (örn: "dashboard.errors.statsLoadFailed")
function flattenKeys(obj, prefix = '') {
  let keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys = keys.concat(flattenKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// en.json'dan tüm anahtarları çıkar
function getAllKeysFromJson(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(content);
  return flattenKeys(json);
}

// Kaynak kodda kullanılan anahtarları bul
function findUsedKeys(srcDir, allKeys) {
  const usedKeys = new Set();
  const dynamicPrefixes = new Set();
  
  // Statik pattern'ler: t('key') veya t("key")
  const staticPatterns = [
    /t\(['"]([^'"]+)['"]/g,
    /t\(['"]([^'"]+)['"][,)]/g,
  ];
  
  // Dinamik pattern'ler: template literal kullanımları
  // problem-solving.meanings.${cardKey}.position${position}.upright
  const dynamicPatterns = [
    /[`'"]problem-solving\.meanings\.\$\{[^}]+\}\.position\$\{[^}]+\}\.(upright|reversed|keywords|context)[`'"]/g,
    /[`'"]situation-analysis\.meanings\.\$\{[^}]+\}\.position\$\{[^}]+\}\.(upright|reversed|keywords|context)[`'"]/g,
    /[`'"]relationship-problems\.meanings\.\$\{[^}]+\}\.position\$\{[^}]+\}\.(upright|reversed|keywords|context)[`'"]/g,
    /[`'"]relationship-analysis\.meanings\.\$\{[^}]+\}\.position\$\{[^}]+\}\.(upright|reversed|keywords|context)[`'"]/g,
    /[`'"]love\.meanings\.\$\{[^}]+\}\.position\$\{[^}]+\}\.(upright|reversed|keywords|context)[`'"]/g,
    /[`'"]new-lover\.meanings\.\$\{[^}]+\}\.position\$\{[^}]+\}\.(upright|reversed|keywords|context)[`'"]/g,
    /[`'"]new-lover\.meanings\.\$\{[^}]+\}\.\$\{[^}]+\}\.\$\{[^}]+\}[`'"]/g,
  ];
  
  // Helper fonksiyonlardan dönen dinamik anahtarları tespit et
  const helperFunctionPatterns = [
    /getNewLoverMeaningI18nKey/g,
    /getProblemSolvingMeaningI18nKey/g,
    /getSituationAnalysisMeaningI18nKey/g,
    /getRelationshipProblemsMeaningI18nKey/g,
    /getRelationshipAnalysisMeaningI18nKey/g,
    /getLoveMeaningI18nKey/g,
    /getCareerMeaningI18nKey/g,
    /getMarriageMeaningI18nKey/g,
    /getMoneyMeaningI18nKey/g,
  ];
  
  // İşlev çağrıları içinde dinamik key oluşturan pattern'ler
  const dynamicKeyPatterns = [
    /[`'"]career\.meanings\.\$\{[^}]+\}\.position\$\{[^}]+\}\.(upright|reversed|keywords|context)[`'"]/g,
    /[`'"]marriage\.meanings\.\$\{[^}]+\}\.\$\{[^}]+\}\.\$\{[^}]+\}[`'"]/g,
    /[`'"]money\.meanings\.\$\{[^}]+\}\.\$\{[^}]+\}\.\$\{[^}]+\}[`'"]/g,
  ];
  
  try {
    // Tüm TypeScript ve TypeScript React dosyalarını tara
    const files = execSync(
      `find ${srcDir} -type f \\( -name "*.ts" -o -name "*.tsx" \\)`,
      { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    ).trim().split('\n');
    
    files.forEach(file => {
      if (!file || file.includes('node_modules')) return;
      
      try {
        const content = fs.readFileSync(file, 'utf-8');
        
        // Statik anahtarları bul
        staticPatterns.forEach(pattern => {
          let match;
          while ((match = pattern.exec(content)) !== null) {
            usedKeys.add(match[1]);
          }
        });
        
        // Dinamik pattern'leri bul ve prefix'leri işaretle
        dynamicPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            // Bu pattern kullanılıyor, ilgili prefix'i işaretle
            const patternStr = pattern.source;
            if (patternStr.includes('problem-solving')) {
              dynamicPrefixes.add('problem-solving.meanings');
            } else if (patternStr.includes('situation-analysis')) {
              dynamicPrefixes.add('situation-analysis.meanings');
            } else if (patternStr.includes('relationship-problems')) {
              dynamicPrefixes.add('relationship-problems.meanings');
            } else if (patternStr.includes('relationship-analysis')) {
              dynamicPrefixes.add('relationship-analysis.meanings');
            } else if (patternStr.includes('love\\.meanings')) {
              dynamicPrefixes.add('love.meanings');
            } else if (patternStr.includes('new-lover')) {
              dynamicPrefixes.add('new-lover.meanings');
            }
          }
        });
        
        // Helper fonksiyonları kontrol et
        helperFunctionPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            const patternStr = pattern.source;
            if (patternStr.includes('NewLover')) {
              dynamicPrefixes.add('new-lover.meanings');
            } else if (patternStr.includes('ProblemSolving')) {
              dynamicPrefixes.add('problem-solving.meanings');
            } else if (patternStr.includes('SituationAnalysis')) {
              dynamicPrefixes.add('situation-analysis.meanings');
            } else if (patternStr.includes('RelationshipProblems')) {
              dynamicPrefixes.add('relationship-problems.meanings');
            } else if (patternStr.includes('RelationshipAnalysis')) {
              dynamicPrefixes.add('relationship-analysis.meanings');
            } else if (patternStr.includes('Love')) {
              dynamicPrefixes.add('love.meanings');
            } else if (patternStr.includes('Career')) {
              dynamicPrefixes.add('career.meanings');
            } else if (patternStr.includes('Marriage')) {
              dynamicPrefixes.add('marriage.meanings');
            } else if (patternStr.includes('Money')) {
              dynamicPrefixes.add('money.meanings');
            }
          }
        });
        
        // Dinamik key pattern'leri kontrol et
        dynamicKeyPatterns.forEach(pattern => {
          if (pattern.test(content)) {
            const patternStr = pattern.source;
            if (patternStr.includes('career')) {
              dynamicPrefixes.add('career.meanings');
            } else if (patternStr.includes('marriage')) {
              dynamicPrefixes.add('marriage.meanings');
            } else if (patternStr.includes('money')) {
              dynamicPrefixes.add('money.meanings');
            }
          }
        });
        
      } catch (err) {
        // Dosya okuma hatalarını sessizce atla
      }
    });
    
  } catch (err) {
    console.error('Error finding files:', err.message);
  }
  
  // Dinamik prefix'lerle eşleşen tüm anahtarları "used" olarak işaretle
  console.log(`\n🔧 Dinamik prefix'ler bulundu: ${dynamicPrefixes.size} adet`);
  dynamicPrefixes.forEach(prefix => {
    console.log(`   - ${prefix}.*`);
    allKeys.forEach(key => {
      if (key.startsWith(prefix + '.')) {
        usedKeys.add(key);
      }
    });
  });
  
  return usedKeys;
}

// Ana fonksiyon
function findUnusedKeys() {
  const projectRoot = process.cwd();
  const enJsonPath = path.join(projectRoot, 'messages', 'en.json');
  const srcDir = path.join(projectRoot, 'src');
  
  console.log('🔍 Çeviri anahtarları analiz ediliyor...\n');
  
  // Tüm anahtarları al
  console.log('📋 en.json\'dan anahtarlar çıkarılıyor...');
  const allKeys = getAllKeysFromJson(enJsonPath);
  console.log(`   Toplam ${allKeys.length} anahtar bulundu.\n`);
  
  // Kullanılan anahtarları bul
  console.log('🔎 Kaynak kodda kullanılan anahtarlar aranıyor...');
  const usedKeys = findUsedKeys(srcDir, allKeys);
  console.log(`   ${usedKeys.size} anahtar kullanımda.\n`);
  
  // Kullanılmayan anahtarları tespit et
  const unusedKeys = allKeys.filter(key => !usedKeys.has(key));
  
  // Sonuçları raporla
  console.log('═'.repeat(80));
  console.log('📊 ANALIZ SONUÇLARI');
  console.log('═'.repeat(80));
  console.log(`\n✅ Toplam anahtar sayısı: ${allKeys.length}`);
  console.log(`✅ Kullanılan anahtar sayısı: ${usedKeys.size}`);
  console.log(`❌ Kullanılmayan anahtar sayısı: ${unusedKeys.length}`);
  console.log(`📈 Kullanım oranı: ${((usedKeys.size / allKeys.length) * 100).toFixed(2)}%\n`);
  
  if (unusedKeys.length > 0) {
    console.log('═'.repeat(80));
    console.log('🗑️  KULLANILMAYAN ANAHTARLAR');
    console.log('═'.repeat(80));
    
    // Kategorilere göre grupla
    const groupedByCategory = {};
    unusedKeys.forEach(key => {
      const category = key.split('.')[0];
      if (!groupedByCategory[category]) {
        groupedByCategory[category] = [];
      }
      groupedByCategory[category].push(key);
    });
    
    // Her kategoriyi göster
    Object.keys(groupedByCategory).sort().forEach(category => {
      console.log(`\n📂 ${category.toUpperCase()} (${groupedByCategory[category].length} adet)`);
      groupedByCategory[category].forEach(key => {
        console.log(`   - ${key}`);
      });
    });
    
    // JSON dosyası olarak da kaydet
    const reportPath = path.join(projectRoot, 'unused-translation-keys.json');
    fs.writeFileSync(
      reportPath,
      JSON.stringify(
        {
          summary: {
            totalKeys: allKeys.length,
            usedKeys: usedKeys.size,
            unusedKeys: unusedKeys.length,
            usagePercentage: ((usedKeys.size / allKeys.length) * 100).toFixed(2) + '%'
          },
          unusedKeys: groupedByCategory,
          unusedKeysList: unusedKeys
        },
        null,
        2
      )
    );
    console.log(`\n💾 Detaylı rapor kaydedildi: ${reportPath}`);
  } else {
    console.log('\n🎉 Harika! Tüm çeviri anahtarları kullanılıyor.');
  }
  
  console.log('\n' + '═'.repeat(80) + '\n');
}

// Script'i çalıştır
findUnusedKeys();