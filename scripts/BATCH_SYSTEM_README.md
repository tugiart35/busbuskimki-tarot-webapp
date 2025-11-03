# 🎯 Batch Kart Üretim Sistemi

Tarot kartı içeriklerini **Ollama + Qwen 2.5:7b** ile üretip, batch dosyalar halinde kaydeder.

---

## 📦 Sistem Özeti

```
1. fill-from-tr-json.js  → Her kartı ayrı JSON dosyası olarak üretir (output/cards/)
2. merge-cards.js        → Tüm JSON dosyalarını birleştirir (tarot-cards.json)
```

---

## 🚀 Kurulum

### 1. Ollama Kurulumu

```bash
# Ollama kur (Mac M1)
brew install ollama

# Model indir (harici SSD'ye)
export OLLAMA_MODELS=/Volumes/Untitled/ollama-models
ollama pull qwen2.5:7b
```

### 2. Ollama Servisi Başlat

```bash
# Terminal 1 - Ollama servisini başlat
export OLLAMA_MODELS=/Volumes/Untitled/ollama-models
ollama serve
```

Servisi arka planda çalıştırmak için:
```bash
export OLLAMA_MODELS=/Volumes/Untitled/ollama-models
ollama serve > /dev/null 2>&1 &
```

---

## 📝 Kullanım

### ADIM 1: Kartları Üret

```bash
# Terminal 2 - Kartları üret
cd /Users/tugi/Desktop/busbuskimki
node scripts/fill-from-tr-json.js 2>&1 | tee logs/batch-run.log
```

**Ne yapar:**
- `messages/tr.json` → `the-fool` kartını şablon alır
- `tarot-cards.json` → Diğer 76 kartı kontrol eder
- Eksik alanları **Büşbüşkimki persona**sıyla doldurur
- Her kartı `output/cards/{slug}.json` olarak kaydeder
- Progress: `logs/fill-progress.json`

**Canlı İzleme:**
```
[████████████████████████░░░░░░] 65% - 50/77 - Büyücü Tarot Kartı

📝 Kart 50/77: the-magician
⏱️  Tahmini Kalan: ~27 dakika

🔧 [1/8] meanings.upright.general
   🤖 Ollama'ya gönderiliyor...
   ✅ Cevap alındı (1420 karakter)
   💾 Alan güncellendi
```

### ADIM 2: Manuel Kontrol (İsteğe Bağlı)

```bash
# Kaç kart üretildi?
ls output/cards/ | wc -l

# Bir kartı incele
cat output/cards/the-magician.json | jq '.name'

# İlk 5 satırı göster
head -n 50 output/cards/the-magician.json
```

### ADIM 3: Birleştir

```bash
# Tüm kartları birleştir
node scripts/merge-cards.js
```

**Ne yapar:**
- `output/cards/*.json` dosyalarını toplar
- `the-fool` (template) ekler
- `tarot-cards.json` günceller
- Backup: `backups/tarot-cards-{timestamp}.json`

**Çıktı:**
```
🔄 BATCH KART BİRLEŞTİRİCİ

📂 76 kart dosyası bulundu

  ✅ the-magician
  ✅ the-high-priestess
  ✅ the-empress
  ...

✅ BİRLEŞTİRME TAMAMLANDI!

📊 İSTATİSTİKLER:
   📦 Toplam Kart: 77
   💾 Hedef: tarot-cards.json
   🔐 Backup: backups/tarot-cards-2025-10-30T14-30-00.json
```

---

## ⚙️ Konfigürasyon

### `fill-from-tr-json.js` - CONFIG

```javascript
const CONFIG = {
  // Test modu (sadece ilk N kartı işle)
  TEST_MODE: false,
  MAX_CARDS: 5, // TEST_MODE=true ise
  
  // Atlanan kartlar
  SKIP_CARDS: ['the-fool'], // Zaten tamam olanlar
  
  // Ollama gecikme (ms)
  OLLAMA_DELAY: 2000,
  
  // Output klasörü
  OUTPUT_DIR: path.join(__dirname, '..', 'output', 'cards'),
};
```

### Test Modu Çalıştırma

```bash
# Sadece ilk 3 kartı işle
# fill-from-tr-json.js içinde:
# TEST_MODE: true, MAX_CARDS: 3

node scripts/fill-from-tr-json.js
```

---

## 🔧 İleri Seviye

### Kesinti Sonrası Devam

Script **otomatik** devam eder:
- `logs/fill-progress.json` → İşlenmiş kartları izler
- Tekrar çalıştırdığında kaldığı yerden devam eder

### Sadece Belirli Kartları İşle

```javascript
// fill-from-tr-json.js içinde
const CONFIG = {
  SKIP_CARDS: ['the-fool', 'the-magician'], // Bunları atla
};
```

### Tek Bir Kartı Yeniden Üret

```bash
# 1. İlgili kartı sil
rm output/cards/the-magician.json

# 2. Scripti çalıştır (sadece o kartı üretir)
node scripts/fill-from-tr-json.js

# 3. Birleştir
node scripts/merge-cards.js
```

---

## 📊 Üretilen Alanlar

Scriptin doldurduğu alanlar (**Ornekjson.md** standardı):

| Alan | Tip | LLM Üretimi | Oto Doldurma |
|------|-----|-------------|--------------|
| `name` | string | ✅ | - |
| `short_description` | string | ✅ | - |
| `meanings.*` | object | ✅ | - |
| `psychologist_perspective` | object | ✅ | - |
| `symbolism` | array | ✅ | - |
| `numerology` | object | ✅ | - |
| `context.mythology` | string | ✅ | - |
| `context.history` | string | ✅ | - |
| `context.celtic_cross.*` | string | ✅ | - |
| `combinations` | array | ✅ | - |
| `affirmations` | object | ✅ | - |
| `daily_practices` | array | ✅ | - |
| `faq` | array | ✅ | - |
| `seo` | object | ✅ | - |
| `imageUrl` | string | - | ✅ |
| `related_cards` | array | - | ✅ (combinations'dan) |
| `image_gallery` | array | - | ✅ (template'ten) |

---

## ❗ Sorun Giderme

### Ollama Hatası: Connection Refused

```bash
# Servis çalışıyor mu kontrol et
curl http://localhost:11434/api/tags

# Yoksa başlat
export OLLAMA_MODELS=/Volumes/Untitled/ollama-models
ollama serve
```

### Model Bulunamadı

```bash
# Model listesi
ollama list

# Yoksa indir
ollama pull qwen2.5:7b
```

### JSON Parse Hatası

Script otomatik retry yapar ama sorun devam ederse:
```bash
# İlgili kartı sil
rm output/cards/problematic-card.json

# Tekrar çalıştır
node scripts/fill-from-tr-json.js
```

### Türkçe Olmayan Cevaplar

System prompt'lar (`scripts/system-prompts.js`) zaten Türkçe zorlaması içeriyor.
Sorun devam ederse Ollama temperature'ı düşür:

```javascript
// fill-from-tr-json.js → callQwen fonksiyonu
options: {
  temperature: 0.5, // 0.7'den 0.5'e düşür
}
```

---

## 🎯 Kalite Kontrol

Script her kart sonrası **SEO/AdSense kalite kontrolü** yapar:
- En az 1200 kelime
- Yapısal derinlik
- FAQ, pratikler vb.

Başarısız kartlar `failedCards` listesine eklenir ama işlem devam eder.

---

## 📁 Klasör Yapısı

```
busbuskimki/
├── scripts/
│   ├── fill-from-tr-json.js       (Kart üretici)
│   ├── merge-cards.js              (Birleştirici)
│   ├── system-prompts.js           (LLM persona)
│   └── BATCH_SYSTEM_README.md      (Bu dosya)
├── output/
│   └── cards/
│       ├── the-magician.json
│       ├── the-high-priestess.json
│       └── ... (76 kart)
├── logs/
│   ├── fill-progress.json          (İlerleme)
│   └── batch-run.log               (Tam log)
├── backups/
│   └── tarot-cards-{timestamp}.json
└── src/lib/data/
    └── tarot-cards.json            (Final dosya)
```

---

## 🎉 Özet

```bash
# 1. Ollama başlat
export OLLAMA_MODELS=/Volumes/Untitled/ollama-models
ollama serve &

# 2. Kartları üret
node scripts/fill-from-tr-json.js 2>&1 | tee logs/batch-run.log

# 3. Birleştir
node scripts/merge-cards.js

# ✅ TAMAM!
```

**Süre:** ~2-4 saat (77 kart × 2-3 dakika/kart)



