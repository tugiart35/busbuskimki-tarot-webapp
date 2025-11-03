#!/usr/bin/env node

/**
 * 🎯 TR.JSON Şablonlu Kart Doldurucu
 * 
 * messages/tr.json'daki UZUN the-fool'u şablon kullanır
 * tarot-cards.json'daki kartları doldurur
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const { buildSystemPrompt } = require('./system-prompts.js');

const execAsync = promisify(exec);

// ==================== KONFIGURASYON ====================
const CONFIG = {
  // Dosya yolları
  TR_JSON: path.join(__dirname, '..', 'messages', 'tr.json'),
  TARGET_JSON: path.join(__dirname, '..', 'src', 'lib', 'data', 'tarot-cards.json'),
  BACKUP_DIR: path.join(__dirname, '..', 'backups'),
  LOG_DIR: path.join(__dirname, '..', 'logs'),
  OUTPUT_DIR: path.join(__dirname, '..', 'output', 'cards'), // BATCH DOSYA SİSTEMİ
  
  // Şablon
  TEMPLATE_CARD_SLUG: 'the-fool',
  TEMPLATE_SOURCE: 'tarot-cards', // 'tr-json' veya 'tarot-cards'
  TEMPLATE_PATH: 'blog.cards.the-fool', // messages/tr.json içindeki yol
  
  // Test/Çalışma Modu
  TEST_MODE: true, // TEST: nine-of-wands için test
  MAX_CARDS: 1, // Sadece 1 kart
  SKIP_CARDS: ['the-fool'], // the-fool zaten tamam
  TEST_SPECIFIC_CARD: 'nine-of-wands', // Belirli bir kartı test et
  
  // Ollama
  OLLAMA_DELAY: 2000, // 2 saniye bekleme
  
  // Progress
  PROGRESS_FILE: path.join(__dirname, '..', 'logs', 'fill-progress.json'),
};

const c = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// ==================== FONKSİYONLAR ====================

function log(msg, color = c.reset) {
  console.log(`${color}${msg}${c.reset}`);
}

/**
 * Progress bar gösterir
 */
function showProgress(current, total, cardName) {
  const percentage = Math.floor((current / total) * 100);
  const barLength = 40;
  const filledLength = Math.floor((percentage / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  
  process.stdout.write(`\r${c.cyan}[${bar}] ${percentage}% - ${current}/${total} - ${cardName}${c.reset}`);
}

/**
 * Progress bar temizle
 */
function clearProgress() {
  process.stdout.write('\r' + ' '.repeat(100) + '\r');
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function countWords(text) {
  if (!text || typeof text !== 'string') return 0;
  return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Nested path'ten değer al (örn: 'context.mythology')
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Nested path'e değer set et (örn: 'context.mythology')
 */
function setNestedValue(obj, path, value) {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

/**
 * Şablon kartı yükler (tr.json veya tarot-cards.json'dan)
 */
function loadTemplateCard() {
  try {
    let data;
    
    if (CONFIG.TEMPLATE_SOURCE === 'tarot-cards') {
      // tarot-cards.json'dan yükle
      log(`   Kaynak: tarot-cards.json`, c.blue);
      delete require.cache[require.resolve(CONFIG.TARGET_JSON)];
      data = require(CONFIG.TARGET_JSON);
      
      if (data[0]?.blog?.cards?.['the-fool']) {
        return data[0].blog.cards['the-fool'];
      }
    } else {
      // tr.json'dan yükle
      log(`   Kaynak: messages/tr.json`, c.blue);
      delete require.cache[require.resolve(CONFIG.TR_JSON)];
      data = require(CONFIG.TR_JSON);
      
      if (data.blog && data.blog.cards && data.blog.cards['the-fool']) {
        return data.blog.cards['the-fool'];
      }
    }
    
    throw new Error('Template kart bulunamadı: the-fool');
  } catch (error) {
    log(`❌ Template yükleme hatası: ${error.message}`, c.red);
    throw error;
  }
}

/**
 * Target JSON yükler
 */
function loadTargetData() {
  const raw = fs.readFileSync(CONFIG.TARGET_JSON, 'utf8');
  return JSON.parse(raw);
}

/**
 * Target JSON kaydeder (Kullanılmıyor - Batch sistemi için tutuldu)
 */
function saveTargetData(data) {
  const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
  const backupPath = path.join(CONFIG.BACKUP_DIR, `tarot-cards-${timestamp}.json`);
  
  fs.mkdirSync(CONFIG.BACKUP_DIR, { recursive: true });
  fs.writeFileSync(backupPath, JSON.stringify(data, null, 2), 'utf8');
  fs.writeFileSync(CONFIG.TARGET_JSON, JSON.stringify(data, null, 2), 'utf8');
  
  log(`💾 Kaydedildi! Backup: ${backupPath}`, c.green);
}

/**
 * Kartı ayrı JSON dosyasına kaydeder (BATCH SİSTEM)
 */
function saveCardToFile(slug, cardData) {
  fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });
  const filePath = path.join(CONFIG.OUTPUT_DIR, `${slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(cardData, null, 2), 'utf8');
  log(`💾 Kart dosyası kaydedildi: ${slug}.json`, c.green);
  return filePath;
}

/**
 * Ollama'ya prompt gönderir (Qwen 2.5) ve system prompt kullanır
 */
async function callQwen(prompt, taskType = 'meanings') {
  const systemPrompt = buildSystemPrompt(taskType, true);
  try {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:7b', // 7B model (14B çok büyük)
        system: systemPrompt,
        prompt: prompt,
        stream: false,
        options: {
          temperature: 0.3, // DÜŞÜK: Tutarlı çıktı
          num_predict: 2500, // KISALTILDI: Uzun metinler için
          top_p: 0.7, // DÜŞÜK: Odaklı cevaplar
          repeat_penalty: 1.2, // YENİ: Tekrarları engellee
        }
      })
    });
    const data = await response.json();
    return (data && data.response) ? data.response : '';
  } catch (error) {
    throw new Error(`Ollama hatası: ${error.message}`);
  }
}

/**
 * Eksik alanları tespit eder
 */
function findMissingFields(targetCard, templateCard) {
  const missing = [];
  
  // Ana alanları kontrol et - ORNEKJSON.MD'DEKİ TÜM ALANLAR
  const checkFields = [
    { path: 'name', type: 'string', minWords: 8 },
    { path: 'short_description', type: 'string', minWords: 100 },
    { path: 'psychologist_perspective', type: 'object' },
    { path: 'symbolism', type: 'array', minLength: 5 },
    { path: 'numerology', type: 'object' },
    { path: 'context.mythology', type: 'string', minWords: 80 },
    { path: 'context.history', type: 'string', minWords: 80 },
    { path: 'context.celtic_cross.future', type: 'string', minWords: 40 },
    { path: 'context.celtic_cross.hidden_influences', type: 'string', minWords: 40 },
    { path: 'image_gallery', type: 'array', minLength: 4 },
    { path: 'combinations', type: 'array', minLength: 5 },
    { path: 'affirmations', type: 'object' },
    { path: 'daily_practices', type: 'array', minLength: 5 },
    { path: 'faq', type: 'array', minLength: 7 },
    { path: 'related_cards', type: 'array', minLength: 5 },
    { path: 'imageUrl', type: 'string' },
    { path: 'seo', type: 'object' },
  ];
  
  checkFields.forEach(field => {
    const targetValue = getNestedValue(targetCard, field.path);
    const templateValue = getNestedValue(templateCard, field.path);
    
    if (!templateValue) return; // Şablonda yoksa atla
    
    if (!targetValue) {
      missing.push({
        path: field.path,
        type: field.type,
        reason: 'Alan yok',
        templateValue: templateValue,
      });
    } else if (field.type === 'array' && field.minLength) {
      if (targetValue.length < field.minLength) {
        missing.push({
          path: field.path,
          type: field.type,
          reason: `Array çok kısa: ${targetValue.length} < ${field.minLength}`,
          current: targetValue,
          templateValue: templateValue,
        });
      }
    } else if (field.type === 'string' && field.minWords) {
      const wordCount = countWords(targetValue);
      if (wordCount < field.minWords) {
        missing.push({
          path: field.path,
          type: field.type,
          reason: `Çok kısa: ${wordCount}w < ${field.minWords}w`,
          current: targetValue,
          currentWords: wordCount,
          targetWords: field.minWords,
          templateValue: templateValue,
        });
      }
    }
  });
  
  // Meanings alanlarını kontrol et
  ['upright', 'reversed'].forEach(position => {
    ['general', 'love', 'career', 'money', 'spiritual'].forEach(area => {
      const targetText = targetCard.meanings?.[position]?.[area] || '';
      const templateText = templateCard.meanings?.[position]?.[area] || '';
      
      const targetWords = countWords(targetText);
      const templateWords = countWords(templateText);
      
      if (templateWords > 50 && targetWords < templateWords * 0.5) {
        missing.push({
          path: `meanings.${position}.${area}`,
          type: 'string',
          reason: `Çok kısa: ${targetWords}w < ${templateWords}w`,
          current: targetText,
          currentWords: targetWords,
          targetWords: templateWords,
          templateValue: templateText,
        });
      }
    });
  });
  
  return missing;
}

/**
 * Prompt oluşturur
 */
function generatePrompt(cardName, cardSlug, field, templateValue) {
  const { path: fieldPath, type } = field;
  
  // Task type belirleme - YENİ ALANLAR DAHİL
  let taskType = 'meanings';
  if (fieldPath.startsWith('meanings')) taskType = 'meanings';
  else if (fieldPath === 'name') taskType = 'name';
  else if (fieldPath === 'short_description') taskType = 'short_description';
  else if (fieldPath === 'psychologist_perspective') taskType = 'psychologist';
  else if (fieldPath === 'symbolism') taskType = 'symbolism';
  else if (fieldPath === 'numerology') taskType = 'numerology';
  else if (fieldPath === 'context.mythology') taskType = 'context_mythology';
  else if (fieldPath === 'context.history') taskType = 'context_history';
  else if (fieldPath.startsWith('context.celtic_cross')) taskType = 'celtic_cross';
  else if (fieldPath === 'combinations') taskType = 'combinations';
  else if (fieldPath === 'affirmations') taskType = 'affirmations';
  else if (fieldPath === 'daily_practices') taskType = 'daily_practices';
  else if (fieldPath === 'faq') taskType = 'faq';
  else if (fieldPath === 'related_cards') taskType = 'faq'; // Basit array, genel task
  else if (fieldPath === 'image_gallery') taskType = 'faq'; // Basit array, genel task
  else if (fieldPath === 'seo') taskType = 'seo';
  
  let prompt = `Sen Büşbüşkimki web sitesi için içerik yazıyorsun. Büşbüşkimki, 30'lu yaşlarında profesyonel bir tarot ve numeroloji danışmanı, şifacı ve modern spiritüel rehber olan Türk bir kadındır.

MARKA KİMLİĞİ:
- Şifacı ve modern yaklaşım
- Tarot geleneğine saygılı ama çağdaş
- Danışmanlık odaklı, destekleyici ton
- Türk kültürü ve diliyle uyumlu

KART: ${cardName}
SLUG: ${cardSlug}
ALAN: ${fieldPath}

ÖNEMLİ KURALLAR:
❌ İngilizce kelime kullanma (upright, reversed gibi)
❌ Absürt veya kart anlamına uymayan yorumlar yapma
✅ Klasik tarot anlamlarına sadık kal
✅ Modern, şifacı, destekleyici dil kullan
✅ Türk okuyucuya hitap et ("sen" dili)
✅ Somut, uygulanabilir örnekler ver

`;
  
  // Meanings alanları
  if (fieldPath.startsWith('meanings.')) {
    const [_, position, area] = fieldPath.split('.');
    const posName = position === 'upright' ? 'DÜZ' : 'TERS';
    
    prompt += `GÖREV: ${cardName} kartının ${posName} pozisyonunda "${area}" yorumunu yaz.

HEDEF: ${field.targetWords}+ kelime

REFERANS ÖRNEK (the-fool kartından, ${field.targetWords} kelime):
"${typeof templateValue === 'string' ? templateValue.substring(0, 500) : ''}..."

KURALLAR:
1. ${cardName} kartına ÖZEL, özgün içerik
2. Türkçe, akıcı, samimi ve şifacı dil - ASLA İNGİLİZCE kelime kullanma
3. Okuyucuya "sen" ile hitap et
4. Somut örnek senaryolar ekle absürt hikayeler senaryolar olmasın. tarot kültürüne uygun ve gerçek olmalı
5. ${field.targetWords}+ kelime yaz
6. "(The High Priestess), upright, reversed .etc" gibi İngilizce terimler YASAK
7. SADECE METNİ DÖNDÜR

YENİ METİN:`;
  }
  
  // Psychologist Perspective
  else if (fieldPath === 'psychologist_perspective') {
    prompt += `GÖREV: ${cardName} kartı için "Büşbüşkimki Yorumu" bölümünü oluştur.

BÜŞBÜŞKIMKI KİMDİR?
30'lu yaşlarında profesyonel tarot ve numeroloji danışmanı, şifacı ve modern spiritüel rehber. Türk kadınına ve erkeklerine danışmanlık veren, psikolojik derinliği tarot bilgeliğiyle birleştiren bir uzman.

REFERANS ÖRNEK (Joker kartı):
${JSON.stringify(templateValue, null, 2).substring(0, 800)}

YAPI:
{
  "title": "Büşbüşkimki Yorumu",
  "summary": "150+ kelime",
  "insights": ["içgörü 1", "içgörü 2", "içgörü 3", "içgörü 4"]
}

KURALLAR:
1. ${cardName} kartına özel, psikolojik derinlikli yorum
2. summary: Kartın psikolojik ve topluluksal yansıması, 150+ kelime
3. insights: Günlük hayatta uygulanabilir 4 öğüt (her biri pratik)
4. Tarot geleneğine sadık ama çağdaş dil
5. TAMAMEN TÜRKÇE - absürt veya klişe yorumlardan kaçın
6. SADECE JSON döndür

JSON:`;
  }
  
  // Symbolism
  else if (fieldPath === 'symbolism') {
    prompt += `GÖREV: ${cardName} kartı için 5 sembol analizi oluştur.

REFERANS ÖRNEKLER (Joker kartından):
${JSON.stringify(templateValue.slice(0, 2), null, 2)}

${cardName} KARTININ GERÇEK SEMBOLLERİ:
Rider-Waite veya klasik tarot destelerinde ${cardName} kartında görünen gerçek sembolleri kullan:
- Kartın görselindeki figürler, nesneler, renkler
- Geleneksel tarot literatüründeki semboller
- ABSÜRT veya uydurma semboller ekleme

KURALLAR:
1. ${cardName} kartının GERÇEK klasik tarot sembollerini seç
2. Her sembol açıklaması 80+ kelime, derinlikli
3. Ezoterik + psikolojik + pratik anlam ver
4. 5 adet anlamlı sembol
5. TAMAMEN TÜRKÇE - İngilizce YASAK
6. Büşbüşkimki'nin şifacı ve modern yorumunu yansıt
7. SADECE JSON array döndür

JSON:`;
  }
  
  // Numerology
  else if (fieldPath === 'numerology') {
    prompt += `GÖREV: ${cardName} kartı için numeroloji oluştur.

REFERANS:
${JSON.stringify(templateValue, null, 2)}

KURALLAR:
1. Kartın sayısına göre numeroloji
2. essence: 50+ kelime
3. message: 40+ kelime
4. TAMAMEN TÜRKÇE - İngilizce YASAK
5. SADECE JSON döndür

JSON:`;
  }
  
  // Combinations
  else if (fieldPath === 'combinations') {
    prompt += `GÖREV: ${cardName} kartı için 5 anlamlı kart kombinasyonu oluştur.

REFERANS ÖRNEKLER (Joker kartından):
${JSON.stringify(templateValue.slice(0, 2), null, 2)}

TAROT KOMBİNASYON KURALLARI:
- ${cardName} ile enerji uyumu olan kartlar seç
- Klasik tarot yorumlarına uy (Arthur Edward Waite, Joan Bunning)
- Hem Majör hem Minör Arkana'dan seç
- Kombinasyonlar gerçek tarot açılımlarında anlamlı olmalı

BÜŞBÜŞKIMKI YAKLAŞIMI:
- Modern, şifacı dil kullan
- Danışana pratik rehberlik sun
- Psikolojik derinlik kat

KURALLAR:
1. 5 farklı kart ile ANLAMLI kombinasyon
2. Her description 70+ kelime, derin ve pratik
3. Slug formatı: "the-magician", "ace-of-cups" gibi
4. TAMAMEN TÜRKÇE - İngilizce YASAK
5. Absürt kombinasyonlar yapma
6. SADECE JSON array döndür

JSON:`;
  }
  
  // Affirmations
  else if (fieldPath === 'affirmations') {
    prompt += `GÖREV: ${cardName} kartı için günlük afirmasyonlar oluştur.

REFERANS (Joker kartından):
${JSON.stringify(templateValue, null, 2)}

BÜŞBÜŞKIMKI AFIRASYON TARZI:
- Güçlendirici ama gerçekçi
- ${cardName} kartının enerjisini yansıtan
- Günlük hayatta kullanılabilir
- "Ben" dili ile, kişiyi merkeze alan
- Şifacı ve destekleyici ton

KURALLAR:
1. 5 güçlü, ${cardName} kartına özel afirmasyon
2. Her biri 12-20 kelime
3. Olumlu, güçlendirici ama abartısız
4. TAMAMEN TÜRKÇE - İngilizce YASAK
5. SADECE JSON döndür

JSON:`;
  }
  
  // Daily Practices
  else if (fieldPath === 'daily_practices') {
    prompt += `GÖREV: ${cardName} kartı için 5 günlük pratik oluştur.

REFERANS ÖRNEKLER (Joker kartından):
${JSON.stringify(templateValue.slice(0, 2), null, 2)}

BÜŞBÜŞKIMKI GÜNLÜKPRATİK TARZI:
- ${cardName} kartının enerjisini günlük hayata entegre eden
- Danışanların kolayca uygulayabileceği
- Şifacı ve topraklayıcı
- Nefes çalışması, günlük yazma, bilinçli farkındalık gibi
- Modern spiritüel pratikler

KURALLAR:
1. 5 uygulanabilir, ${cardName} enerjisiyle uyumlu pratik
2. Her description 60+ kelime: Nasıl, ne zaman, neden
3. Gerçekçi ve hayata geçirilebilir
4. TAMAMEN TÜRKÇE - İngilizce YASAK
5. Absürt veya garip ritüeller önerme
6. SADECE JSON array döndür

JSON:`;
  }
  
  // Name (Kart başlığı)
  else if (fieldPath === 'name') {
    prompt += `GÖREV: ${cardName} kartı için SEO dostu tam başlık oluştur.

REFERANS ÖRNEK (Joker kartı):
"${templateValue}"

KURALLAR:
1. 60-80 karakter
2. Kart ismi + "Tarot Kartı Anlamı" + kısa çekici ek
3. Örnek: "${cardName} Tarot Kartı Anlamı ve [Özel Vurgu]"
4. TAMAMEN TÜRKÇE - İngilizce YASAK
5. SADECE başlığı döndür, başka açıklama ekleme

BAŞLIK:`;
  }
  
  // Short Description
  else if (fieldPath === 'short_description') {
    prompt += `GÖREV: ${cardName} kartı için kısa açıklama (150-200 kelime).

REFERANS ÖRNEK (Joker kartı):
"${typeof templateValue === 'string' ? templateValue.substring(0, 400) : ''}..."

KURALLAR:
1. 150-200 kelime arası
2. Kartın özünü, düz/ters anlamları, aşk/kariyer/spiritüel konuları kapsa
3. Okuyucuyu içeriğe çeken, samimi ton
4. TAMAMEN TÜRKÇE - İngilizce YASAK
5. SADECE paragraf metni döndür

AÇIKLAMA:`;
  }
  
  // Context: Mythology
  else if (fieldPath === 'context.mythology') {
    prompt += `GÖREV: ${cardName} kartı için mitolojik kökenler ve arketipsel bağlantılar (80+ kelime).

REFERANS ÖRNEK (Joker kartı):
"${typeof templateValue === 'string' ? templateValue.substring(0, 400) : ''}..."

KURALLAR:
1. 80+ kelime
2. Antik mitolojideki (Yunan, Roma, Mısır, Kelt) ilgili tanrılar, kahramanlar
3. Tarot geleneğindeki sembolik bağlantılar (Kabala, Hermetik gelenek)
4. Akademik ama anlaşılır dil
5. TAMAMEN TÜRKÇE - İngilizce YASAK
6. SADECE metin döndür

METİN:`;
  }
  
  // Context: History
  else if (fieldPath === 'context.history') {
    prompt += `GÖREV: ${cardName} kartı için tarihsel gelişim (80+ kelime).

REFERANS ÖRNEK (Joker kartı):
"${typeof templateValue === 'string' ? templateValue.substring(0, 400) : ''}..."

KURALLAR:
1. 80+ kelime
2. 15. yüzyıl İtalya'dan günümüze kartın evrimi
3. Farklı destelerdeki (Marseille, Rider-Waite, modern) temsili
4. Okültist yorumlar (18-19. yüzyıl)
5. TAMAMEN TÜRKÇE - İngilizce YASAK
6. SADECE metin döndür

METİN:`;
  }
  
  // Celtic Cross Positions
  else if (fieldPath.startsWith('context.celtic_cross')) {
    const position = fieldPath.split('.').pop(); // future veya hidden_influences
    const posName = position === 'future' ? 'Gelecek' : 'Gizli Etkilenimler';
    
    prompt += `GÖREV: ${cardName} kartı Keltik Haç açılımında "${posName}" pozisyonunda ne anlama gelir? (60+ kelime)

REFERANS ÖRNEK (Joker kartı):
"${typeof templateValue === 'string' ? templateValue.substring(0, 300) : ''}..."

KURALLAR:
1. 60+ kelime
2. Bu pozisyondaki özel anlamı açıkla
3. Pratik, yorumlanabilir rehberlik
4. TAMAMEN TÜRKÇE - İngilizce YASAK
5. SADECE metin döndür

METİN:`;
  }
  
  // FAQ
  else if (fieldPath === 'faq') {
    prompt += `GÖREV: ${cardName} kartı için 7 Sıkça Sorulan Soru (FAQ) oluştur.

REFERANS ÖRNEK (Joker kartından 2 soru):
${JSON.stringify(Array.isArray(templateValue) ? templateValue.slice(0, 2) : [], null, 2)}

KURALLAR:
1. 7 adet soru-cevap
2. Sorular: Doğal, arama motorunda aranan, pratik
3. Cevaplar: 40-60 kelime, net, öğretici
4. Örnek sorular: "${cardName} kartı düz geldiğinde ne anlama gelir?", "${cardName} kartı aşk açılımında ne söyler?" vb.
5. TAMAMEN TÜRKÇE - İngilizce YASAK
   ❌ ASLA: "The High Priestess kartı", "upright", "reversed"
   ✅ SADECE: "${cardName} kartı", "düz", "ters"
6. SADECE JSON array döndür

ÖNEMLİ JSON FORMAT:
- Escaped quote KULLANMA (backslash kullanma)
- Tek tırnak yerine çift tırnak
- Temiz JSON array formatı

DOĞRU FORMAT ÖRNEĞİ:
[
  {
    "question": "${cardName} kartı düz geldiğinde ne anlama gelir?",
    "answer": "Cevap metni buraya gelir..."
  },
  {
    "question": "${cardName} kartı aşk açılımında ne söyler?",
    "answer": "Cevap metni buraya gelir..."
  }
]

JSON:`;
  }
  
  // related_cards
  else if (fieldPath === 'related_cards') {
    prompt += `GÖREV: ${cardName} kartı ile ilişkili 5 kart slug'ı belirle.

REFERANS ÖRNEK (Joker kartı):
${JSON.stringify(templateValue, null, 2)}

KURALLAR:
1. 5 adet kart slug'ı (string array)
2. Slug formatı: "the-magician", "ace-of-cups", "the-lovers" gibi
3. Combinations alanındaki kartlardan seçebilirsin
4. SADECE slug dizisi döndür, açıklama ekleme
5. SADECE JSON array döndür: ["slug-1", "slug-2", ...]

JSON:`;
  }
  
  // image_gallery
  else if (fieldPath === 'image_gallery') {
    prompt += `GÖREV: ${cardName} kartı için 4 görsel galerisi entry'si oluştur.

REFERANS ÖRNEK (Joker kartından 2 görsel):
${JSON.stringify(Array.isArray(templateValue) ? templateValue.slice(0, 2) : [], null, 2)}

KURALLAR:
1. 4 adet görsel entry'si
2. Her entry: {"src": "...", "alt": "...", "caption": "...", "priority": boolean}
3. src: "/cards/${cardSlug}/${cardSlug}-main.webp" formatında
4. alt ve caption: ${cardName} kartı ile ilgili, TÜRKÇE
5. İlk görsel priority: true, diğerleri false
6. SADECE JSON array döndür

JSON:`;
  }
  
  // SEO
  else if (fieldPath === 'seo') {
    prompt += `GÖREV: ${cardName} kartı için SEO metadatası oluştur.

REFERANS:
${JSON.stringify(templateValue, null, 2).substring(0, 600)}

KURALLAR:
1. metaTitle: 60-70 karakter, TÜRKÇE (Google optimal)
2. metaDescription: 150-160 karakter, TÜRKÇE (Google optimal)
3. 5 focus keyword (Türkçe, ASLA İngilizce)
   ❌ YASAK: "the high priestess", "upright"
   ✅ DOĞRU: "başrahibe kartı", "düz pozisyon"
4. 7 FAQ (Türkçe, kart ismi Türkçe)
5. İngilizce kelime YASAK
6. SADECE JSON döndür

JSON:`;
  }
  
  return { prompt, taskType };
}

/**
 * LLM çıktısını temizler (Japonca, Markdown, İngilizce vb.)
 */
function cleanLLMOutput(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Tüm major arcana isimlerini çevir (AGRESİF)
  const cardTranslations = {
    'The Fool': 'Deli',
    'The Magician': 'Büyücü',
    'The High Priestess': 'Başrahibe',
    'The Empress': 'İmparatoriçe',
    'The Emperor': 'İmparator',
    'The Hierophant': 'Aziz',
    'The Lovers': 'Aşıklar',
    'The Chariot': 'Savaş Arabası',
    'Strength': 'Güç',
    'The Hermit': 'Ermiş',
    'Wheel of Fortune': 'Kader Çarkı',
    'Justice': 'Adalet',
    'The Hanged Man': 'Asılan Adam',
    'Death': 'Ölüm',
    'Temperance': 'Denge',
    'The Devil': 'Şeytan',
    'The Tower': 'Kule',
    'The Star': 'Yıldız',
    'The Moon': 'Ay',
    'The Sun': 'Güneş',
    'Judgement': 'Mahkeme',
    'The World': 'Dünya'
  };
  
  // Suit çevirileri
  const suitTranslations = {
    'clubs': 'asalar',
    'Clubs': 'Asalar',
    'cups': 'kupalar',
    'Cups': 'Kupalar',
    'swords': 'kılıçlar',
    'Swords': 'Kılıçlar',
    'pentacles': 'tılsımlar',
    'Pentacles': 'Tılsımlar',
    'wands': 'asalar',
    'Wands': 'Asalar'
  };
  
  // İngilizce terim çevirileri
  const termTranslations = {
    'inner strength': 'içsel güç',
    'Inner strength': 'İçsel güç',
    'Inner Strength': 'İçsel Güç',
    "energy'si": 'enerjisi',
    "energy's": 'enerjinin',
    'routine': 'rutin',
    'Routine': 'Rutin'
  };
  
  // Tüm çevirileri uygula
  Object.entries({...cardTranslations, ...suitTranslations, ...termTranslations}).forEach(([en, tr]) => {
    text = text.replace(new RegExp(en, 'g'), tr);
  });
  
  return text
    // İngilizce parantezli ifadeleri tamamen kaldır
    .replace(/\s*\(upright\)\s*/gi, ' ')
    .replace(/\s*\(reversed\)\s*/gi, ' ')
    .replace(/\s*\(düz\)\s*/gi, ' ')
    .replace(/\s*\(ters\)\s*/gi, ' ')
    
    // upright/reversed terimleri
    .replace(/\bupright\b/gi, 'düz')
    .replace(/\breversed\b/gi, 'ters')
    
    // Markdown başlıkları temizle
    .replace(/^####\s+/gm, '')
    .replace(/^###\s+/gm, '')
    .replace(/^##\s+/gm, '')
    .replace(/^#\s+/gm, '')
    
    // Markdown bold/italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    
    // Markdown liste işaretleri
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    
    // Japonca/Çince karakterler (CJK Unified + Ek)
    .replace(/[\u4E00-\u9FFF]/g, '')
    .replace(/[\u3400-\u4DBF]/g, '') // CJK Extension A
    .replace(/[\u20000-\u2A6DF]/g, '') // CJK Extension B
    // Hiragana/Katakana
    .replace(/[\u3040-\u309F\u30A0-\u30FF]/g, '')
    // Arapça
    .replace(/[\u0600-\u06FF]/g, '')
    .replace(/[\u0750-\u077F]/g, '') // Arabic Supplement
    // Kiril (Rusça + Ukraynaca)
    .replace(/[\u0400-\u04FF]/g, '')
    .replace(/[\u0500-\u052F]/g, '') // Cyrillic Supplement
    
    // Çoklu boşlukları düzelt
    .replace(/\s\s+/g, ' ')
    .replace(/\\n\\n+/g, ' ')
    .replace(/\n\n\n+/g, '\n\n')
    
    .trim();
}

/**
 * JSON parse (hata toleranslı ve agresif)
 */
function parseJSON(text) {
  try {
    // Escaped quotes'ları düzelt
    text = text.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    
    // JSON bloğunu bul
    const jsonMatch = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) return null;
    
    let jsonStr = jsonMatch[0]
      // Trailing comma'ları temizle
      .replace(/,\s*}/g, '}')
      .replace(/,\s*]/g, ']')
      // Çoklu virgüller
      .replace(/,,+/g, ',')
      // Tek tırnak yerine çift tırnak (JSON standardı)
      .replace(/'/g, '"')
      // Bozuk property isimleri düzelt (örn: description: yerine "description":)
      .replace(/(\w+):/g, '"$1":')
      // Çift quote'ları normalize et
      .replace(/""+/g, '"');
    
    return JSON.parse(jsonStr);
  } catch (e) {
    log(`⚠️ JSON parse hatası: ${e.message}`, c.yellow);
    
    // İkinci deneme: Sadece array/object yapısını al
    try {
      const cleaned = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .replace(/,\s*([}\]])/g, '$1') // Son virgüller
        .trim();
      return JSON.parse(cleaned);
    } catch (e2) {
      // Üçüncü deneme: Basit repair
      try {
        // Array ise içeriği ayır ve tekrar birleştir
        if (text.trim().startsWith('[')) {
          const items = text.match(/\{[^}]+\}/g);
          if (items && items.length > 0) {
            return items.map(item => {
              try {
                return JSON.parse(item);
              } catch {
                return null;
              }
            }).filter(Boolean);
          }
        }
      } catch (e3) {
        return null;
      }
      return null;
    }
  }
}

/**
 * Kart içeriğini doğrular (kelime sayısı, tekrar, format)
 */
function validateCard(card, slug) {
  const warnings = [];
  
  // Kelime sayısı kontrolü
  const totalWords = countWords(JSON.stringify(card));
  if (totalWords < 1500 || totalWords > 1800) {
    warnings.push(`Toplam kelime: ${totalWords} (hedef: 1500-1800)`);
  }
  
  // FAQ benzersizlik kontrolü
  if (Array.isArray(card.faq) && card.faq.length >= 2) {
    const questions = card.faq.map(f => f.question || '');
    const uniqueQuestions = [...new Set(questions)];
    if (questions.length !== uniqueQuestions.length) {
      warnings.push(`FAQ tekrarlı sorular içeriyor`);
    }
  }
  
  // related_cards self-referans kontrolü
  if (Array.isArray(card.related_cards) && card.related_cards.includes(slug)) {
    warnings.push(`related_cards kendini içeriyor: ${slug}`);
  }
  
  // SEO uzunluk kontrolü
  if (card.seo) {
    const titleLen = card.seo.metaTitle?.length || 0;
    const descLen = card.seo.metaDescription?.length || 0;
    if (titleLen < 60 || titleLen > 70) {
      warnings.push(`Meta title uzunluk: ${titleLen} (hedef: 60-70)`);
    }
    if (descLen < 150 || descLen > 160) {
      warnings.push(`Meta description uzunluk: ${descLen} (hedef: 150-160)`);
    }
  }
  
  return warnings;
}

/**
 * Otomatik alanları doldurur (imageUrl, related_cards, image_gallery)
 */
function fillAutoFields(card, slug, templateCard) {
  // Kısa kart ismi (image_gallery için)
  const shortName = (card.name || slug)
    .replace(/Tarot Kartı Anlamı.*$/i, '')
    .replace(/ve.*Rehberi.*$/i, '')
    .trim();
  
  // imageUrl - KARTTIN KENDİ numerology number'ını kullan
  if (!card.imageUrl) {
    const cardNumber = card.numerology?.number ?? 0;
    card.imageUrl = `/cards/rws/${cardNumber}-${slug}.webp`;
  }
  
  // related_cards - eğer string ise (LLM hatalı döndü), combinations'dan al
  if (typeof card.related_cards === 'string' || !Array.isArray(card.related_cards) || card.related_cards.length === 0) {
    if (Array.isArray(card.combinations) && card.combinations.length > 0) {
      card.related_cards = card.combinations.map(c => c.with).filter(Boolean).slice(0, 5);
    } else {
      card.related_cards = []; // Boş array
    }
  }
  
  // Self referansını kaldır ve suit adlarını düzelt
  if (Array.isArray(card.related_cards)) {
    card.related_cards = card.related_cards
      .filter(c => c !== slug) // Kendi slug'ını kaldır
      .map(c => {
        // clubs -> wands dönüşümü
        return c.replace(/-of-clubs$/i, '-of-wands');
      })
      .filter(Boolean)
      .slice(0, 5);
  }
  
  // image_gallery - eğer string ise (LLM hatalı döndü), template'ten oluştur
  if (typeof card.image_gallery === 'string' || !Array.isArray(card.image_gallery) || card.image_gallery.length === 0) {
    const imageTypes = ['main', 'symbols', 'upright-vs-reversed', 'busbuskimki'];
    const imageCaptions = [
      `${shortName} ana görseli`,
      `${shortName} sembolleri`,
      `${shortName} düz ve ters anlamları`,
      `${shortName} Büşbüşkimki yorumu`
    ];
    
    card.image_gallery = imageTypes.map((type, idx) => ({
      src: `/cards/${slug}/${slug}-${type}.webp`,
      alt: `${shortName} ${type} görseli`,
      caption: imageCaptions[idx],
      priority: idx === 0
    }));
  }
}

/**
 * Progress kaydet
 */
function saveProgress(completed, failed) {
  const progress = {
    lastRun: new Date().toISOString(),
    completed: completed,
    failed: failed,
  };
  
  fs.mkdirSync(CONFIG.LOG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG.PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
}

/**
 * Progress yükle
 */
function loadProgress() {
  if (fs.existsSync(CONFIG.PROGRESS_FILE)) {
    return JSON.parse(fs.readFileSync(CONFIG.PROGRESS_FILE, 'utf8'));
  }
  return { completed: [], failed: [] };
}

/**
 * SEO/AdSense kalite kontrolü
 */
async function checkSEOQuality(cardName, cardData) {
  const prompt = `Sen bir Google AdSense uzmanısın. Aşağıdaki tarot kartı içeriğini analiz et.

KART: ${cardName}

İÇERİK ÖZET:
- Toplam kelime: ${countWords(JSON.stringify(cardData))}
- Meanings bölümleri: ${cardData.meanings ? 'Var' : 'Yok'}
- Psychologist perspective: ${cardData.psychologist_perspective ? 'Var' : 'Yok'}
- Symbolism: ${Array.isArray(cardData.symbolism) ? cardData.symbolism.length + ' adet' : 'Yok'}
- FAQ: ${Array.isArray(cardData.faq) ? cardData.faq.length + ' soru' : 'Yok'}
- SEO metadata: ${cardData.seo ? 'Var' : 'Yok'}

SORU: Bu içerik Google AdSense onayı için yeterli mi?

KRİTERLER:
1. En az 1200 kelime özgün içerik
2. Yapısal derinlik (başlıklar, alt bölümler)
3. Kullanıcı değeri (FAQ, pratik öneriler)
4. SEO optimizasyonu
5. Özgünlük ve kalite

CEVAP FORMATI:
ONAY: EVET veya HAYIR
PUAN: 0-100
EKSİKLER: (varsa liste)
GÜÇLÜ YÖNLER: (liste)

CEVABINI VER:`;

  try {
    log(`\n🔍 SEO/AdSense Kalite Kontrolü...`, c.blue);
    const response = await callQwen(prompt, 'seo');
    
    log(`📋 Qwen Değerlendirmesi:`, c.cyan);
    console.log(response.substring(0, 500));
    
    // "ONAY: EVET" kontrolü
    const approved = response.toUpperCase().includes('ONAY: EVET') || 
                     response.toUpperCase().includes('ONAY:EVET');
    
    if (approved) {
      log(`\n✅ AdSense Onayı: BAŞARILI`, c.green);
      return true;
    } else {
      log(`\n⚠️ AdSense Onayı: EKSİKLİKLER VAR`, c.yellow);
      return false;
    }
    
  } catch (error) {
    log(`⚠️ Kalite kontrolü başarısız: ${error.message}`, c.yellow);
    return true; // Hata durumunda devam et
  }
}

/**
 * Ana fonksiyon
 */
async function main() {
  log(`\n${'='.repeat(70)}`, c.cyan);
  log(`🎯 TR.JSON ŞABLONLU KART DOLDURUCU`, c.bright + c.cyan);
  log(`   Şablon: messages/tr.json → the-fool`, c.cyan);
  log(`   Hedef: tarot-cards.json → tüm kartlar`, c.cyan);
  log(`${'='.repeat(70)}\n`, c.cyan);
  
  // Şablonu yükle (TR.JSON)
  log(`📖 Şablon yükleniyor: ${CONFIG.TR_JSON}`, c.blue);
  const templateCard = loadTemplateCard();
  log(`✅ Şablon yüklendi: ${templateCard.name}`, c.green);
  log(`   Kelime sayısı: ${countWords(JSON.stringify(templateCard))}`, c.green);
  log(`   Anahtarlar: ${Object.keys(templateCard).join(', ')}\n`, c.green);
  
  // Target data yükle
  log(`📖 Hedef dosya yükleniyor: ${CONFIG.TARGET_JSON}`, c.blue);
  const targetData = loadTargetData();
  const targetCards = targetData[0].blog.cards;
  const cardSlugs = Object.keys(targetCards)
    .filter(s => s !== CONFIG.TEMPLATE_CARD_SLUG)
    .filter(s => !CONFIG.SKIP_CARDS.includes(s));
  
  log(`✅ ${cardSlugs.length} kart bulundu\n`, c.green);
  
  if (CONFIG.TEST_MODE) {
    log(`🧪 TEST MODU: Sadece ${CONFIG.MAX_CARDS} kart işlenecek\n`, c.yellow);
  }
  
  // İşlenecek kartlar
  let toProcess = CONFIG.TEST_MODE ? cardSlugs.slice(0, CONFIG.MAX_CARDS) : cardSlugs;
  
  // Belirli bir kart test edilecekse
  if (CONFIG.TEST_SPECIFIC_CARD && cardSlugs.includes(CONFIG.TEST_SPECIFIC_CARD)) {
    toProcess = [CONFIG.TEST_SPECIFIC_CARD];
    log(`🎯 Belirli kart testi: ${CONFIG.TEST_SPECIFIC_CARD}\n`, c.yellow);
  }
  
  // Progress tracking
  const progress = loadProgress();
  const completedCards = [];
  const failedCards = [];
  const startTime = Date.now();
  
  log(`\n⏱️  İşlem başlangıç: ${new Date().toLocaleTimeString('tr-TR')}\n`, c.cyan);
  
  for (let i = 0; i < toProcess.length; i++) {
    const slug = toProcess[i];
    const card = targetCards[slug];
    
    // Progress bar
    showProgress(i, toProcess.length, card.name.substring(0, 30));
    await sleep(500);
    clearProgress();
    
    log(`\n${'─'.repeat(70)}`, c.bright);
    log(`📝 Kart ${i + 1}/${toProcess.length}: ${slug}`, c.bright + c.cyan);
    log(`   ${card.name}`, c.cyan);
    
    // Tahmini kalan süre
    if (i > 0) {
      const elapsed = Date.now() - startTime;
      const avgTimePerCard = elapsed / i;
      const remaining = (toProcess.length - i) * avgTimePerCard;
      const remainingMin = Math.floor(remaining / 60000);
      log(`   ⏱️  Tahmini Kalan: ~${remainingMin} dakika`, c.blue);
    }
    
    log(`${'─'.repeat(70)}\n`, c.bright);
    
    // Eksiklikleri tespit et
    const missing = findMissingFields(card, templateCard);
    
    if (missing.length === 0) {
      log(`✅ Bu kart zaten tam!\n`, c.green);
      continue;
    }
    
    log(`⚠️  ${missing.length} eksik/yetersiz alan bulundu`, c.yellow);
    
    // Öncelik sırasına koy
    const priority = {
      'meanings.upright.general': 10,
      'meanings.upright.love': 9,
      'meanings.upright.career': 9,
      'meanings.upright.money': 8,
      'meanings.upright.spiritual': 8,
      'meanings.reversed.general': 7,
      'psychologist_perspective': 10,
      'symbolism': 10,
      'numerology': 8,
      'combinations': 7,
      'affirmations': 6,
      'daily_practices': 6,
      'seo': 10,
    };
    
    missing.sort((a, b) => (priority[b.path] || 0) - (priority[a.path] || 0));
    
    // İlk 5 alanı göster
    missing.slice(0, 5).forEach((m, idx) => {
      log(`   ${idx + 1}. ${m.path} (${m.reason})`, c.yellow);
    });
    if (missing.length > 5) {
      log(`   ... ve ${missing.length - 5} alan daha`, c.yellow);
    }
    log('');
    
    // TÜM eksik alanları işle
    const toFill = missing;
    log(`🎯 ${toFill.length} alan doldurulacak\n`, c.bright);
    
    for (let j = 0; j < toFill.length; j++) {
      const field = toFill[j];
      
      // Canlı progress
      process.stdout.write(`${c.cyan}🔧 [${j + 1}/${toFill.length}] ${field.path}${c.reset}\n`);
      
      try {
        // Prompt oluştur
        const { prompt, taskType } = generatePrompt(card.name, slug, field, field.templateValue);
        
        // Qwen'e gönder
        log(`   🤖 Ollama'ya gönderiliyor...`, c.blue);
        let response = await callQwen(prompt, taskType);
        
        log(`   ✅ Cevap alındı (${response.length} karakter)`, c.green);
        
        // Temizle (Japonca, Markdown, İngilizce)
        response = cleanLLMOutput(response);
        log(`   🧹 Temizlendi (${response.length} karakter)`, c.cyan);
        
        // Parse et
        let parsedValue;
        if (field.type === 'string') {
          parsedValue = response.trim();
        } else {
          parsedValue = parseJSON(response);
          if (!parsedValue) {
            log(`   ⚠️ JSON parse başarısız, raw metin kullanılıyor`, c.yellow);
            parsedValue = cleanLLMOutput(response); // Temiz metin kullan
          }
        }
        
        // Kartı güncelle (nested path desteği)
        setNestedValue(card, field.path, parsedValue);
        
        log(`   💾 Alan güncellendi`, c.green);
        log(`   📊 İçerik özeti: ${JSON.stringify(parsedValue).substring(0, 80)}...`, c.blue);
        
        // Bekleme
        await sleep(CONFIG.OLLAMA_DELAY);
        
      } catch (error) {
        log(`   ❌ Hata: ${error.message}`, c.red);
      }
      
      log('');
    }
    
    // Otomatik alanları doldur
    fillAutoFields(card, slug, templateCard);
    
    // VALIDATOR: İçerik kalitesi kontrolü
    const validationWarnings = validateCard(card, slug);
    if (validationWarnings.length > 0) {
      log(`\n⚠️  Kalite Uyarıları:`, c.yellow);
      validationWarnings.forEach(w => log(`   • ${w}`, c.yellow));
      log('', c.reset);
    }
    
    // Kartı ayrı dosyaya kaydet (BATCH SİSTEM)
    saveCardToFile(slug, card);
    log(`✅ ${slug} işlendi ve kaydedildi!\n`, c.green);
    
    // SEO/AdSense Kalite Kontrolü
    log(`${'─'.repeat(70)}`, c.blue);
    const isApproved = await checkSEOQuality(card.name, card);
    log(`${'─'.repeat(70)}\n`, c.blue);
    
    if (!isApproved) {
      log(`⚠️ AdSense onayı alınamadı. Yine de devam ediliyor...\n`, c.yellow);
      failedCards.push({ slug, name: card.name, reason: 'AdSense onay alamadı' });
    } else {
      log(`✅ Kart kalite kontrolünden geçti, sonraki karta geçiliyor...\n`, c.green);
      completedCards.push({ slug, name: card.name, completedAt: new Date().toISOString() });
    }
    
    // Progress kaydet (her kart sonrası)
    saveProgress(completedCards, failedCards);
    
    // Her 5 kartta bir özet göster
    if ((i + 1) % 5 === 0) {
      const elapsed = Date.now() - startTime;
      const elapsedMin = Math.floor(elapsed / 60000);
      log(`\n${'═'.repeat(70)}`, c.magenta);
      log(`📊 ARA RAPOR - ${i + 1}/${toProcess.length} kart tamamlandı`, c.bright + c.magenta);
      log(`   ✅ Başarılı: ${completedCards.length}`, c.green);
      log(`   ⚠️  Uyarılı: ${failedCards.length}`, c.yellow);
      log(`   ⏱️  Geçen Süre: ${elapsedMin} dakika`, c.blue);
      log(`${'═'.repeat(70)}\n`, c.magenta);
    }
  }
  
  // Final istatistikler
  const totalElapsed = Date.now() - startTime;
  const totalMin = Math.floor(totalElapsed / 60000);
  const totalSec = Math.floor((totalElapsed % 60000) / 1000);
  
  log(`\n${'═'.repeat(70)}`, c.green);
  log(`🎉 İŞLEM TAMAMLANDI!`, c.bright + c.green);
  log(`${'═'.repeat(70)}`, c.green);
  log(`\n📊 FİNAL RAPOR:`, c.bright);
  log(`   📝 Toplam Kart: ${toProcess.length}`, c.cyan);
  log(`   ✅ Başarılı: ${completedCards.length}`, c.green);
  log(`   ⚠️  Uyarılı: ${failedCards.length}`, c.yellow);
  log(`   ⏱️  Toplam Süre: ${totalMin} dakika ${totalSec} saniye`, c.blue);
  
  if (failedCards.length > 0) {
    log(`\n⚠️  UYARILI KARTLAR:`, c.yellow);
    failedCards.forEach(f => {
      log(`   - ${f.name} (${f.slug})`, c.yellow);
    });
  }
  
  log(`\n💾 Progress kaydedildi: ${CONFIG.PROGRESS_FILE}`, c.blue);
  log(`📦 Backup klasörü: ${CONFIG.BACKUP_DIR}`, c.blue);
  log(`\n${'═'.repeat(70)}\n`, c.green);
}

// Hata yakalama
process.on('unhandledRejection', (error) => {
  log(`\n💥 HATA: ${error.message}`, c.red);
  console.error(error.stack);
  process.exit(1);
});

// Çalıştır
if (require.main === module) {
  main().catch(error => {
    log(`\n💥 FATAL: ${error.message}`, c.red);
    console.error(error.stack);
    process.exit(1);
  });
}


