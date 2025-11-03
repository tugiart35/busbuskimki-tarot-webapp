#!/usr/bin/env node

/**
 * 🔄 BATCH KART BİRLEŞTİRİCİ
 * 
 * output/cards/*.json dosyalarını birleştirip
 * tarot-cards.json'a kaydeder
 */

const fs = require('fs');
const path = require('path');

// ==================== KONFIGURASYON ====================
const CONFIG = {
  CARDS_DIR: path.join(__dirname, '..', 'output', 'cards'),
  TARGET_JSON: path.join(__dirname, '..', 'src', 'lib', 'data', 'tarot-cards.json'),
  TEMPLATE_JSON: path.join(__dirname, '..', 'messages', 'tr.json'),
  BACKUP_DIR: path.join(__dirname, '..', 'backups'),
};

const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(msg, color = c.reset) {
  console.log(`${color}${msg}${c.reset}`);
}

// ==================== ANA FONKSİYON ====================
function main() {
  log(`\n${'='.repeat(70)}`, c.cyan);
  log(`🔄 BATCH KART BİRLEŞTİRİCİ`, c.bright + c.cyan);
  log(`${'='.repeat(70)}\n`, c.cyan);
  
  // 1. Template'ten the-fool'u al
  log(`📖 Template yükleniyor...`, c.blue);
  const trData = JSON.parse(fs.readFileSync(CONFIG.TEMPLATE_JSON, 'utf8'));
  const templateFool = trData.blog.cards['the-fool'];
  log(`✅ Template yüklendi: the-fool\n`, c.green);
  
  // 2. Output kartlarını topla
  const allCards = { 'the-fool': templateFool };
  
  if (!fs.existsSync(CONFIG.CARDS_DIR)) {
    log(`⚠️  ${CONFIG.CARDS_DIR} bulunamadı!`, c.yellow);
    log(`💡 Önce fill-from-tr-json.js scriptini çalıştırın.\n`, c.yellow);
    process.exit(1);
  }
  
  const cardFiles = fs.readdirSync(CONFIG.CARDS_DIR).filter(f => f.endsWith('.json'));
  log(`📂 ${cardFiles.length} kart dosyası bulundu\n`, c.blue);
  
  if (cardFiles.length === 0) {
    log(`⚠️  Hiç kart dosyası yok!`, c.yellow);
    log(`💡 Önce fill-from-tr-json.js scriptini çalıştırın.\n`, c.yellow);
    process.exit(1);
  }
  
  log(`🔄 Kartlar birleştiriliyor...\n`, c.cyan);
  
  cardFiles.forEach(file => {
    const slug = file.replace('.json', '');
    const cardPath = path.join(CONFIG.CARDS_DIR, file);
    
    try {
      const cardData = JSON.parse(fs.readFileSync(cardPath, 'utf8'));
      allCards[slug] = cardData;
      log(`  ✅ ${slug}`, c.green);
    } catch (error) {
      log(`  ❌ ${slug} - Hata: ${error.message}`, c.yellow);
    }
  });
  
  // 3. Final yapı
  const finalData = [{
    blog: {
      cards: allCards
    }
  }];
  
  log(`\n💾 Kaydediliyor...`, c.blue);
  
  // 4. Backup + kaydet
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupPath = path.join(CONFIG.BACKUP_DIR, `tarot-cards-${timestamp}.json`);
  
  fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
  fs.writeFileSync(backupPath, JSON.stringify(finalData, null, 2), 'utf8');
  fs.writeFileSync(CONFIG.TARGET_JSON, JSON.stringify(finalData, null, 2), 'utf8');
  
  // 5. Rapor
  log(`\n${'='.repeat(70)}`, c.green);
  log(`✅ BİRLEŞTİRME TAMAMLANDI!`, c.bright + c.green);
  log(`${'='.repeat(70)}`, c.green);
  log(`\n📊 İSTATİSTİKLER:`, c.bright);
  log(`   📦 Toplam Kart: ${Object.keys(allCards).length}`, c.cyan);
  log(`   💾 Hedef: ${CONFIG.TARGET_JSON}`, c.blue);
  log(`   🔐 Backup: ${backupPath}`, c.blue);
  log(`\n🎉 Kartlar başarıyla birleştirildi!\n`, c.green);
}

// Hata yakalama
process.on('unhandledRejection', (error) => {
  log(`\n💥 HATA: ${error.message}`, c.yellow);
  console.error(error.stack);
  process.exit(1);
});

// Çalıştır
if (require.main === module) {
  main();
}

module.exports = { main };



