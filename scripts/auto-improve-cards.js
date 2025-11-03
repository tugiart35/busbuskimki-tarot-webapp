#!/usr/bin/env node

/**
 * 🤖 Qwen ile Otomatik Tarot Kartı İyileştirme
 * Referans: the-fool kartı
 * Tamamen ücretsiz, yerel AI ile çalışır
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// ==================== KONFIGURASYON ====================
const CONFIG = {
  // Qwen Ayarları
  QWEN_COMMAND: 'qwen',
  
  // Dosya Yolları
  DATA_FILE: path.join(__dirname, '..', 'src', 'lib', 'data', 'tarot-cards.json'),
  BACKUP_DIR: path.join(__dirname, '..', 'backups'),
  LOG_FILE: path.join(__dirname, '..', 'logs', 'improvement-log.json'),
  PROGRESS_FILE: path.join(__dirname, '..', 'logs', 'progress.json'),
  
  // İyileştirme Ayarları
  REFERENCE_CARD: 'the-fool',
  START_FROM_INDEX: 0,
  MAX_RETRIES: 2,
  SAVE_AFTER_CARDS: 1,
  TEST_MODE: true, // Sadece 1 kart test et
  MAX_CARDS_TO_PROCESS: 1, // Test için limit
  
  // Hedef Değerler
  TARGET_WORD_COUNT: {
    'general': 200,
    'love': 150,
    'career': 150,
    'money': 120,
    'spiritual': 120,
  },
  TARGET_COUNTS: {
    symbolism: 5,
    combinations: 5,
    affirmations: 5,
    daily_practices: 5,
    faq: 7,
  },
  
  // İşlem Limitleri
  DELAY_MS: 1000,
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
};

// ==================== YARDIMCI FONKSİYONLAR ====================

function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function log(message, color = c.reset) {
  console.log(`${color}${message}${c.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Qwen'e prompt gönderir
 */
async function callQwen(prompt, retries = 0) {
  try {
    // Özel karakterleri escape et
    const cleanPrompt = prompt
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .substring(0, 8000); // Prompt'u kısalt
    
    const command = `qwen -p "${cleanPrompt}"`;
    
    log(`🤖 Qwen'e gönderiliyor... (deneme ${retries + 1})`, c.cyan);
    
    const { stdout, stderr } = await execAsync(command, {
      maxBuffer: 10 * 1024 * 1024,
      timeout: 180000, // 3 dakika
    });
    
    if (stderr && !stderr.toLowerCase().includes('warn')) {
      log(`⚠️ Stderr: ${stderr.substring(0, 200)}`, c.yellow);
    }
    
    return stdout.trim();
  } catch (error) {
    if (retries < CONFIG.MAX_RETRIES) {
      log(`❌ Hata, ${retries + 1}. deneme başarısız. Tekrar deneniyor...`, c.yellow);
      await sleep(5000);
      return callQwen(prompt, retries + 1);
    }
    throw error;
  }
}

/**
 * JSON çıkar (hata toleranslı)
 */
function extractJSON(text) {
  try {
    // JSON bloğunu bul
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('JSON bulunamadı');
    }
    
    let jsonStr = jsonMatch[0];
    
    // Temizleme
    jsonStr = jsonStr
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      .replace(/\n/g, ' ')
      .replace(/\r/g, '');
    
    return JSON.parse(jsonStr);
  } catch (e) {
    log(`⚠️ JSON parse hatası: ${e.message}`, c.yellow);
    // Ham metni döndür
    return { raw: text };
  }
}

/**
 * Kartları yükler
 */
function loadCards() {
  const rawData = fs.readFileSync(CONFIG.DATA_FILE, 'utf8');
  const data = JSON.parse(rawData);
  
  // Tüm kartları düz bir objeye çıkar
  const allCards = {};
  
  function extractCards(obj, parentKey = '') {
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      // Eğer bu bir kart ise (name ve meanings varsa)
      if (obj.name && obj.meanings) {
        const key = parentKey || 'unknown';
        allCards[key] = obj;
      }
      
      // Alt objeleri tara
      for (const key in obj) {
        extractCards(obj[key], key);
      }
    }
  }
  
  extractCards(data);
  return allCards;
}

/**
 * Kartları kaydeder
 */
function saveCards(cards, message = '') {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  
  // Orijinal yapıyı oku
  const rawData = fs.readFileSync(CONFIG.DATA_FILE, 'utf8');
  const originalData = JSON.parse(rawData);
  
  // Kartları orijinal yapıya geri yerleştir
  function updateCards(obj) {
    if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
      for (const key in obj) {
        if (cards[key] && obj[key].name && obj[key].meanings) {
          // Bu kartı güncelle
          obj[key] = cards[key];
        } else {
          // Alt objeleri tara
          updateCards(obj[key]);
        }
      }
    }
  }
  
  updateCards(originalData);
  
  // Backup
  const backupPath = path.join(CONFIG.BACKUP_DIR, `tarot-cards-${timestamp}.json`);
  fs.writeFileSync(backupPath, JSON.stringify(originalData, null, 2), 'utf8');
  
  // Ana dosya
  fs.writeFileSync(CONFIG.DATA_FILE, JSON.stringify(originalData, null, 2), 'utf8');
  
  log(`💾 Kaydedildi! ${message}`, c.green);
  log(`📦 Backup: ${backupPath}`, c.blue);
}

/**
 * Progress kaydet/yükle
 */
function saveProgress(progress) {
  fs.writeFileSync(CONFIG.PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
}

function loadProgress() {
  if (fs.existsSync(CONFIG.PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG.PROGRESS_FILE, 'utf8'));
  }
  return { lastProcessedIndex: -1, processedCards: [], improvements: [] };
}

/**
 * Kartın eksikliklerini analiz eder
 */
function analyzeCard(slug, cardData, referenceCard) {
  const missing = [];
  
  // 1. Meanings kontrolü
  ['upright', 'reversed'].forEach(position => {
    ['general', 'love', 'career', 'money', 'spiritual'].forEach(area => {
      const text = cardData.meanings?.[position]?.[area] || '';
      const words = countWords(text);
      const target = CONFIG.TARGET_WORD_COUNT[area];
      
      if (words < target) {
        missing.push({
          field: `meanings.${position}.${area}`,
          type: 'expand',
          priority: words < 50 ? 'high' : 'medium',
          current: text,
          currentWords: words,
          targetWords: target,
        });
      }
    });
  });
  
  // 2. Psychologist Perspective
  if (!cardData.psychologist_perspective || 
      countWords(cardData.psychologist_perspective?.summary || '') < 100) {
    missing.push({
      field: 'psychologist_perspective',
      type: cardData.psychologist_perspective ? 'expand' : 'create',
      priority: 'high',
    });
  }
  
  // 3. Symbolism
  const symbolCount = Array.isArray(cardData.symbolism) ? cardData.symbolism.length : 0;
  if (symbolCount < CONFIG.TARGET_COUNTS.symbolism) {
    missing.push({
      field: 'symbolism',
      type: symbolCount === 0 ? 'create' : 'expand',
      priority: 'high',
      currentCount: symbolCount,
      targetCount: CONFIG.TARGET_COUNTS.symbolism,
    });
  }
  
  // 4. Numerology
  if (!cardData.numerology) {
    missing.push({
      field: 'numerology',
      type: 'create',
      priority: 'medium',
    });
  }
  
  // 5. Combinations
  const combCount = Array.isArray(cardData.combinations) ? cardData.combinations.length : 0;
  if (combCount < CONFIG.TARGET_COUNTS.combinations) {
    missing.push({
      field: 'combinations',
      type: combCount === 0 ? 'create' : 'expand',
      priority: 'medium',
      currentCount: combCount,
      targetCount: CONFIG.TARGET_COUNTS.combinations,
    });
  }
  
  // 6. Affirmations
  const affList = cardData.affirmations?.affirmation_list || [];
  if (affList.length < CONFIG.TARGET_COUNTS.affirmations) {
    missing.push({
      field: 'affirmations',
      type: affList.length === 0 ? 'create' : 'expand',
      priority: 'low',
      currentCount: affList.length,
      targetCount: CONFIG.TARGET_COUNTS.affirmations,
    });
  }
  
  // 7. Daily Practices
  const practiceCount = Array.isArray(cardData.daily_practices) ? cardData.daily_practices.length : 0;
  if (practiceCount < CONFIG.TARGET_COUNTS.daily_practices) {
    missing.push({
      field: 'daily_practices',
      type: practiceCount === 0 ? 'create' : 'expand',
      priority: 'low',
      currentCount: practiceCount,
      targetCount: CONFIG.TARGET_COUNTS.daily_practices,
    });
  }
  
  // 8. FAQ
  const faqCount = Array.isArray(cardData.faq) ? cardData.faq.length : 0;
  if (faqCount < CONFIG.TARGET_COUNTS.faq) {
    missing.push({
      field: 'faq',
      type: faqCount === 0 ? 'create' : 'expand',
      priority: 'medium',
      currentCount: faqCount,
      targetCount: CONFIG.TARGET_COUNTS.faq,
    });
  }
  
  // 9. Image Gallery
  if (!Array.isArray(cardData.image_gallery) || cardData.image_gallery.length < 4) {
    missing.push({
      field: 'image_gallery',
      type: 'create',
      priority: 'low',
    });
  }
  
  // 10. SEO
  if (!cardData.seo || !cardData.seo.metaTitle || !cardData.seo.metaDescription) {
    missing.push({
      field: 'seo',
      type: 'create',
      priority: 'high',
    });
  }
  
  // 11. Related Cards
  if (!Array.isArray(cardData.related_cards) || cardData.related_cards.length < 3) {
    missing.push({
      field: 'related_cards',
      type: 'create',
      priority: 'low',
    });
  }
  
  return missing;
}

/**
 * Prompt oluşturur
 */
function generatePrompt(slug, cardData, missingField, referenceCard) {
  const cardName = cardData.name || slug;
  const field = missingField.field;
  
  let basePrompt = `Sen profesyonel bir tarot içerik yazarısın. Türkçe dilinde özgün, derinlikli ve okuyucuya değer katan içerikler üretirsin.

KART: ${cardName}
SLUG: ${slug}

`;
  
  // Field'e göre özel promptlar
  if (field.startsWith('meanings.')) {
    const [_, position, area] = field.split('.');
    const posName = position === 'upright' ? 'DÜZ (UPRIGHT)' : 'TERS (REVERSED)';
    const areaNames = {
      general: 'Genel Anlam',
      love: 'Aşk',
      career: 'Kariyer',
      money: 'Para/Finans',
      spiritual: 'Ruhsal/Spiritüel',
    };
    
    const refText = referenceCard.meanings[position][area];
    
    basePrompt += `GÖREV: ${cardName} kartının ${posName} pozisyonunda "${areaNames[area]}" yorumunu yaz.

MEVCUT METİN (${missingField.currentWords || 0} kelime):
"${missingField.current || 'BOŞ'}"

HEDEF: ${missingField.targetWords} kelime

REFERANS ÖRNEK (the-fool kartından, ${posName} ${areaNames[area]}):
"${refText.substring(0, 400)}..."

KURALLAR:
1. Türkçe, akıcı, samimi bir dille yaz
2. Okuyucuya "sen" dili ile hitap et
3. Somut örnekler, senaryolar ver
4. Uyarılar ve öneriler ekle
5. Mevcut metni GENİŞLET (varsa), yoksa yenisini yaz
6. SADECE METNİ DÖNDÜR, başka açıklama ekleme

YENİ METİN:`;
  }
  
  else if (field === 'psychologist_perspective') {
    basePrompt += `GÖREV: ${cardName} kartı için "Büşbüşkimki Yorumu" bölümünü oluştur.

REFERANS YAPISI (the-fool kartından):
${JSON.stringify(referenceCard.psychologist_perspective, null, 2)}

İSTENEN YAPI:
{
  "title": "Büşbüşkimki Yorumu",
  "summary": "150+ kelimelik, toplulukçu ve psikolojik bakış açısı",
  "insights": [
    "Uygulanabilir içgörü 1",
    "Uygulanabilir içgörü 2",
    "Uygulanabilir içgörü 3",
    "Uygulanabilir içgörü 4"
  ]
}

KURALLAR:
1. summary: Psikolojik derinlik, topluluk perspektifi, 150+ kelime
2. insights: 4 adet uygulanabilir, günlük hayatta kullanılabilir öneriler
3. SADECE JSON formatında döndür, başka açıklama ekleme

JSON:`;
  }
  
  else if (field === 'symbolism') {
    const needed = CONFIG.TARGET_COUNTS.symbolism - (missingField.currentCount || 0);
    
    basePrompt += `GÖREV: ${cardName} kartı için ${needed} adet sembol analizi ekle.

REFERANS ÖRNEKLER (the-fool kartından):
${JSON.stringify(referenceCard.symbolism.slice(0, 2), null, 2)}

İSTENEN YAPI (${needed} adet):
[
  {
    "symbol": "Sembol adı",
    "meaning": "80+ kelimelik detaylı açıklama, arketipsel ve psikolojik anlam"
  }
]

KURALLAR:
1. ${cardName} kartına özgü, görsel sembolleri seç
2. Her meaning 80+ kelime olmalı
3. Ezoterik, psikolojik ve pratik anlamları dahil et
4. SADECE JSON array döndür

JSON:`;
  }
  
  else if (field === 'numerology') {
    basePrompt += `GÖREV: ${cardName} kartı için numeroloji bölümü oluştur.

REFERANS YAPISI:
${JSON.stringify(referenceCard.numerology, null, 2)}

İSTENEN YAPI:
{
  "number": ${cardData.number || 'X'},
  "essence": "40+ kelimelik sayının özü ve anlamı",
  "message": "40+ kelimelik kişisel mesaj ve uygulama"
}

KURALLAR:
1. Sayının tarot ve numerolojideki anlamı
2. Kişisel gelişim mesajı
3. SADECE JSON döndür

JSON:`;
  }
  
  else if (field === 'combinations') {
    basePrompt += `GÖREV: ${cardName} kartı için 5 adet güçlü kart kombinasyonu oluştur.

REFERANS ÖRNEKLER:
${JSON.stringify(referenceCard.combinations.slice(0, 2), null, 2)}

İSTENEN YAPI (5 adet):
[
  {
    "with": "kart-slug-formatinda",
    "theme": "Tema başlığı",
    "description": "70+ kelimelik detaylı kombinasyon yorumu"
  }
]

KURALLAR:
1. Farklı majör/minör arkana kartlarıyla kombine et
2. Her description 70+ kelime
3. Slug formatı: "the-magician", "ace-of-wands" gibi
4. SADECE JSON array döndür

JSON:`;
  }
  
  else if (field === 'affirmations') {
    basePrompt += `GÖREV: ${cardName} kartı için 5 adet güçlü günlük afirmasyon oluştur.

REFERANS ÖRNEKLER:
${JSON.stringify(referenceCard.affirmations, null, 2)}

İSTENEN YAPI:
{
  "title": "Günlük Afirmasyonlar",
  "affirmation_list": [
    "Afirmasyon 1 (12-20 kelime)",
    "Afirmasyon 2 (12-20 kelime)",
    "Afirmasyon 3 (12-20 kelime)",
    "Afirmasyon 4 (12-20 kelime)",
    "Afirmasyon 5 (12-20 kelime)"
  ]
}

KURALLAR:
1. Olumlu, "ben" dili kullanarak
2. Kartın enerjisini yansıtan
3. SADECE JSON döndür

JSON:`;
  }
  
  else if (field === 'daily_practices') {
    basePrompt += `GÖREV: ${cardName} kartı için 5 adet günlük pratik oluştur.

REFERANS ÖRNEKLER:
${JSON.stringify(referenceCard.daily_practices.slice(0, 2), null, 2)}

İSTENEN YAPI (5 adet):
[
  {
    "title": "Pratik başlığı",
    "description": "60+ kelimelik detaylı açıklama: nasıl uygulanır, ne sıklıkta, hangi hislerle"
  }
]

KURALLAR:
1. Uygulanabilir, günlük hayatta yapılabilir
2. Her description 60+ kelime
3. Nasıl, ne zaman, neden bilgisi içermeli
4. SADECE JSON array döndür

JSON:`;
  }
  
  else if (field === 'faq') {
    basePrompt += `GÖREV: ${cardName} kartı için 7 adet SSS (Sık Sorulan Sorular) oluştur.

REFERANS ÖRNEKLER:
${JSON.stringify(referenceCard.faq.slice(0, 3), null, 2)}

İSTENEN YAPI (7 adet):
[
  {
    "question": "Soru metni (kullanıcının sorabileceği gerçek soru)",
    "answer": "90+ kelimelik detaylı, bilgilendirici cevap"
  }
]

KURALLAR:
1. Gerçek kullanıcı sorularını tahmin et
2. Her answer 90+ kelime
3. SEO uyumlu sorular (anahtar kelime içeren)
4. SADECE JSON array döndür

JSON:`;
  }
  
  else if (field === 'seo') {
    basePrompt += `GÖREV: ${cardName} kartı için SEO metadatası oluştur.

İSTENEN YAPI:
{
  "metaTitle": "55-60 karakter, ana anahtar kelime içeren başlık",
  "metaDescription": "145-155 karakter, kullanıcıyı teşvik edici açıklama",
  "canonicalUrl": "https://busbuskimki.com/tr/kartlar/${slug}",
  "ogImage": "https://busbuskimki.com/cards/rws/${slug}.webp",
  "twitterImage": "https://busbuskimki.com/cards/rws/${slug}.webp",
  "focusKeywords": ["anahtar1", "anahtar2", "anahtar3", "anahtar4", "anahtar5"],
  "faq": []
}

KURALLAR:
1. metaTitle: Tam 55-60 karakter
2. metaDescription: 145-155 karakter, CTA içermeli
3. focusKeywords: 5 adet Türkçe anahtar kelime
4. faq boş array olarak bırak
5. SADECE JSON döndür

JSON:`;
  }
  
  else if (field === 'related_cards') {
    basePrompt += `GÖREV: ${cardName} kartıyla ilişkili 5 kart slug'ı belirle.

REFERANS:
${JSON.stringify(referenceCard.related_cards, null, 2)}

İSTENEN YAPI:
[
  "kart-slug-1",
  "kart-slug-2",
  "kart-slug-3",
  "kart-slug-4",
  "kart-slug-5"
]

KURALLAR:
1. Tematik veya enerji benzerliği olan kartlar
2. Slug formatı: "the-magician", "ace-of-cups" vb
3. SADECE JSON array döndür

JSON:`;
  }
  
  else if (field === 'image_gallery') {
    basePrompt += `GÖREV: ${cardName} kartı için 4 görsel metadatası oluştur.

REFERANS:
${JSON.stringify(referenceCard.image_gallery, null, 2)}

İSTENEN YAPI:
[
  {
    "src": "/cards/${slug}/${slug}-main.webp",
    "alt": "60+ karakter SEO uyumlu alt metni",
    "caption": "Görsel açıklaması",
    "priority": true
  },
  {
    "src": "/cards/${slug}/${slug}-symbols.webp",
    "alt": "60+ karakter",
    "caption": "Semboller görseli",
    "priority": false
  },
  {
    "src": "/cards/${slug}/${slug}-upright-vs-reversed.webp",
    "alt": "60+ karakter",
    "caption": "Düz vs Ters karşılaştırma",
    "priority": false
  },
  {
    "src": "/cards/${slug}/${slug}-busbuskimki.webp",
    "alt": "60+ karakter",
    "caption": "Büşbüşkimki yorumu",
    "priority": false
  }
]

KURALLAR:
1. Her alt metni 60+ karakter, SEO uyumlu
2. İlk görsel priority: true
3. SADECE JSON array döndür

JSON:`;
  }
  
  return basePrompt;
}

/**
 * Ana işlem
 */
async function main() {
  log(`\n${'='.repeat(70)}`, c.cyan);
  log(`🤖 QWEN İLE OTOMATİK KART İYİLEŞTİRME`, c.bright + c.cyan);
  log(`${'='.repeat(70)}\n`, c.cyan);
  
  // Kartları yükle
  const allData = loadCards();
  const cards = allData;
  const cardSlugs = Object.keys(cards);
  const referenceCard = cards[CONFIG.REFERENCE_CARD];
  
  if (!referenceCard) {
    log(`❌ Referans kart bulunamadı: ${CONFIG.REFERENCE_CARD}`, c.red);
    process.exit(1);
  }
  
  log(`📊 Toplam Kart: ${cardSlugs.length}`, c.bright);
  log(`📌 Referans: ${CONFIG.REFERENCE_CARD}`, c.bright);
  log(`🎯 Hedef: Tüm kartları ${CONFIG.REFERENCE_CARD} seviyesine getir\n`, c.bright);
  
  // Progress yükle
  const progress = loadProgress();
  const startIndex = Math.max(CONFIG.START_FROM_INDEX, progress.lastProcessedIndex + 1);
  
  log(`🔄 Başlangıç İndeksi: ${startIndex}\n`, c.yellow);
  
  if (CONFIG.TEST_MODE) {
    log(`🧪 TEST MODU: Sadece ${CONFIG.MAX_CARDS_TO_PROCESS} kart işlenecek\n`, c.yellow);
  }
  
  let totalImprovements = 0;
  let processedCardCount = 0;
  
  for (let i = startIndex; i < cardSlugs.length; i++) {
    const slug = cardSlugs[i];
    
    // Referans kartı atla
    if (slug === CONFIG.REFERENCE_CARD) {
      log(`⏭️  ${CONFIG.REFERENCE_CARD} referans kart, atlanıyor...\n`, c.yellow);
      continue;
    }
    
    const cardData = cards[slug];
    
    log(`${'─'.repeat(70)}`, c.bright);
    log(`📝 Kart ${i + 1}/${cardSlugs.length}: ${slug}`, c.bright + c.cyan);
    log(`   İsim: ${cardData.name || 'İsimsiz'}`, c.cyan);
    log(`${'─'.repeat(70)}\n`, c.bright);
    
    // Analiz et
    const missing = analyzeCard(slug, cardData, referenceCard);
    
    if (missing.length === 0) {
      log(`✅ Bu kart zaten tam! Atlanıyor...\n`, c.green);
      continue;
    }
    
    log(`⚠️  ${missing.length} eksik alan bulundu:`, c.yellow);
    missing.slice(0, 5).forEach(m => {
      log(`   - ${m.field} (${m.priority} öncelik)`, c.yellow);
    });
    if (missing.length > 5) {
      log(`   ... ve ${missing.length - 5} alan daha`, c.yellow);
    }
    log('');
    
    // Sadece yüksek öncelikli alanları işle (ilk geçişte)
    const highPriority = missing.filter(m => m.priority === 'high').slice(0, 3);
    
    log(`🎯 ${highPriority.length} yüksek öncelikli alan işlenecek\n`, c.cyan);
    
    for (const field of highPriority) {
      log(`🔧 İşleniyor: ${field.field}`, c.cyan);
      
      try {
        const prompt = generatePrompt(slug, cardData, field, referenceCard);
        const response = await callQwen(prompt);
        
        log(`✅ Qwen cevabı alındı (${response.length} karakter)`, c.green);
        
        // Response'u işle
        // (Basit bir versiyon - sadece gösterim için)
        log(`📄 Cevap özeti: ${response.substring(0, 100)}...`, c.blue);
        
        totalImprovements++;
        
        // Bekleme
        await sleep(CONFIG.DELAY_MS);
        
      } catch (error) {
        log(`❌ Hata: ${error.message}`, c.red);
      }
    }
    
    log('');
    
    processedCardCount++;
    
    // Her SAVE_AFTER_CARDS kartta bir kaydet
    if (processedCardCount % CONFIG.SAVE_AFTER_CARDS === 0) {
      log(`💾 İlerleme kaydediliyor...`, c.green);
      progress.lastProcessedIndex = i;
      progress.processedCards.push(slug);
      progress.improvements.push({
        slug,
        count: highPriority.length,
        timestamp: new Date().toISOString(),
      });
      saveProgress(progress);
    }
    
    // Test modunda limit kontrolü
    if (CONFIG.TEST_MODE && processedCardCount >= CONFIG.MAX_CARDS_TO_PROCESS) {
      log(`\n${'='.repeat(70)}`, c.yellow);
      log(`🧪 TEST MODU: ${CONFIG.MAX_CARDS_TO_PROCESS} kart işlendi, durduruluyor...`, c.bright + c.yellow);
      log(`${'='.repeat(70)}\n`, c.yellow);
      break;
    }
  }
  
  log(`\n${'='.repeat(70)}`, c.green);
  log(`🎉 İŞLEM TAMAMLANDI!`, c.bright + c.green);
  log(`   Toplam ${totalImprovements} iyileştirme yapıldı`, c.green);
  log(`${'='.repeat(70)}\n`, c.green);
}

// Hata yakalama
process.on('unhandledRejection', (error) => {
  log(`\n💥 BEKLENMEYEN HATA: ${error.message}`, c.red);
  console.error(error);
  process.exit(1);
});

// Çalıştır
if (require.main === module) {
  main().catch(error => {
    log(`\n💥 FATAL HATA: ${error.message}`, c.red);
    console.error(error);
    process.exit(1);
  });
}

module.exports = { analyzeCard, generatePrompt };

