// Daha detaylı analiz için gelişmiş versiyon
const fs = require('fs');
const path = require('path');

class AdvancedTranslationAnalyzer {
  constructor() {
    this.stats = {
      totalKeysInTr: 0,
      totalKeysInEn: 0,
      totalKeysInSr: 0,
      usedKeys: new Set(),
      unusedKeys: new Set(),
      missingInEn: new Set(),
      missingInSr: new Set(),
      dynamicKeys: new Set(),
    };
  }

  // Stream ile büyük JSON dosyalarını oku
  async analyzeWithStream() {
    const readline = require('readline');

    // Her satırı oku ve analiz et
    console.log('🔄 Büyük dosyalar için stream analizi...');

    // Basit satır sayısı sayma
    return new Promise(resolve => {
      const stream = fs.createReadStream('messages/tr.json');
      const rl = readline.createInterface({ input: stream });

      let lineCount = 0;
      let keyPattern = /"([^"]+)":\s*"[^"]*"/g;

      rl.on('line', line => {
        lineCount++;
        const matches = line.matchAll(keyPattern);
        for (const match of matches) {
          this.stats.totalKeysInTr++;
        }
      });

      rl.on('close', () => {
        console.log(`✅ ${lineCount} satır işlendi`);
        console.log(
          `📊 Yaklaşık ${this.stats.totalKeysInTr} anahtar tespit edildi`
        );
        resolve();
      });
    });
  }

  // Dinamik anahtar kullanımlarını bul
  findDynamicUsages(content) {
    const dynamicPatterns = [
      /t\(\$\{([^}]+)\}/g,
      /t\(`\$\{([^}]+)\}/g,
      /\[([^\]]+)\]\s*:\s*t\(/g,
    ];

    dynamicPatterns.forEach(pattern => {
      const matches = content.matchAll(pattern);
      for (const match of matches) {
        this.stats.dynamicKeys.add(match[1]);
      }
    });
  }
}

// Çalıştır
const advanced = new AdvancedTranslationAnalyzer();
advanced.analyzeWithStream();
