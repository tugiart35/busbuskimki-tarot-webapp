# ✅ Canonical URL Test Rehberi

## 🎯 Canonical URL Nedir?

Canonical URL, arama motorlarına bir sayfanın "resmi" versiyonunu bildiren meta
tag'dir. Özellikle çoklu dil sitelerinde kritik öneme sahiptir.

## ✅ TEST SONUÇLARI

**Son Test:** 14 Ekim 2025 **Durum:** ✅ TÜM TESTLER BAŞARILI (31/31) **Başarı
Oranı:** 100%

```bash
# Test komutu
node tests/canonical-url-validator.js

# Sonuç
✅ ALL TESTS PASSED! Canonical URLs are correct.
Total Tests: 31 | Passed: 31 | Failed: 0
```

## 📋 Projedeki Canonical URL Yapısı

### 1. Ana Sayfa Canonical URLs ✅

**Türkçe:**

```
Canonical: https://busbuskimki.com/tr
Hreflang x-default: https://busbuskimki.com/tr
Hreflang tr: https://busbuskimki.com/tr
Hreflang en: https://busbuskimki.com/en
Hreflang sr: https://busbuskimki.com/sr
```

**İngilizce:**

```
Canonical: https://busbuskimki.com/en
Hreflang x-default: https://busbuskimki.com/tr
Hreflang tr: https://busbuskimki.com/tr
Hreflang en: https://busbuskimki.com/en
Hreflang sr: https://busbuskimki.com/sr
```

**Sırpça:**

```
Canonical: https://busbuskimki.com/sr
Hreflang x-default: https://busbuskimki.com/tr
Hreflang tr: https://busbuskimki.com/tr
Hreflang en: https://busbuskimki.com/en
Hreflang sr: https://busbuskimki.com/sr
```

**NOT:** Canonical URL'ler gerçek route'ları kullanır (/tr, /en, /sr).
SEO-friendly redirect'ler middleware tarafından yönetilir.

### 2. Tarot Okuma Sayfaları ✅

**Türkçe:**

```
Canonical: https://busbuskimki.com/tr/tarotokumasi
Hreflang x-default: https://busbuskimki.com/tr/tarotokumasi
Hreflang tr: https://busbuskimki.com/tr/tarotokumasi
Hreflang en: https://busbuskimki.com/en/tarotokumasi
Hreflang sr: https://busbuskimki.com/sr/tarotokumasi
```

**İngilizce:**

```
Canonical: https://busbuskimki.com/en/tarotokumasi
```

**Sırpça:**

```
Canonical: https://busbuskimki.com/sr/tarotokumasi
```

### 3. Numeroloji Sayfaları

Kaynak: `src/lib/seo/numerology-seo-generator.ts:82-105`

**Türkçe:**

```
Canonical: https://busbuskimki.com/tr/numeroloji
```

**İngilizce:**

```
Canonical: https://busbuskimki.com/en/numerology
```

**Sırpça:**

```
Canonical: https://busbuskimki.com/sr/numerologija
```

### 4. Tarot Kart Sayfaları

**Türkçe:**

```
Canonical: https://busbuskimki.com/tr/kartlar/[slug]
Örnek: https://busbuskimki.com/tr/kartlar/joker
```

**İngilizce:**

```
Canonical: https://busbuskimki.com/en/cards/[slug]
Örnek: https://busbuskimki.com/en/cards/the-fool
```

**Sırpça:**

```
Canonical: https://busbuskimki.com/sr/kartice/[slug]
Örnek: https://busbuskimki.com/sr/kartice/joker
```

## 🧪 Test Metodları

### Otomatik Test Suite

**Kullanım:**

```bash
# Tüm canonical URL'leri test et
node tests/canonical-url-validator.js

# Package.json script olarak
npm run test:canonical
```

**Test edilen durumlar:**

- ✅ Homepage canonical URL formatı
- ✅ Hreflang tags (x-default, tr, en, sr)
- ✅ Tarot canonical paths (tüm diller)
- ✅ Numerology canonical paths (tüm diller)
- ✅ Breadcrumb home URL'leri
- ✅ robots.ts sitemap referansı
- ✅ sitemap.ts içerik kontrolü

**Test Çıktısı:**

```
╔════════════════════════════════════════════════════╗
║     CANONICAL URL VALIDATION TEST SUITE         ║
╚════════════════════════════════════════════════════╝

=== Testing page-seo-generator.ts ===
✓ Homepage canonical URL format is correct
✓ x-default hreflang is correct
✓ TR hreflang is correct
✓ EN hreflang is correct
✓ SR hreflang is correct

=== Testing tarot-seo-generator.ts ===
✓ TR tarot canonical path is correct
✓ EN tarot canonical path is correct
✓ SR tarot canonical path is correct
✓ x-default hreflang is correct
✓ TR hreflang is correct
✓ EN hreflang is correct
✓ SR hreflang is correct
✓ TR breadcrumb home is correct
✓ EN breadcrumb home is correct
✓ SR breadcrumb home is correct

=== Testing numerology-seo-generator.ts ===
✓ TR numerology canonical path is correct
✓ EN numerology canonical path is correct
✓ SR numerology canonical path is correct
✓ TR breadcrumb home is correct
✓ EN breadcrumb home is correct
✓ SR breadcrumb home is correct

=== Testing robots.ts ===
✓ Sitemap reference exists
✓ Host declaration exists
✓ API routes blocked exists
✓ Disallow rules exist exists

=== Testing sitemap.ts ===
✓ TR homepage in sitemap exists
✓ EN homepage in sitemap exists
✓ SR homepage in sitemap exists
✓ TR tarot in sitemap exists
✓ Priority values set exists
✓ Change frequency set exists

╔════════════════════════════════════════════════════╗
║              TEST RESULTS                        ║
╚════════════════════════════════════════════════════╝

Total Tests: 31
Passed: 31
Failed: 0

Success Rate: 100.00%

✅ ALL TESTS PASSED! Canonical URLs are correct.
```

---

### Deployment Sonrası Manuel Test

#### 1. HTML Source Kontrolü

```bash
# Ana sayfa TR
curl https://busbuskimki.com/tr | grep -i "canonical"
# Beklenen: <link rel="canonical" href="https://busbuskimki.com/tr/anasayfa"/>

# Ana sayfa EN
curl https://busbuskimki.com/en | grep -i "canonical"
# Beklenen: <link rel="canonical" href="https://busbuskimki.com/en/home"/>

# Ana sayfa SR
curl https://busbuskimki.com/sr | grep -i "canonical"
# Beklenen: <link rel="canonical" href="https://busbuskimki.com/sr/pocetna"/>
```

#### 2. Hreflang Kontrolü

```bash
# Tüm hreflang tag'lerini göster
curl https://busbuskimki.com/tr | grep -i "hreflang"

# Beklenen çıktı:
# <link rel="alternate" hreflang="x-default" href="https://busbuskimki.com/tr/anasayfa"/>
# <link rel="alternate" hreflang="tr" href="https://busbuskimki.com/tr/anasayfa"/>
# <link rel="alternate" hreflang="en" href="https://busbuskimki.com/en/home"/>
# <link rel="alternate" hreflang="sr" href="https://busbuskimki.com/sr/pocetna"/>
```

#### 3. Browser DevTools ile Test

```
1. Chrome DevTools açın (F12)
2. Elements tab'ına gidin
3. <head> içinde arayın:
   - <link rel="canonical">
   - <link rel="alternate" hreflang="">
4. Değerleri kontrol edin
```

### Online Araçlar ile Test

#### 1. Google Rich Results Test

```
https://search.google.com/test/rich-results
```

- URL'yi girin
- "Test URL" butonuna tıklayın
- Canonical ve hreflang tag'lerini kontrol edin

#### 2. Merkle Hreflang Tags Testing Tool

```
https://technicalseo.com/tools/hreflang/
```

- Site URL'sini girin
- Hreflang implementation'ı analiz edin
- Hatalar varsa gösterir

#### 3. Screaming Frog SEO Spider

```
1. Tool'u indirin: https://www.screamingfrogseoseo.com/seo-spider/
2. Site'ı crawl edin: https://busbuskimki.com
3. "Canonicals" tab'ına gidin
4. Her sayfanın canonical URL'ini kontrol edin
5. "Hreflang" tab'ına gidin
6. Çoklu dil yapılandırmasını analiz edin
```

## 🔍 Kontrol Listesi

### Deployment Sonrası İlk 24 Saat

- [ ] **Ana Sayfa Canonical**
  - [ ] `/tr` → canonical: `/tr/anasayfa` ✓
  - [ ] `/en` → canonical: `/en/home` ✓
  - [ ] `/sr` → canonical: `/sr/pocetna` ✓

- [ ] **Hreflang Tags**
  - [ ] x-default: `/tr/anasayfa` ✓
  - [ ] Her dil için alternate tag var ✓
  - [ ] URL'ler absolute (tam URL) ✓

- [ ] **Tarot Sayfaları**
  - [ ] `/tr/tarotokumasi` → canonical doğru ✓
  - [ ] `/en/tarotokumasi` → canonical doğru ✓
  - [ ] `/sr/tarotokumasi` → canonical doğru ✓

- [ ] **Numeroloji Sayfaları**
  - [ ] `/tr/numeroloji` → canonical doğru ✓
  - [ ] `/en/numerology` → canonical doğru ✓
  - [ ] `/sr/numerologija` → canonical doğru ✓

- [ ] **Kart Sayfaları**
  - [ ] `/tr/kartlar/joker` → canonical doğru ✓
  - [ ] `/en/cards/the-fool` → canonical doğru ✓
  - [ ] `/sr/kartice/joker` → canonical doğru ✓

### Yaygın Hatalar ve Çözümleri

#### ❌ Hata 1: Relative URL Kullanımı

```html
<!-- YANLIŞ -->
<link rel="canonical" href="/tr/anasayfa" />

<!-- DOĞRU -->
<link rel="canonical" href="https://busbuskimki.com/tr/anasayfa" />
```

#### ❌ Hata 2: Trailing Slash Tutarsızlığı

```html
<!-- Hep aynı formatta olmalı -->
<link rel="canonical" href="https://busbuskimki.com/tr/anasayfa" /> ✓
<link rel="canonical" href="https://busbuskimki.com/tr/anasayfa/" /> ✗
```

#### ❌ Hata 3: x-default Eksikliği

```html
<!-- x-default mutlaka olmalı (genelde default dil) -->
<link
  rel="alternate"
  hreflang="x-default"
  href="https://busbuskimki.com/tr/anasayfa"
/>
✓
```

#### ❌ Hata 4: Self-referencing Hreflang Eksikliği

```html
<!-- TR sayfasında TR için de hreflang olmalı -->
<link
  rel="alternate"
  hreflang="tr"
  href="https://busbuskimki.com/tr/anasayfa"
/>
✓
<link rel="alternate" hreflang="en" href="https://busbuskimki.com/en/home" /> ✓
<link rel="alternate" hreflang="sr" href="https://busbuskimki.com/sr/pocetna" />
✓
```

## 📊 Kod Konumları

### Canonical URL Generator'lar

1. **Ana Sayfa:** `src/lib/seo/page-seo-generator.ts:136`

```typescript
const canonicalUrl = `${baseUrl}/${locale}${homePath}`;
```

2. **Numeroloji:** `src/lib/seo/numerology-seo-generator.ts:82`

```typescript
canonical: `${baseUrl}${data!.canonicalPath}`;
```

3. **Enhanced Meta:** `src/lib/seo/enhanced-meta-generator.ts:63`

```typescript
canonical: `${baseUrl}/${locale}/${localePrefix}/${slug}`;
```

### Hreflang URLs

**Kaynak:** `src/lib/seo/page-seo-generator.ts:138-144`

```typescript
const hreflangUrls = {
  'x-default': `${baseUrl}/tr/anasayfa`,
  tr: `${baseUrl}/tr/anasayfa`,
  en: `${baseUrl}/en/home`,
  sr: `${baseUrl}/sr/pocetna`,
};
```

## 🎯 Beklenen Davranış

### Google Search Console'da

1. **Coverage Raporu**
   - Tüm sayfalar "Valid" olmalı
   - "Duplicate, submitted URL not selected as canonical" hatası olmamalı

2. **International Targeting**
   - Hreflang tag'leri doğru algılanmalı
   - Dil-ülke eşleşmeleri görünmeli

3. **URL Inspection**
   - Canonical URL doğru gösterilmeli
   - Alternate URLs listelenmeli

### Bing Webmaster Tools'da

1. **SEO Reports > Hreflang**
   - Implementation doğru gösterilmeli
   - Hatalar listelenmemeli

2. **URL Inspection**
   - Canonical ve alternate URL'ler doğru olmalı

## ✅ Başarı Kriterleri

- ✅ Her sayfa bir canonical URL'e sahip
- ✅ Canonical URL'ler absolute (tam URL)
- ✅ Hreflang tag'leri her sayfada mevcut
- ✅ x-default tag'i Türkçe ana sayfayı işaret ediyor
- ✅ Self-referencing hreflang tag'leri var
- ✅ Google Search Console'da hata yok
- ✅ Duplicate content hatası yok

---

**Dosya Konumları:**

- Robots: `src/app/robots.ts`
- Sitemap: `src/app/sitemap.ts`
- Ana Sayfa SEO: `src/lib/seo/page-seo-generator.ts`
- Numeroloji SEO: `src/lib/seo/numerology-seo-generator.ts`
- Tarot SEO: `src/lib/seo/tarot-seo-generator.ts`

**Son Güncelleme:** 14 Ekim 2025
