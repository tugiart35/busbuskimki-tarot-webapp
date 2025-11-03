# 🤖 Ollama İçerik Zenginleştirme Kılavuzu

**Oluşturulma Tarihi:** 31 Ekim 2025  
**Versiyon:** 1.0.0  
**Amaç:** SEO raporundaki eksiklikleri açık kaynak AI ile otomatik gidermek

---

## 📋 İÇİNDEKİLER

1. [Özellikler](#özellikler)
2. [Gereksinimler](#gereksinimler)
3. [Kurulum](#kurulum)
4. [Kullanım](#kullanım)
5. [Log Sistemi](#log-sistemi)
6. [Geri Dönüş (Recovery)](#geri-dönüş)
7. [Sorun Giderme](#sorun-giderme)

---

## 🎯 ÖZELLİKLER

### ✨ Ana Özellikler

- ✅ **SEO Raporu Entegrasyonu:** SEO analiz raporunu okur, eksiklikleri tespit eder
- ✅ **Ollama AI Desteği:** Mistral, Qwen, Llama2 gibi açık kaynak modeller
- ✅ **Çok Dilli:** Türkçe, İngilizce, Sırpça desteği
- ✅ **Kapsamlı Log:** Her adım JSON formatında kaydedilir
- ✅ **Otomatik Yedekleme:** İşlem öncesi her kart yedeklenir
- ✅ **Geri Dönüş:** Hata durumunda kolayca geri alınabilir

### 📝 Üretilen İçerikler

Her kart için:

1. **Celtic Cross Pozisyonları** (10 pozisyon × 40 kelime = ~400 kelime)
   - Her pozisyon için özel yorum
   - Danışana pratik tavsiyeler

2. **Günlük Pratikler** (5 pratik × 45 kelime = ~225 kelime)
   - Uygulanabilir egzersizler
   - Adım adım talimatlar

3. **Affirmasyonlar** (10 olumlama × 8 kelime = ~80 kelime)
   - Güçlendirici ifadeler
   - "Ben" dili kullanımı

4. **Tarot Okuma Örnekleri** (3 örnek × 95 kelime = ~285 kelime)
   - Gerçekçi senaryolar
   - Detaylı yorumlar

5. **Kart Kombinasyonları** (5 kombo × 40 kelime = ~200 kelime)
   - Sinerji yaratan eşleşmeler
   - Derin anlamlar

**TOPLAM:** ~1190 kelime eklenir  
**Mevcut ortalama:** ~850 kelime  
**Yeni toplam:** ~2040 kelime ✅ (Hedef: 1500+)

---

## 🔧 GEREKSİNİMLER

### 1. Ollama Kurulumu

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# https://ollama.com/download adresinden indir
```

### 2. Model İndirme

```bash
# Önerilen: Mistral (hızlı, kaliteli)
ollama pull mistral

# Alternatif: Qwen 2.5 (çok dilli)
ollama pull qwen2.5:7b

# Alternatif: Llama2 (klasik)
ollama pull llama2:7b
```

### 3. Ollama Başlatma

```bash
# Arka planda çalıştır
ollama serve

# Test et
curl http://localhost:11434/api/tags
```

---

## 🚀 KURULUM

### 1. Bağımlılıkları Yükle

```bash
cd /Users/tugi/Desktop/busbuskimki
npm install axios
```

### 2. Script'i Test Et

```bash
# TypeScript kontrolü
npx tsc scripts/content-enhancer-ollama.ts --noEmit

# Ollama bağlantısını test et
curl http://localhost:11434/api/tags
```

---

## 💻 KULLANIM

### Basit Kullanım (Türkçe, İlk 5 Kart)

```bash
npx ts-node scripts/content-enhancer-ollama.ts \
  mistral \
  tr \
  data/kartlarfinal.json \
  kartlarfinal-tr-seo-report.json \
  data/kartlarfinal-enhanced-tr.json \
  5
```

### Detaylı Parametreler

```bash
npx ts-node scripts/content-enhancer-ollama.ts \
  [MODEL] \
  [DİL] \
  [GİRDİ_JSON] \
  [SEO_RAPOR] \
  [ÇIKTI_JSON] \
  [MAX_KART]
```

#### Parametre Açıklamaları

| Parametre | Açıklama | Varsayılan | Örnekler |
|-----------|----------|------------|----------|
| **MODEL** | Ollama model adı | `mistral` | `mistral`, `qwen2.5:7b`, `llama2` |
| **DİL** | İçerik dili | `tr` | `tr`, `en`, `sr` |
| **GİRDİ_JSON** | Orijinal kart dosyası | `./data/kartlarfinal.json` | Dosya yolu |
| **SEO_RAPOR** | SEO analiz raporu | `./kartlarfinal-tr-seo-report.json` | Rapor yolu |
| **ÇIKTI_JSON** | Zenginleştirilmiş çıktı | `./data/kartlarfinal-enhanced.json` | Çıktı yolu |
| **MAX_KART** | İşlenecek kart sayısı | `10` | `1`, `5`, `78` |

### Kullanım Örnekleri

#### 1. Türkçe - İlk 10 Kart (Test)

```bash
npx ts-node scripts/content-enhancer-ollama.ts \
  mistral tr \
  data/kartlarfinal.json \
  kartlarfinal-tr-seo-report.json \
  data/kartlarfinal-enhanced-tr.json \
  10
```

#### 2. Sırpça - İlk 10 Kart

```bash
npx ts-node scripts/content-enhancer-ollama.ts \
  qwen2.5:7b sr \
  data/kartlarfinal_sr.json \
  kartlarfinal-sr-seo-report.json \
  data/kartlarfinal-enhanced-sr.json \
  10
```

#### 3. İngilizce - Tüm Kartlar (78)

```bash
npx ts-node scripts/content-enhancer-ollama.ts \
  mistral en \
  data/kartlarfinal_en.json \
  kartlarfinal-en-seo-report.json \
  data/kartlarfinal-enhanced-en.json \
  78
```

#### 4. Sadece 1 Kart (Hızlı Test)

```bash
npx ts-node scripts/content-enhancer-ollama.ts \
  mistral tr \
  data/kartlarfinal.json \
  kartlarfinal-tr-seo-report.json \
  data/test-single-card.json \
  1
```

---

## 📊 LOG SİSTEMİ

### Log Dosyası Formatı

Log dosyaları otomatik olarak `logs/` dizinine kaydedilir:

```
logs/content-enhancer-tr-1730376000000.json
```

### Log Yapısı

```json
[
  {
    "timestamp": "2025-10-31T10:30:00.000Z",
    "level": "INFO",
    "cardId": "the-fool",
    "cardName": "Joker Tarot Kartı",
    "action": "Celtic Cross pozisyonları oluşturuluyor...",
    "details": {
      "promptLength": 850,
      "model": "mistral"
    }
  },
  {
    "timestamp": "2025-10-31T10:30:45.000Z",
    "level": "SUCCESS",
    "cardId": "the-fool",
    "cardName": "Joker Tarot Kartı",
    "action": "Celtic Cross eklendi",
    "details": {
      "words": 425
    }
  }
]
```

### Log Seviyeleri

| Seviye | İkon | Açıklama |
|--------|------|----------|
| `INFO` | ℹ️ | Bilgilendirme mesajı |
| `SUCCESS` | ✅ | Başarılı işlem |
| `WARNING` | ⚠️ | Uyarı (işlem devam eder) |
| `ERROR` | ❌ | Hata (işlem durabilir) |

### Log İnceleme

```bash
# Log dosyasını oku
cat logs/content-enhancer-tr-*.json | jq '.'

# Sadece hataları göster
cat logs/content-enhancer-tr-*.json | jq '.[] | select(.level == "ERROR")'

# Belirli bir kartın loglarını göster
cat logs/content-enhancer-tr-*.json | jq '.[] | select(.cardId == "the-fool")'

# İşlem özeti
cat logs/content-enhancer-tr-*.json | jq '[.[] | .level] | group_by(.) | map({level: .[0], count: length})'
```

---

## 🔄 GERİ DÖNÜŞ (RECOVERY)

### Otomatik Yedekleme

Her kart işlenmeden önce otomatik yedeklenir:

```
backups/enhanced-cards/
  ├── the-fool-1730376000000.json
  ├── the-magician-1730376010000.json
  └── the-high-priestess-1730376020000.json
```

### Hata Durumunda Geri Dönüş

#### 1. Tek Kartı Geri Yükle

```bash
# Yedek dosyayı bul
ls -lt backups/enhanced-cards/the-fool-*.json | head -1

# Manuel olarak geri yükle (örnek)
# Orijinal JSON'da ilgili kartı bu yedekle değiştir
```

#### 2. Tüm İşlemi Geri Al

```bash
# Orijinal dosyayı koru
cp data/kartlarfinal.json data/kartlarfinal-backup.json

# Hatalı çıktıyı sil
rm data/kartlarfinal-enhanced-tr.json

# Yeniden başlat
npx ts-node scripts/content-enhancer-ollama.ts ...
```

#### 3. Log'dan Sorunlu Kartı Tespit Et

```bash
# Hata veren kartları listele
cat logs/content-enhancer-tr-*.json | jq '.[] | select(.level == "ERROR") | .cardName'

# O kartı atla ve devam et
# Script'te maxCards parametresini ayarla
```

---

## 🔍 SORUN GİDERME

### 1. Ollama Bağlantı Hatası

**Hata:** `Ollama bağlantısı başarısız`

**Çözüm:**
```bash
# Ollama çalışıyor mu?
ps aux | grep ollama

# Başlat
ollama serve

# Port'u kontrol et
lsof -i :11434
```

### 2. Model Bulunamadı

**Hata:** `model 'mistral' not found`

**Çözüm:**
```bash
# Mevcut modelleri listele
ollama list

# Model indir
ollama pull mistral
```

### 3. JSON Parse Hatası

**Hata:** `JSON parse başarısız`

**Çözüm:**
- Ollama model'inin JSON üretme kalitesi düşükse başka model dene
- Log'da `WARNING` seviyesinde kayıtlara bak
- Prompt'ları basitleştir (kod içinde)

### 4. Yavaş Üretim

**İyileştirme:**
```bash
# Daha küçük model kullan
ollama pull mistral:7b  # yerine mistral:instruct

# Rate limiting'i azalt (kod içinde)
# await new Promise(resolve => setTimeout(resolve, 1000)); // 3000'den 1000'e
```

### 5. Bellek Hatası

**Hata:** `Out of memory`

**Çözüm:**
```bash
# Daha küçük model kullan
ollama pull mistral:7b  # 13b yerine

# Aynı anda daha az kart işle
# maxCards=3 parametresi kullan
```

---

## 📈 PERFORMANS ve TAHMİNLER

### İşlem Süresi (Mistral 7B)

| Kart Sayısı | Tahmini Süre | Toplam Kelime |
|-------------|--------------|---------------|
| 1 kart | ~3-5 dakika | ~1200 kelime |
| 5 kart | ~15-25 dakika | ~6000 kelime |
| 10 kart | ~30-50 dakika | ~12000 kelime |
| 78 kart | ~4-7 saat | ~93600 kelime |

### Model Karşılaştırması

| Model | Hız | Kalite | Çok Dilli | RAM |
|-------|-----|--------|-----------|-----|
| **mistral:instruct** | ⚡⚡⚡ | ⭐⭐⭐ | ⭐⭐ | 4GB |
| **qwen2.5:7b** | ⚡⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 6GB |
| **llama2:7b** | ⚡⚡ | ⭐⭐⭐ | ⭐⭐⭐ | 6GB |
| **mistral:7b** | ⚡⚡ | ⭐⭐⭐⭐ | ⭐⭐⭐ | 6GB |

### Öneri

- **Hızlı test için:** `mistral:instruct` + 1-5 kart
- **Kalite için:** `qwen2.5:7b` veya `mistral:7b`
- **Çok dilli için:** `qwen2.5:7b` (Türkçe, İngilizce, Sırpça mükemmel)

---

## 📋 İŞ AKIŞI ÖRNEĞİ

### Aşama 1: Test (İlk 1 Kart)

```bash
# 1. Ollama'yı başlat
ollama serve

# 2. Tek kart test et
npx ts-node scripts/content-enhancer-ollama.ts \
  mistral tr \
  data/kartlarfinal.json \
  kartlarfinal-tr-seo-report.json \
  data/test-output.json \
  1

# 3. Çıktıyı kontrol et
cat data/test-output.json | jq '.blog.cards | to_entries | .[0].value.celtic_cross_extended'

# 4. Log'u incele
cat logs/content-enhancer-tr-*.json | jq '.[] | select(.level == "ERROR")'
```

### Aşama 2: Pilot (İlk 10 Kart)

```bash
# Başarılıysa ilk 10 kartı işle
npx ts-node scripts/content-enhancer-ollama.ts \
  mistral tr \
  data/kartlarfinal.json \
  kartlarfinal-tr-seo-report.json \
  data/kartlarfinal-enhanced-tr-pilot.json \
  10
```

### Aşama 3: Tam Üretim (Tüm Kartlar)

```bash
# Tüm kartları işle (uzun sürer)
npx ts-node scripts/content-enhancer-ollama.ts \
  qwen2.5:7b tr \
  data/kartlarfinal.json \
  kartlarfinal-tr-seo-report.json \
  data/kartlarfinal-enhanced-tr-full.json \
  78
```

### Aşama 4: Doğrulama

```bash
# Yeni SEO raporu oluştur
npx ts-node scripts/seo-eeat-checker.ts \
  data/kartlarfinal-enhanced-tr-full.json \
  kartlarfinal-enhanced-tr-seo-report.json

# Skorları karşılaştır
cat kartlarfinal-enhanced-tr-seo-report.json | jq '.summary'
```

---

## 🎯 HEDEF ve SONUÇLAR

### Başlangıç Durumu

- Ortalama kelime: ~850 kelime/kart
- Ortalama skor: 200.5/220 (91.1%)
- Eksik: Celtic Cross, pratikler, örnekler

### Beklenen Sonuç

- Ortalama kelime: **~2040 kelime/kart** ✅
- Beklenen skor: **~215/220 (97.7%)** 🎯
- Eksiksiz: Tüm bölümler dolu

### İyileştirme

- Kelime artışı: **+140%**
- Skor artışı: **+6.6%**
- SEO hedefine ulaşma: **%100** ✅

---

## 🤝 DESTEK

### Sorunlar

Herhangi bir sorunla karşılaşırsanız:

1. Log dosyasını kontrol edin
2. Backup dosyalarını kontrol edin
3. Ollama servisini yeniden başlatın
4. Daha küçük `maxCards` değeri ile tekrar deneyin

### İpuçları

- İlk kez kullanıyorsanız **1 kart** ile test edin
- Gecede çalıştırın (tüm kartlar için)
- Log'ları düzenli temizleyin (`logs/` dizini)
- Backup'ları koruyun

---

**Son Güncelleme:** 31 Ekim 2025  
**Versiyon:** 1.0.0  
**Lisans:** MIT








