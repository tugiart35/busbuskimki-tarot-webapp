# 🔐 Google Verification & AdSense Kurulum Rehberi

**Tarih:** 14 Ekim 2025
**Durum:** ✅ KURULUM TAMAMLANDI

---

## ✅ Yapılan Kurulum

### 1. Google Site Verification

**Verification Code:** `9jC0OHEYEMjbGS1yL65eyZ-QRAN_uPHn0lRvxtdK9GU`

**Eklenen Kod (src/app/layout.tsx:62-65):**
```html
<meta
  name='google-site-verification'
  content='9jC0OHEYEMjbGS1yL65eyZ-QRAN_uPHn0lRvxtdK9GU'
/>
```

### 2. Google AdSense

**Publisher ID:** `ca-pub-7105264375916972`

**Eklenen Kod (src/app/layout.tsx:74-78):**
```html
<script
  async
  src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7105264375916972'
  crossOrigin='anonymous'
/>
```

### 3. Environment Variables

**Eklenen (.env:34-38):**
```bash
# SEO & Verification
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=9jC0OHEYEMjbGS1yL65eyZ-QRAN_uPHn0lRvxtdK9GU
NEXT_PUBLIC_BING_SITE_VERIFICATION=

# Google AdSense
NEXT_PUBLIC_GOOGLE_ADSENSE_ID=ca-pub-7105264375916972
```

---

## 🧪 Build Test

```bash
npm run build

✅ Compiled successfully in 25.0s
✅ Generating static pages (17/17)
✅ No errors
```

---

## 📋 Google Search Console Verification Adımları

### Adım 1: Google Search Console'a Giriş
1. [Google Search Console](https://search.google.com/search-console) adresine gidin
2. Google hesabınızla giriş yapın (busbuskimkionline@gmail.com)

### Adım 2: Property Ekle
1. Sol üstteki property dropdown'a tıklayın
2. "Add property" butonuna tıklayın
3. **URL prefix** seçeneğini seçin
4. URL girin: `https://busbuskimki.com`
5. "Continue" butonuna tıklayın

### Adım 3: Verification Metodunu Seç
1. **HTML tag** metodunu seçin (zaten kodda var)
2. Verification code'u kontrol edin:
   ```
   9jC0OHEYEMjbGS1yL65eyZ-QRAN_uPHn0lRvxtdK9GU
   ```
3. Code zaten `src/app/layout.tsx`'da mevcut ✅

### Adım 4: Site'ı Deploy Edin ve Verify Edin
1. **Önce site'ı deploy edin** (Vercel)
2. Deploy tamamlandıktan sonra Google Search Console'a dönün
3. "Verify" butonuna tıklayın

### Adım 5: Verification Kontrolü
```bash
# Deployment sonrası test
curl https://busbuskimki.com | grep "google-site-verification"

# Beklenen çıktı:
# <meta name='google-site-verification' content='9jC0OHEYEMjbGS1yL65eyZ-QRAN_uPHn0lRvxtdK9GU'/>
```

---

## 🎯 Google AdSense Onay Süreci

### AdSense Hesap Durumu

**Publisher ID:** `ca-pub-7105264375916972`
**Script:** ✅ Eklendi

### Deployment Sonrası Yapılacaklar

#### 1. AdSense Hesabını Kontrol Edin
1. [Google AdSense](https://www.google.com/adsense) adresine gidin
2. Hesabınızla giriş yapın
3. "Sites" menüsüne gidin
4. `busbuskimki.com` ekli mi kontrol edin

#### 2. Site'ı AdSense'e Ekleyin (Eğer yoksa)
1. AdSense Dashboard > Sites
2. "Add site" butonuna tıklayın
3. URL girin: `busbuskimki.com`
4. Kod zaten eklendi ✅
5. "Save and continue" tıklayın

#### 3. AdSense Code Verification
```bash
# Deployment sonrası test
curl https://busbuskimki.com | grep "pagead2.googlesyndication.com"

# Beklenen çıktı:
# <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7105264375916972" crossOrigin="anonymous"></script>
```

#### 4. AdSense Onay Süreci (Beklenti)
- **1-3 gün:** Google site'ı tarayacak ve kodu doğrulayacak
- **1-2 hafta:** İçerik ve trafik değerlendirmesi
- **Sonuç:** Email ile bildirim gelecek

### AdSense Onay Kriterleri Kontrolü

✅ **Teknik Gereksinimler:**
- [x] AdSense kodu doğru yerde (head içinde)
- [x] Responsive design (mobil uyumlu)
- [x] HTTPS (Vercel otomatik)
- [x] robots.txt mevcut
- [x] Sitemap mevcut

✅ **İçerik Gereksinimleri:**
- [x] Özgün içerik (Tarot açılımları, numeroloji)
- [x] 3 dil desteği (TR, EN, SR)
- [x] 300+ sayfa (234 kart + spreads + ana sayfalar)
- [x] Legal sayfalar (privacy, terms, disclaimer)
- [x] Contact bilgileri mevcut

⚠️ **Trafik Gereksinimleri:**
- [ ] Günlük ziyaretçi (deployment sonrası gelişecek)
- [ ] Organik trafik (SEO optimizasyonu yapıldı)
- [ ] User engagement (interactive tarot okuma)

---

## 🔍 Verification Kontrolü

### Local Test (Deployment Öncesi)
```bash
# Build
npm run build

# Start
npm run start

# Test (başka terminal)
curl http://localhost:3000 | grep -E "(google-site-verification|adsbygoogle)"
```

### Production Test (Deployment Sonrası)
```bash
# Google Verification
curl https://busbuskimki.com | grep "google-site-verification"

# AdSense Script
curl https://busbuskimki.com | grep "pagead2.googlesyndication.com"

# Full head check
curl -s https://busbuskimki.com | grep -A 50 "<head>" | head -70
```

---

## 📊 Search Console İlk Adımlar

### Deployment Sonrası İlk 24 Saat

1. **Sitemap Submit**
   ```
   Google Search Console > Sitemaps
   Add: sitemap.xml
   ```

2. **URL Inspection**
   ```
   - Ana sayfa: https://busbuskimki.com/tr
   - Tarot: https://busbuskimki.com/tr/tarotokumasi
   - Numeroloji: https://busbuskimki.com/tr/numeroloji
   ```

3. **Coverage Kontrol**
   ```
   Coverage > Overview
   Hata var mı kontrol et
   ```

### İlk Hafta

1. **Indexing Status**
   - Submitted: ~300 sayfa
   - Indexed: İlk gün 10-20 başlar
   - Hedef: 1 hafta içinde 100+

2. **Performance Monitoring**
   - Clicks: Başlangıçta 0 (normal)
   - Impressions: İlk hafta düşük
   - CTR: SEO optimization sayesinde iyi olmalı

3. **Mobile Usability**
   - Errors: 0 olmalı (responsive design)
   - Valid pages: Tüm sayfalar

---

## 🎯 AdSense İlk Adımlar

### Deployment Sonrası İlk 48 Saat

1. **AdSense Dashboard Kontrol**
   ```
   Sites > busbuskimki.com
   Status: "Getting ready" veya "Ready"
   ```

2. **Code Verification**
   ```
   Sites > Code verification
   Status: Should be "Verified" ✅
   ```

### İlk Hafta

1. **Site Review Status**
   ```
   AdSense > Sites
   Status: "In review" (1-2 hafta)
   ```

2. **Policy Compliance**
   - Adult content: Yok ✅
   - Copyrighted content: Özgün içerik ✅
   - Prohibited content: Yok ✅

### Onay Aldıktan Sonra

1. **Auto Ads Aktif Et (Önerilen)**
   ```
   AdSense > Ads > By site > Auto ads
   Toggle: ON
   ```

2. **İlk Ad Unit Oluştur**
   ```
   AdSense > Ads > By site > Ad units
   Create: Display ads, In-article, etc.
   ```

---

## 🚨 Troubleshooting

### Google Verification Başarısız
```bash
# Problem: Verification failed
# Çözüm:
1. Meta tag doğru mu kontrol et
2. Site deploy edilmiş mi kontrol et
3. HTTPS çalışıyor mu kontrol et
4. Cache temizle ve tekrar dene
```

### AdSense Code Görünmüyor
```bash
# Problem: AdSense script sayfada yok
# Çözüm:
1. Build başarılı mı kontrol et
2. src/app/layout.tsx değişikliği commit edilmiş mi?
3. Vercel'de yeni deploy yapıldı mı?
4. Browser cache temizle (Ctrl+Shift+R)
```

### AdSense Onaylanmadı
```bash
# Problem: Site rejected
# Muhtemel sebepler:
1. İçerik yetersiz (bekle, trafik artsın)
2. Policy violation (legal sayfaları kontrol et)
3. Trafik düşük (SEO optimization'ı bekle)

# Çözüm:
1. Rejection email'i oku
2. Belirtilen sorunları düzelt
3. 1-2 hafta sonra tekrar başvur
```

---

## ✅ Checklist: Deployment Öncesi

- [x] Google verification meta tag eklendi
- [x] AdSense script eklendi
- [x] Environment variables güncellendi
- [x] Build test başarılı
- [x] Local test yapıldı
- [ ] Vercel'e deploy edildi
- [ ] Production test yapıldı
- [ ] Google Search Console'da verify edildi
- [ ] Sitemap submit edildi
- [ ] AdSense hesap kontrol edildi

---

## 📁 Değiştirilen Dosyalar

1. **src/app/layout.tsx** - Google tags eklendi
2. **.env** - Verification ve AdSense ID'leri eklendi
3. **GOOGLE-VERIFICATION-ADSENSE-GUIDE.md** - Bu dosya

---

## 🔗 Faydalı Linkler

- [Google Search Console](https://search.google.com/search-console)
- [Google AdSense](https://www.google.com/adsense)
- [AdSense Help Center](https://support.google.com/adsense)
- [Search Console Help](https://support.google.com/webmasters)
- [Verification Troubleshooting](https://support.google.com/webmasters/answer/9008080)

---

**Son Güncelleme:** 14 Ekim 2025
**Build Status:** ✅ BAŞARILI
**Deployment Status:** ⏳ BEKLIYOR
