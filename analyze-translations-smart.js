const fs = require('fs');
const path = require('path');
const glob = require('glob');

class SmartTranslationAnalyzer {
  constructor() {
    this.allKeys = new Set();
    this.directlyUsedKeys = new Set();
    this.dynamicPrefixes = new Set();
    this.namespacedKeys = new Map(); // namespace -> keys
    this.sourceDir = 'src';
  }

  // JSON'daki tüm anahtarları topla
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

  // Namespace bazlı kullanımları grupla
  groupKeysByNamespace() {
    this.allKeys.forEach(key => {
      const parts = key.split('.');
      const namespace = parts[0];

      if (!this.namespacedKeys.has(namespace)) {
        this.namespacedKeys.set(namespace, new Set());
      }
      this.namespacedKeys.get(namespace).add(key);
    });
  }

  // Kaynak koddaki kullanımları bul
  findKeyUsages(content) {
    // 1. Doğrudan kullanımlar: t('exact.key')
    const directPatterns = [
      /t\(['"]([a-zA-Z0-9_.]+)['"]\)/g,
      /translate\(['"]([a-zA-Z0-9_.]+)['"]\)/g,
      /getTranslation\(['"]([a-zA-Z0-9_.]+)['"]\)/g,
    ];

    directPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        this.directlyUsedKeys.add(match[1]);
      }
    });

    // 2. Dinamik namespace kullanımları
    const namespacePatterns = [
      /const\s+namespace\s*=\s*['"]([a-zA-Z0-9_]+)['"]/g,
      /namespace:\s*['"]([a-zA-Z0-9_]+)['"]/g,
      /translationNamespace:\s*['"]([a-zA-Z0-9_]+)['"]/g,
      /i18nNamespace:\s*['"]([a-zA-Z0-9_]+)['"]/g,
    ];

    namespacePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        this.dynamicPrefixes.add(match[1]);
      }
    });

    // 3. Template string içindeki prefix'ler
    const templatePatterns = [
      /\$\{namespace\}\.([a-zA-Z0-9_.]+)/g,
      /\$\{([a-zA-Z0-9_]+)\}\./g,
      /`([a-zA-Z0-9_]+)\./g,
    ];

    templatePatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        if (match[1] && match[1] !== 'namespace') {
          this.dynamicPrefixes.add(match[1]);
        }
      }
    });

    // 4. Config objelerdeki i18n key'leri
    const configPattern = /i18nKeys:\s*\{[^}]*\}/gs;
    const configMatches = content.match(configPattern);
    if (configMatches) {
      configMatches.forEach(configBlock => {
        const keyPattern = /['"]([a-zA-Z0-9_.]+)['"]/g;
        let match;
        while ((match = keyPattern.exec(configBlock)) !== null) {
          this.directlyUsedKeys.add(match[1]);
        }
      });
    }
  }

  // Tüm kaynak dosyaları tara
  async scanSourceFiles() {
    return new Promise((resolve, reject) => {
      glob(`${this.sourceDir}/**/*.{ts,tsx,js,jsx}`, (err, files) => {
        if (err) return reject(err);

        console.log(`🔍 ${files.length} dosya taranıyor...`);

        files.forEach((file, index) => {
          if (index % 50 === 0) {
            console.log(`  → ${index}/${files.length} dosya işlendi...`);
          }

          const content = fs.readFileSync(file, 'utf-8');
          this.findKeyUsages(content);
        });

        resolve();
      });
    });
  }

  // Akıllı kullanım tespiti
  isKeyUsed(key) {
    // 1. Doğrudan kullanılıyor mu?
    if (this.directlyUsedKeys.has(key)) {
      return { used: true, reason: 'direct' };
    }

    // 2. Dinamik prefix ile kullanılıyor mu?
    const keyPrefix = key.split('.')[0];
    if (this.dynamicPrefixes.has(keyPrefix)) {
      return { used: true, reason: 'dynamic-prefix' };
    }

    // 3. Parent key kullanılıyor mu?
    const parts = key.split('.');
    for (let i = parts.length - 1; i > 0; i--) {
      const parentKey = parts.slice(0, i).join('.');
      if (this.directlyUsedKeys.has(parentKey)) {
        return { used: true, reason: 'parent-key' };
      }
    }

    // 4. Ortak pattern'ler (tarot kartları, pozisyonlar vb.)
    const commonPatterns = [
      /^cards\./,
      /^tarotCards\./,
      /^positions\./,
      /\.position[0-9]+\./,
      /\.card[0-9]+\./,
      /\.meanings?\./,
      /\.upright$/,
      /\.reversed$/,
    ];

    for (const pattern of commonPatterns) {
      if (pattern.test(key)) {
        return { used: true, reason: 'common-pattern' };
      }
    }

    return { used: false, reason: null };
  }

  // Ana analiz
  async analyze() {
    console.log('🔮 Akıllı Çeviri Analizi Başlatılıyor...\n');

    // 1. JSON'ları yükle
    console.log('1️⃣ JSON dosyalarındaki anahtarlar toplanıyor...');
    const trContent = JSON.parse(fs.readFileSync('messages/tr.json', 'utf-8'));
    this.collectAllKeys(trContent);
    this.groupKeysByNamespace();
    console.log(`  📦 ${this.allKeys.size} anahtar bulundu\n`);

    // 2. Kaynak kodu tara
    console.log('2️⃣ Kaynak kodlar taranıyor...');
    await this.scanSourceFiles();
    console.log(`  ✅ ${this.directlyUsedKeys.size} doğrudan kullanım`);
    console.log(`  ✅ ${this.dynamicPrefixes.size} dinamik namespace\n`);

    // 3. Akıllı analiz
    console.log('3️⃣ Akıllı kullanım analizi yapılıyor...');
    const analysis = {
      directlyUsed: [],
      dynamicUsed: [],
      patternUsed: [],
      unused: [],
    };

    this.allKeys.forEach(key => {
      const result = this.isKeyUsed(key);
      if (result.used) {
        if (result.reason === 'direct') {
          analysis.directlyUsed.push(key);
        } else if (result.reason === 'dynamic-prefix') {
          analysis.dynamicUsed.push(key);
        } else {
          analysis.patternUsed.push(key);
        }
      } else {
        analysis.unused.push(key);
      }
    });

    const totalUsed =
      analysis.directlyUsed.length +
      analysis.dynamicUsed.length +
      analysis.patternUsed.length;

    // 4. Sonuçlar
    console.log('\n' + '='.repeat(70));
    console.log('📊 DETAYLI ANALİZ SONUÇLARI');
    console.log('='.repeat(70));
    console.log(`Toplam Anahtar: ${this.allKeys.size.toLocaleString()}`);
    console.log(
      `  ├─ Doğrudan Kullanılan: ${analysis.directlyUsed.length.toLocaleString()}`
    );
    console.log(
      `  ├─ Dinamik Kullanılan: ${analysis.dynamicUsed.length.toLocaleString()}`
    );
    console.log(
      `  ├─ Pattern ile Kullanılan: ${analysis.patternUsed.length.toLocaleString()}`
    );
    console.log(
      `  └─ Kullanılmayan: ${analysis.unused.length.toLocaleString()}`
    );
    console.log(
      `\nGerçek Kullanım Oranı: ${((totalUsed / this.allKeys.size) * 100).toFixed(2)}%`
    );
    console.log('='.repeat(70) + '\n');

    // 5. Namespace bazlı analiz
    console.log('📁 Namespace Bazlı Analiz:\n');
    const namespaceStats = {};
    this.namespacedKeys.forEach((keys, namespace) => {
      const nsUsed = Array.from(keys).filter(
        key => this.isKeyUsed(key).used
      ).length;
      namespaceStats[namespace] = {
        total: keys.size,
        used: nsUsed,
        unused: keys.size - nsUsed,
        percentage: ((nsUsed / keys.size) * 100).toFixed(2) + '%',
      };
    });

    // En çok kullanılan namespace'ler
    const sortedNamespaces = Object.entries(namespaceStats)
      .sort((a, b) => b[1].used - a[1].used)
      .slice(0, 15);

    console.log('En Çok Kullanılan 15 Namespace:');
    sortedNamespaces.forEach(([ns, stats], index) => {
      console.log(
        `  ${index + 1}. ${ns.padEnd(30)} → ${stats.used}/${stats.total} (${stats.percentage})`
      );
    });

    // En az kullanılan namespace'ler
    const leastUsedNamespaces = Object.entries(namespaceStats)
      .filter(([ns, stats]) => stats.used === 0)
      .slice(0, 10);

    if (leastUsedNamespaces.length > 0) {
      console.log("\n❌ Hiç Kullanılmayan Namespace'ler:");
      leastUsedNamespaces.forEach(([ns, stats]) => {
        console.log(`  • ${ns} (${stats.total} anahtar)`);
      });
    }

    // 6. Rapor kaydet
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalKeys: this.allKeys.size,
        directlyUsed: analysis.directlyUsed.length,
        dynamicUsed: analysis.dynamicUsed.length,
        patternUsed: analysis.patternUsed.length,
        unused: analysis.unused.length,
        usagePercentage:
          ((totalUsed / this.allKeys.size) * 100).toFixed(2) + '%',
      },
      namespaceStats,
      dynamicPrefixes: Array.from(this.dynamicPrefixes),
      unusedKeys: analysis.unused.sort(),
      // Sadece güvenle silinebilecek anahtarlar
      safeToDelete: analysis.unused.filter(key => {
        // Tarot/kart ile ilgili değil
        return !key.match(/^(cards|tarot|positions|spread|reading)\./i);
      }),
    };

    fs.writeFileSync(
      'smart-translation-analysis.json',
      JSON.stringify(report, null, 2)
    );
    console.log(
      '\n✅ Detaylı rapor kaydedildi: smart-translation-analysis.json'
    );

    // İlk 20 güvenle silinebilecek anahtar
    if (report.safeToDelete.length > 0) {
      console.log('\n🗑️  Güvenle Silinebilecek İlk 20 Anahtar:');
      report.safeToDelete.slice(0, 20).forEach((key, index) => {
        console.log(`  ${index + 1}. ${key}`);
      });
      if (report.safeToDelete.length > 20) {
        console.log(`  ... ve ${report.safeToDelete.length - 20} anahtar daha`);
      }
    }

    return report;
  }
}

// Çalıştır
const analyzer = new SmartTranslationAnalyzer();
analyzer.analyze().catch(console.error);
