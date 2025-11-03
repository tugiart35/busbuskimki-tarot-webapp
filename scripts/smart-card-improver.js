#!/usr/bin/env node

/**
 * 🎨 Akıllı Kart İyileştirici
 * 
 * the-fool kartını TAM ŞABLON olarak kullanır
 * Diğer kartları bu şablona göre doldurur
 * Qwen ile yerel, ücretsiz, hızlı çalışır
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// ==================== KONFIGURASYON ====================
const CONFIG = {
  DATA_FILE: path.join(__dirname, '..', 'src', 'lib', 'data', 'tarot-cards.json'),
  BACKUP_DIR: path.join(__dirname, '..', 'backups'),
  LOG_DIR: path.join(__dirname, '..', 'logs'),
  
  TEMPLATE_CARD: 'the-fool', // Şablon kart
  
  TEST_MODE: true,
  MAX_CARDS: 1, // Test için sadece 1 kart
  
  QWEN_DELAY: 1000, // Qwen istekleri arası bekleme (ms)
};

// Renkler
const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

// ==================== YARDIMCI FONKSİYONLAR ====================

function log(msg, color = c.reset) {
  console.log(`${color}${msg}${c.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Qwen'e prompt gönderir
 */
async function callQwen(prompt) {
  try {
    // Prompt'u temizle ve kısalt
    const cleanPrompt = prompt
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, ' ')
      .substring(0, 6000);
    
    const command = `qwen -p "${cleanPrompt}"`;
    
    const { stdout } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024,
      timeout: 120000, // 2 dakika
    });
    
    return stdout.trim();
  } catch (error) {
    throw new Error(`Qwen hatası: ${error.message}`);
  }
}

/**
 * JSON dosyasını yükler
 */
function loadData() {
  const raw = fs.readFileSync(CONFIG.DATA_FILE, 'utf8');
  const data = JSON.parse(raw);
  
  // Yapı: [{ blog: { cards: {...} } }]
  if (Array.isArray(data) && data[0] && data[0].blog && data[0].blog.cards) {
    return data;
  }
  
  throw new Error('Beklenmeyen JSON yapısı');
}

/**
 * JSON dosyasını kaydeder
 */
function saveData(data) {
  // Backup oluştur
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupPath = path.join(CONFIG.BACKUP_DIR, `tarot-cards-${timestamp}.json`);
  
  fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');
  
  // Ana dosya
  fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  
  log(`💾 Kaydedildi! Backup: ${backupPath}`, c.green);
}

/**
 * Tüm kartları alır
 */
function getAllCards(data) {
  // Yapı: [{ blog: { cards: {...} } }]
  if (Array.isArray(data) && data[0] && data[0].blog && data[0].blog.cards) {
    return data[0].blog.cards;
  }
  
  throw new Error('Kartlar bulunamadı');
}

/**
 * İki kart arasındaki eksiklikleri bulur
 */
function findMissingFields(targetCard, templateCard, path = '') {
  const missing = [];
  
  function compare(target, template, currentPath) {
    if (template === null || template === undefined) return;
    
    // Array kontrolü
    if (Array.isArray(template)) {
      const targetLen = Array.isArray(target) ? target.length : 0;
      const templateLen = template.length;
      
      if (targetLen < templateLen) {
        missing.push({
          path: currentPath,
          type: 'array',
          current: targetLen,
          expected: templateLen,
          templateValue: template,
        });
      }
      return;
    }
    
    // Object kontrolü
    if (typeof template === 'object') {
      for (const key in template) {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        const targetValue = target ? target[key] : undefined;
        
        if (targetValue === undefined || targetValue === null || targetValue === '') {
          missing.push({
            path: newPath,
            type: typeof template[key],
            templateValue: template[key],
          });
        } else {
          compare(targetValue, template[key], newPath);
        }
      }
      return;
    }
    
    // String kontrolü
    if (typeof template === 'string') {
      const targetStr = target || '';
      const templateWords = countWords(template);
      const targetWords = countWords(targetStr);
      
      // Eğer template'de 50+ kelime varsa ve target'te 50'den az varsa
      if (templateWords >= 50 && targetWords < templateWords * 0.7) {
        missing.push({
          path: currentPath,
          type: 'string',
          current: targetWords,
          expected: templateWords,
          currentValue: targetStr,
        });
      }
    }
  }
  
  compare(targetCard, templateCard, path);
  return missing;
}

/**
 * Prompt oluşturur
 */
function generatePrompt(cardName, cardSlug, missingField, templateValue) {
  const { path: fieldPath, type } = missingField;
  
  let prompt = `Sen profesyonel bir tarot içerik yazarısın. Türkçe dilinde özgün, derinlikli içerikler üretiyorsun.

KART: ${cardName}
SLUG: ${cardSlug}
ALAN: ${fieldPath}

`;
  
  if (type === 'string') {
    const targetWords = missingField.expected || 150;
    
    prompt += `GÖREV: ${cardName} kartı için "${fieldPath}" alanını yaz.

REFERANS ÖRNEK (the-fool kartından):
"${typeof templateValue === 'string' ? templateValue.substring(0, 400) : JSON.stringify(templateValue).substring(0, 400)}..."

HEDEF: ${targetWords}+ kelime
MEVCUT: "${missingField.currentValue || 'BOŞ'}" (${missingField.current || 0} kelime)

KURALLAR:
1. Türkçe, akıcı, samimi dil
2. ${cardName} kartına ÖZEL içerik yaz
3. Okuyucuya "sen" dili ile hitap et
4. Somut örnekler ver
5. SADECE METNİ DÖNDÜR, başka açıklama ekleme

YENİ METİN:`;
  }
  
  else if (type === 'object') {
    prompt += `GÖREV: ${cardName} kartı için "${fieldPath}" objesi oluştur.

REFERANS YAPI (the-fool):
${JSON.stringify(templateValue, null, 2)}

KURALLAR:
1. ${cardName} kartına özel içerik
2. Yapıyı AYNEN koru
3. SADECE JSON döndür

JSON:`;
  }
  
  else if (type === 'array') {
    prompt += `GÖREV: ${cardName} kartı için "${fieldPath}" dizisi oluştur.

REFERANS ÖRNEKLER (the-fool):
${JSON.stringify(templateValue.slice(0, 2), null, 2)}

HEDEF SAYI: ${missingField.expected}
MEVCUT: ${missingField.current}
EKLENMESİ GEREKEN: ${missingField.expected - missingField.current}

KURALLAR:
1. ${cardName} kartına özel ${missingField.expected} öğe oluştur
2. Her öğe yapısal olarak referans ile aynı
3. SADECE JSON array döndür

JSON:`;
  }
  
  return prompt;
}

/**
 * Qwen cevabını parse eder
 */
function parseQwenResponse(response, expectedType) {
  try {
    // Eğer JSON bekliyorsak
    if (expectedType === 'object' || expectedType === 'array') {
      const jsonMatch = response.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('JSON bulunamadı');
      }
      
      let jsonStr = jsonMatch[0]
        .replace(/,\s*}/g, '}')
        .replace(/,\s*]/g, ']');
      
      return JSON.parse(jsonStr);
    }
    
    // String bekliyorsak
    return response.trim();
    
  } catch (e) {
    log(`⚠️ Parse hatası: ${e.message}`, c.yellow);
    return response;
  }
}

/**
 * Kartı şablona göre doldurur
 */
async function fillCardFromTemplate(cardName, cardSlug, targetCard, templateCard) {
  const missing = findMissingFields(targetCard, templateCard);
  
  log(`\n📊 ${cardName} için ${missing.length} eksik alan bulundu`, c.cyan);
  
  if (missing.length === 0) {
    log(`✅ Bu kart zaten tam!`, c.green);
    return targetCard;
  }
  
  // Önemli alanları önce işle
  const importantPaths = [
    'meanings.upright.general',
    'meanings.upright.love',
    'meanings.upright.career',
    'psychologist_perspective',
    'symbolism',
    'combinations',
    'affirmations',
    'daily_practices',
    'seo',
  ];
  
  const sortedMissing = missing.sort((a, b) => {
    const aIndex = importantPaths.indexOf(a.path);
    const bIndex = importantPaths.indexOf(b.path);
    if (aIndex === -1 && bIndex === -1) return 0;
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
  
  // İlk 5 alanı işle (test için)
  const toProcess = CONFIG.TEST_MODE ? sortedMissing.slice(0, 5) : sortedMissing;
  
  log(`\n🎯 ${toProcess.length} alan işlenecek:`, c.bright);
  toProcess.forEach((m, i) => {
    log(`   ${i + 1}. ${m.path} (${m.type})`, c.yellow);
  });
  
  // Kartı klonla
  const updatedCard = JSON.parse(JSON.stringify(targetCard));
  
  // Her alanı Qwen ile doldur
  for (let i = 0; i < toProcess.length; i++) {
    const field = toProcess[i];
    
    log(`\n🔧 [${i + 1}/${toProcess.length}] İşleniyor: ${field.path}`, c.cyan);
    
    try {
      // Prompt oluştur
      const prompt = generatePrompt(cardName, cardSlug, field, field.templateValue);
      
      // Qwen'e gönder
      log(`   🤖 Qwen'e gönderiliyor...`, c.blue);
      const response = await callQwen(prompt);
      
      log(`   ✅ Cevap alındı (${response.length} karakter)`, c.green);
      
      // Parse et
      const parsedValue = parseQwenResponse(response, field.type);
      
      // Kartı güncelle
      const pathParts = field.path.split('.');
      let current = updatedCard;
      
      for (let j = 0; j < pathParts.length - 1; j++) {
        if (!current[pathParts[j]]) {
          current[pathParts[j]] = {};
        }
        current = current[pathParts[j]];
      }
      
      current[pathParts[pathParts.length - 1]] = parsedValue;
      
      log(`   💾 Alan güncellendi`, c.green);
      
      // Bekleme
      await sleep(CONFIG.QWEN_DELAY);
      
    } catch (error) {
      log(`   ❌ Hata: ${error.message}`, c.red);
    }
  }
  
  return updatedCard;
}

/**
 * Ana fonksiyon
 */
async function main() {
  log(`\n${'='.repeat(70)}`, c.cyan);
  log(`🎨 AKILLI KART İYİLEŞTİRİCİ`, c.bright + c.cyan);
  log(`   the-fool şablonunu kullanarak diğer kartları doldur`, c.cyan);
  log(`${'='.repeat(70)}\n`, c.cyan);
  
  // Veriyi yükle
  const data = loadData();
  const allCards = getAllCards(data);
  
  log(`📚 ${Object.keys(allCards).length} kart bulundu`, c.bright);
  
  // Template kartı al
  const templateCard = allCards[CONFIG.TEMPLATE_CARD];
  if (!templateCard) {
    log(`❌ Template kart bulunamadı: ${CONFIG.TEMPLATE_CARD}`, c.red);
    process.exit(1);
  }
  
  log(`📋 Şablon: ${CONFIG.TEMPLATE_CARD} (${templateCard.name})`, c.green);
  
  if (CONFIG.TEST_MODE) {
    log(`\n🧪 TEST MODU: Sadece ${CONFIG.MAX_CARDS} kart işlenecek`, c.yellow);
  }
  
  // Diğer kartları işle
  const cardKeys = Object.keys(allCards).filter(k => k !== CONFIG.TEMPLATE_CARD);
  const toProcess = CONFIG.TEST_MODE ? cardKeys.slice(0, CONFIG.MAX_CARDS) : cardKeys;
  
  log(`\n🎯 İşlenecek kartlar: ${toProcess.join(', ')}\n`, c.bright);
  
  for (let i = 0; i < toProcess.length; i++) {
    const slug = toProcess[i];
    const card = allCards[slug];
    
    log(`${'─'.repeat(70)}`, c.bright);
    log(`📝 Kart ${i + 1}/${toProcess.length}: ${slug}`, c.bright + c.cyan);
    log(`   ${card.name}`, c.cyan);
    log(`${'─'.repeat(70)}`, c.bright);
    
    // Kartı doldur
    const updatedCard = await fillCardFromTemplate(
      card.name,
      slug,
      card,
      templateCard
    );
    
    // Data'ya geri yaz
    if (data[0] && data[0].blog && data[0].blog.cards) {
      data[0].blog.cards[slug] = updatedCard;
    }
    
    // Kaydet
    saveData(data);
    
    log(`\n✅ ${slug} tamamlandı!\n`, c.green);
  }
  
  log(`\n${'='.repeat(70)}`, c.green);
  log(`🎉 İŞLEM TAMAMLANDI!`, c.bright + c.green);
  log(`   ${toProcess.length} kart the-fool şablonuna göre güncellendi`, c.green);
  log(`${'='.repeat(70)}\n`, c.green);
}

// Hata yakalama
process.on('unhandledRejection', (error) => {
  log(`\n💥 HATA: ${error.message}`, c.red);
  console.error(error);
  process.exit(1);
});

// Çalıştır
if (require.main === module) {
  main().catch(error => {
    log(`\n💥 FATAL: ${error.message}`, c.red);
    console.error(error);
    process.exit(1);
  });
}

module.exports = { findMissingFields, generatePrompt };

