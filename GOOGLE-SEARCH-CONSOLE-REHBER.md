# 🚀 Google Search Console - Sitemap Submit Rehberi

**Proje:** busbuskimki (BüşBüşKimKi)  
**Tarih:** 13 Ekim 2025  
**Domain:** https://busbuskimki.com

---

## 📋 İÇİNDEKİLER

1. [Google Search Console Hesap Açma](#1-google-search-console-hesap-açma)
2. [Site Ownership Verification](#2-site-ownership-verification)
3. [Sitemap Submit Etme](#3-sitemap-submit-etme)
4. [Bing Webmaster Tools](#4-bing-webmaster-tools)
5. [Verification Kodlarını Environment'a Ekleme](#5-verification-kodlarını-environmenta-ekleme)
6. [Test ve Kontrol](#6-test-ve-kontrol)

---

## 1. GOOGLE SEARCH CONSOLE HESAP AÇMA

### Adım 1.1: Google Search Console'a Git

🔗 **Link:** https://search.google.com/search-console

1. Google hesabınızla giriş yapın
2. "Hemen Başlayın" veya "Property Ekle" butonuna tıklayın

### Adım 1.2: Property Tipi Seç

İki seçenek var:

#### ✅ ÖNERİLEN: URL Prefix

```
URL prefix: https://busbuskimki.com
```

**Avantajları:**

- Sadece bu domain için geçerli
- Daha spesifik kontrol
- Alt domain'ler ayrı eklenebilir

#### Domain Property (Tüm Subdomain'ler)

```
Domain: busbuskimki.com
```

**Not:** DNS verification gerektirir (daha karmaşık)

---

## 2. SITE OWNERSHIP VERIFICATION

### Adım 2.1: HTML Meta Tag Yöntemi Seç

Google size birkaç verification yöntemi sunar. **HTML Meta Tag** en kolay
yöntemdir:

1. "HTML tag" seçeneğini seçin
2. Size bir kod verilecek, örnek:
   ```html
   <meta name="google-site-verification" content="abc123XYZ456def789" />
   ```
3. Sadece **content** kısmını kopyalayın:
   ```
   abc123XYZ456def789
   ```

### Adım 2.2: Verification Kodunu Environment'a Ekle

#### Local Development (`.env.local` dosyası):

```bash
# Site URL
NEXT_PUBLIC_SITE_URL=https://busbuskimki.com

# SEO Verification Codes
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123XYZ456def789
NEXT_PUBLIC_BING_SITE_VERIFICATION=
```

#### Production (Vercel Dashboard):

1. Vercel Dashboard'a git: https://vercel.com
2. Projenizi seçin: **busbuskimki**
3. **Settings** → **Environment Variables**
4. Şu değişkenleri ekle:

| Name                                   | Value                     | Environment                      |
| -------------------------------------- | ------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | `https://busbuskimki.com` | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `abc123XYZ456def789`      | Production, Preview              |

**Önemli:** Environment variables ekledikten sonra **Redeploy** yapmanız
gerekir!

### Adım 2.3: Deploy ve Verification

1. **Vercel'de Redeploy:**
   - Deployments → En son deployment → "Redeploy"
2. **Google Search Console'a Dön:**
   - "Verify" butonuna tıkla
   - ✅ Başarılı mesajı almalısınız!

**Not:** Verification başarısız olursa:

- 5-10 dakika bekleyin (DNS propagation)
- Tarayıcı cache'ini temizleyin
- Incognito modda test edin

---

## 3. SITEMAP SUBMIT ETME

### Adım 3.1: Sitemap URL'inizi Hazırlayın

Sitemap'iniz şu adreste:

```
https://busbuskimki.com/sitemap.xml
```

### Adım 3.2: Google Search Console'da Sitemap Ekle

1. **Sol menüden "Sitemaps"** sekmesine gidin
2. **"Yeni sitemap ekle" / "Add a new sitemap"**
3. Sitemap URL'sini girin:
   ```
   sitemap.xml
   ```
   (Tam URL değil, sadece `sitemap.xml` yazın)
4. **"Submit" / "Gönder"** butonuna tıklayın

### Adım 3.3: Sitemap Durumunu Kontrol Edin

- ✅ **Başarılı:** "Success" / "Başarılı" durumu
- ⏳ **Bekleniyor:** "Pending" - Birkaç saat bekleyin
- ❌ **Hata:** Hata mesajını kontrol edin

**Sitemap İstatistikleri (Birkaç gün sonra):**

```
Discovered URLs: ~510+ sayfa
├── Ana sayfalar: 3
├── Tarot sayfaları: 18
├── Kart sayfaları: 234
└── Diğer sayfalar: ~255
```

---

## 4. BING WEBMASTER TOOLS

Google'dan sonra Bing'e de ekleyin (daha kolay):

### Adım 4.1: Bing Webmaster Tools'a Git

🔗 **Link:** https://www.bing.com/webmasters

1. Microsoft hesabınızla giriş yapın
2. **"Import from Google Search Console"** seçeneğini kullanın (en kolay!)
3. Veya manuel ekleyin: **"Add a site"**

### Adım 4.2: Verification

**HTML Meta Tag Yöntemi:**

```html
<meta name="msvalidate.01" content="XYZ789ABC123" />
```

**Content kısmını kopyalayın:**

```
XYZ789ABC123
```

**.env.local'e ekleyin:**

```bash
NEXT_PUBLIC_BING_SITE_VERIFICATION=XYZ789ABC123
```

**Vercel'e de ekleyin** (Google gibi)

### Adım 4.3: Sitemap Submit

```
https://busbuskimki.com/sitemap.xml
```

Bing'de sitemap submit daha hızlı işler (genelde 1-2 saat içinde).

---

## 5. VERIFICATION KODLARINI ENVIRONMENT'A EKLEME

### Local Development

`.env.local` dosyası oluşturun (proje root'unda):

```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://busbuskimki.com

# SEO Verification Codes
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123XYZ456def789
NEXT_PUBLIC_BING_SITE_VERIFICATION=XYZ789ABC123

# Supabase (mevcut kodlarınızı koruyun)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Önemli:** `.env.local` dosyası `.gitignore`'da olmalı (zaten var)

### Vercel Production

**Vercel Dashboard → Settings → Environment Variables:**

| Variable                               | Value                        | Environments                     |
| -------------------------------------- | ---------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | `https://busbuskimki.com`    | Production, Preview, Development |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | `[Google'dan aldığınız kod]` | Production, Preview              |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION`   | `[Bing'den aldığınız kod]`   | Production, Preview              |

**Environment variables ekledikten sonra mutlaka Redeploy yapın!**

---

## 6. TEST VE KONTROL

### 6.1 Sitemap Test

**Tarayıcıda Açın:**

```
https://busbuskimki.com/sitemap.xml
```

**Görmemiz Gereken:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://busbuskimki.com/tr</loc>
    <lastmod>2025-10-13</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- 510+ daha fazla URL... -->
</urlset>
```

### 6.2 Robots.txt Test

**Tarayıcıda Açın:**

```
https://busbuskimki.com/robots.txt
```

**Görmemiz Gereken:**

```text
User-agent: *
Allow: /

# Sitemap
Sitemap: https://busbuskimki.com/sitemap.xml

# Allow static assets for better crawling
Allow: /_next/static/
...
```

### 6.3 Meta Tag Verification Test

**HTML Source'u Kontrol Edin:**

Tarayıcıda ana sayfayı açın ve **Sağ Tık → "View Page Source"** / "Kaynağı
Görüntüle"

**Aranacak kodlar:**

```html
<meta name="google-site-verification" content="abc123..." />
<meta name="msvalidate.01" content="XYZ789..." />
```

### 6.4 Google Search Console Test Araçları

**URL Inspection Tool:**

```
Google Search Console → URL Inspection
→ https://busbuskimki.com/tr
```

**Test Edilecek:**

- ✅ URL is on Google (indexed)
- ✅ Sitemaps: sitemap.xml
- ✅ Canonical URL: https://busbuskimki.com/tr
- ✅ Mobile-friendly: Yes

### 6.5 Rich Results Test

**Google Rich Results Test:** 🔗 https://search.google.com/test/rich-results

Test URL'leri:

```
https://busbuskimki.com/tr
https://busbuskimki.com/tr/kartlar/joker
https://busbuskimki.com/tr/tarotokumasi
```

**Görmemiz Gereken Schema'lar:**

- ✅ Organization
- ✅ WebSite
- ✅ Service
- ✅ Article (kart sayfalarında)
- ✅ FAQPage
- ✅ Breadcrumb

---

## 📊 BEKLENEN SONUÇLAR

### İlk 24 Saat

- ✅ Sitemap submitted
- ✅ Verification başarılı
- ⏳ Crawling başladı

### 1 Hafta İçinde

- ✅ 50-100 sayfa indexed
- ✅ İlk trafik verileri
- ✅ Search queries görünmeye başlar

### 1 Ay İçinde

- ✅ 300+ sayfa indexed
- ✅ Organik trafik %20-30 artış
- ✅ Top 100'e giren keyword'ler

### 3 Ay İçinde

- ✅ 500+ sayfa indexed
- ✅ Organik trafik %50-100 artış
- ✅ Top 10'a giren keyword'ler

---

## 🔍 SORUN GİDERME

### Sitemap Submitted Ama Indexed Değil

**Olası Sebepler:**

1. **Crawl Budget:** Google henüz tüm sayfaları indexlemedi
   - **Çözüm:** Sabırlı olun, 1-2 hafta sürebilir
2. **Robots.txt Engeli:** Bazı sayfalar engellenmiş
   - **Kontrol:** https://busbuskimki.com/robots.txt
   - **Çözüm:** Disallow satırlarını kontrol edin

3. **Duplicate Content:** Aynı içerik birden fazla URL'de
   - **Kontrol:** Canonical URL'leri kontrol edin
   - **Çözüm:** Her sayfa için benzersiz canonical URL var ✅

4. **Low Quality Content:** İçerik kalitesi düşük
   - **Kontrol:** Google Search Console → Coverage
   - **Çözüm:** İçerikleri zenginleştirin

### Verification Başarısız

**Olası Sebepler:**

1. **Environment Variable Eklenmemiş**
   - **Çözüm:** `.env.local` ve Vercel'e ekleyin
2. **Redeploy Yapılmamış**
   - **Çözüm:** Vercel'de Redeploy yapın
3. **Cache Problemi**
   - **Çözüm:** Browser cache temizleyin, Incognito deneyin

4. **Yanlış Kod**
   - **Çözüm:** Google'dan tekrar kod alın, kontrol edin

### Sitemap Errors

**Olası Hatalar:**

**1. Sitemap couldn't be read**

```
Çözüm: sitemap.xml URL'sini kontrol edin
Test: curl https://busbuskimki.com/sitemap.xml
```

**2. Sitemap is HTML**

```
Çözüm: Sitemap route'u kontrol edin
Dosya: src/app/sitemap.ts
```

**3. Submitted URL not found (404)**

```
Çözüm: URL'lerin gerçekten var olduğunu kontrol edin
Test: Her bir URL'yi tarayıcıda açın
```

---

## 📱 MOBİL UYUMLULUK TESTI

**Google Mobile-Friendly Test:** 🔗
https://search.google.com/test/mobile-friendly

Test URL:

```
https://busbuskimki.com/tr
```

**Beklenen Sonuç:**

```
✅ Page is mobile-friendly
✅ Text is readable without zooming
✅ Content wider than screen
✅ Touch elements not too close
```

---

## 🔔 UYARILAR VE BİLDİRİMLER

### Google Search Console'da İzlenecekler

**Performance (Performans):**

- Total clicks (Toplam tıklama)
- Total impressions (Toplam gösterim)
- Average CTR (Ortalama tıklama oranı)
- Average position (Ortalama sıralama)

**Coverage (Kapsam):**

- Valid (Geçerli): Indexed sayfalar
- Warning (Uyarı): Sorunlu sayfalar
- Error (Hata): Indexlenemeyen sayfalar
- Excluded (Hariç): Kasıtlı olarak indexlenmeyen

**Enhancements (İyileştirmeler):**

- Mobile usability (Mobil kullanılabilirlik)
- Breadcrumbs (Breadcrumb hatları)
- FAQ (SSS)
- Article (Makale)

**Security Issues (Güvenlik Sorunları):**

- Hacked content (Hacklenmiş içerik)
- Malware (Zararlı yazılım)

---

## 📅 KONTROL TAKVIMI

### Günlük Kontroller (İlk 1 Hafta)

- [ ] Sitemap status
- [ ] Indexed pages count
- [ ] Crawl errors

### Haftalık Kontroller (İlk 1 Ay)

- [ ] Performance metrics
- [ ] Top queries
- [ ] Click-through rate
- [ ] Mobile usability

### Aylık Kontroller

- [ ] Indexed pages (hedef: 500+)
- [ ] Organic traffic growth
- [ ] Keyword rankings
- [ ] Core Web Vitals

---

## 🎯 HEDEFLER VE KPI'LAR

### 1 Ay Sonra

- ✅ Indexed pages: 300+
- ✅ Total impressions: 1,000+
- ✅ Total clicks: 50+
- ✅ Average position: <50

### 3 Ay Sonra

- ✅ Indexed pages: 500+
- ✅ Total impressions: 10,000+
- ✅ Total clicks: 500+
- ✅ Average position: <30

### 6 Ay Sonra

- ✅ Indexed pages: 510+ (tümü)
- ✅ Total impressions: 50,000+
- ✅ Total clicks: 2,500+
- ✅ Average position: <20

---

## 📞 DESTEK VE KAYNAKLAR

### Resmi Dokümantasyonlar

- Google Search Console Help: https://support.google.com/webmasters
- Bing Webmaster Guidelines: https://www.bing.com/webmasters/help
- Next.js SEO: https://nextjs.org/learn/seo

### Test Araçları

- Google Search Console: https://search.google.com/search-console
- Google Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly Test: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev

### Monitoring Araçları

- Google Analytics: https://analytics.google.com
- Vercel Analytics: https://vercel.com/analytics

---

## ✅ CHECKLIST - ADIM ADIM

Tamamladıkça işaretleyin:

### Google Search Console

- [ ] 1. Google Search Console hesabı aç
- [ ] 2. Property ekle (https://busbuskimki.com)
- [ ] 3. HTML meta tag verification kodu al
- [ ] 4. Kodu `.env.local`'e ekle
- [ ] 5. Kodu Vercel environment'a ekle
- [ ] 6. Vercel'de Redeploy yap
- [ ] 7. Google'da Verify butonuna tıkla
- [ ] 8. Verification başarılı mesajı al
- [ ] 9. Sitemaps sekmesine git
- [ ] 10. `sitemap.xml` submit et
- [ ] 11. Sitemap başarılı durumu bekle (birkaç saat)

### Bing Webmaster Tools

- [ ] 12. Bing Webmaster Tools hesabı aç
- [ ] 13. "Import from Google" ile ekle (en kolay)
- [ ] 14. Veya manuel ekle ve verification yap
- [ ] 15. Bing'de sitemap submit et

### Test ve Kontrol

- [ ] 16. Sitemap'i tarayıcıda test et
- [ ] 17. Robots.txt'i tarayıcıda test et
- [ ] 18. Meta tag'leri HTML source'da kontrol et
- [ ] 19. Google Rich Results Test yap
- [ ] 20. Mobile-Friendly Test yap
- [ ] 21. URL Inspection Tool kullan

### Monitoring

- [ ] 22. İlk hafta günlük kontrol
- [ ] 23. İlk ay haftalık kontrol
- [ ] 24. Sonrası aylık kontrol

---

## 🎉 TEBRİKLER!

Sitemap'inizi başarıyla submit ettiniz!

**Sonraki Adımlar:**

1. ✅ Sabırlı olun (indexleme 1-2 hafta sürebilir)
2. ✅ Performance metrics'i takip edin
3. ✅ İçerik kalitesini artırın
4. ✅ Backlink stratejisi geliştirin

**Sorularınız için:**

- Google Search Console Help Center
- Web Developer Community
- SEO Forums

---

**Hazırlayan:** AI SEO Uzmanı  
**Tarih:** 13 Ekim 2025  
**Versiyon:** 1.0  
**Proje:** busbuskimki (BüşBüşKimKi)

---

_Bu rehber, sitemap'inizi Google Search Console'a submit etmek için gereken tüm
adımları içerir. Takıldığınız bir yer olursa, ilgili bölüme geri dönün._
