const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Kullanılmayan çeviri anahtarlarını bulmak için analiz scripti
class TranslationAnalyzer {
  constructor() {
    this.allKeys = new Set();
    this.usedKeys = new Set();
    this.translationFiles = [
      'messages/tr.json',
      'messages/en.json',
      'messages/sr.json',
    ];
    this.sourceDir = 'src';
  }

  // JSON'daki tüm anahtarları topla (nested yapıda)
  collectAllKeys(obj, prefix = '') {
    for (const key in obj) {
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        this.collectAllKeys(obj[key], fullKey);
      } else {
        this.allKeys.add(fullKey);
      }
    }
  }

  // Kaynak koddaki kullanımları bul
  findUsedKeys(content) {
    // t('key'), t("key"), t(`key`) kalıplarını yakala
    const patterns = [
      /t\(['"]([^'"]+)['"]\)/g,
      /t\(`([^`]+)`\)/g,
      // Dinamik anahtarlar için template string içindekiler
      /t\(\$\{[^}]+\}\.([a-zA-Z0-9_.]+)\)/g,
      // namespace + key birleşimi
      /['"`]([a-zA-Z0-9_]+\.[a-zA-Z0-9_.]+)['"`]/g,
    ];

    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const key = match[1];
        if (key && !key.includes('${')) {
          this.usedKeys.add(key);

          // Nested anahtarlar için parent'ları da ekle
          const parts = key.split('.');
          for (let i = 1; i < parts.length; i++) {
            const partialKey = parts.slice(0, i).join('.');
            this.usedKeys.add(partialKey);
          }
        }
      }
    });
  }

  // Tüm kaynak dosyaları tara
  async scanSourceFiles() {
    return new Promise((resolve, reject) => {
      glob(`${this.sourceDir}/**/*.{ts,tsx,js,jsx}`, (err, files) => {
        if (err) return reject(err);

        console.log(`🔍 ${files.length} dosya taranıyor...`);

        files.forEach((file, index) => {
          if (index % 100 === 0) {
            console.log(`  → ${index}/${files.length} dosya işlendi...`);
          }

          const content = fs.readFileSync(file, 'utf-8');
          this.findUsedKeys(content);
        });

        resolve();
      });
    });
  }

  // Ana analiz fonksiyonu
  async analyze() {
    console.log('📊 Çeviri Analizi Başlatılıyor...\n');

    // 1. JSON dosyalarını yükle ve tüm anahtarları topla
    console.log('1️⃣ JSON dosyalarındaki anahtarlar toplanıyor...');
    this.translationFiles.forEach(file => {
      try {
        const content = JSON.parse(fs.readFileSync(file, 'utf-8'));
        this.collectAllKeys(content);
        console.log(`  ✅ ${file}: anahtarlar toplandı`);
      } catch (error) {
        console.error(`  ❌ ${file}: Hata - ${error.message}`);
      }
    });
    console.log(`  📦 Toplam ${this.allKeys.size} anahtar bulundu\n`);

    // 2. Kaynak kodları tara
    console.log('2️⃣ Kaynak kodlar taranıyor...');
    await this.scanSourceFiles();
    console.log(`  ✅ ${this.usedKeys.size} kullanılan anahtar bulundu\n`);

    // 3. Kullanılmayanları tespit et
    console.log('3️⃣ Kullanılmayan anahtarlar tespit ediliyor...');
    const unusedKeys = Array.from(this.allKeys).filter(
      key => !this.usedKeys.has(key)
    );

    console.log('\n' + '='.repeat(60));
    console.log('📊 ANALİZ SONUÇLARI');
    console.log('='.repeat(60));
    console.log(`Toplam Anahtar: ${this.allKeys.size}`);
    console.log(`Kullanılan: ${this.usedKeys.size}`);
    console.log(`Kullanılmayan: ${unusedKeys.length}`);
    console.log(
      `Kullanım Oranı: ${((this.usedKeys.size / this.allKeys.size) * 100).toFixed(2)}%`
    );
    console.log('='.repeat(60) + '\n');

    // 4. Sonuçları dosyaya kaydet
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalKeys: this.allKeys.size,
        usedKeys: this.usedKeys.size,
        unusedKeys: unusedKeys.length,
        usagePercentage:
          ((this.usedKeys.size / this.allKeys.size) * 100).toFixed(2) + '%',
      },
      unusedKeys: unusedKeys.sort(),
      // Grup bazında analiz
      unusedByPrefix: this.groupByPrefix(unusedKeys),
    };

    fs.writeFileSync(
      'translation-analysis-report.json',
      JSON.stringify(report, null, 2)
    );
    console.log('✅ Rapor kaydedildi: translation-analysis-report.json');

    // İlk 20 kullanılmayan anahtarı göster
    if (unusedKeys.length > 0) {
      console.log('\n📝 İlk 20 Kullanılmayan Anahtar:');
      unusedKeys.slice(0, 20).forEach((key, index) => {
        console.log(`  ${index + 1}. ${key}`);
      });
      if (unusedKeys.length > 20) {
        console.log(`  ... ve ${unusedKeys.length - 20} anahtar daha`);
      }
    }

    return report;
  }

  // Anahtarları prefix'e göre grupla
  groupByPrefix(keys) {
    const grouped = {};
    keys.forEach(key => {
      const prefix = key.split('.')[0];
      if (!grouped[prefix]) {
        grouped[prefix] = [];
      }
      grouped[prefix].push(key);
    });

    // Her grup için sayım
    const summary = {};
    Object.keys(grouped).forEach(prefix => {
      summary[prefix] = {
        count: grouped[prefix].length,
        examples: grouped[prefix].slice(0, 5), // İlk 5 örnek
      };
    });

    return summary;
  }
}

// Scripti çalıştır
const analyzer = new TranslationAnalyzer();
analyzer.analyze().catch(console.error);
