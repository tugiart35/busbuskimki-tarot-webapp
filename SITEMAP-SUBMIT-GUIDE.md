# 🗺️ Sitemap Submit Rehberi

## Sitemap URL'leri

Deployment sonrası bu URL'ler aktif olacak:

```
https://busbuskimki.com/sitemap.xml
https://busbuskimki.com/robots.txt
```

## 📋 Google Search Console'a Sitemap Submit

### Adım 1: Google Search Console'a Giriş

1. [Google Search Console](https://search.google.com/search-console) adresine
   gidin
2. Google hesabınızla giriş yapın

### Adım 2: Site Ownership Doğrulama

**Seçenek 1: HTML Tag (Önerilen) ✅ EKLENDI**

```html
<!-- Bu meta tag src/app/layout.tsx içinde zaten mevcut -->
<meta
  name="google-site-verification"
  content="9jC0OHEYEMjbGS1yL65eyZ-QRAN_uPHn0lRvxtdK9GU"
/>
```

**DURUM:** ✅ Verification tag zaten eklendi (src/app/layout.tsx:62-65)

**Seçenek 2: DNS TXT Record**

- Domain provider'ınıza gidin
- TXT record ekleyin: `google-site-verification=YOUR_CODE`

**Seçenek 3: Vercel ile Otomatik**

- Vercel Dashboard > Settings > Domains
- Google Search Console verification otomatik yapılabilir

### Adım 3: Sitemap Submit

1. Search Console'da "Sitemaps" menüsüne tıklayın
2. "Add a new sitemap" alanına şunu yazın: `sitemap.xml`
3. "Submit" butonuna tıklayın

✅ Başarılı olursa: "Success - Sitemap was submitted successfully"

### Adım 4: Multi-Language Sitemap Kontrolü

Google Search Console'da şunları kontrol edin:

- ✅ 234+ sayfa indexlenmeli (78 kart × 3 dil = 234 kart sayfası)
- ✅ Hreflang tags doğru çalışıyor mu
- ✅ Her dil için ayrı sayfa indexleniyor mu

## 🔍 Bing Webmaster Tools

1. [Bing Webmaster Tools](https://www.bing.com/webmasters) adresine gidin
2. Site ekleyin: `https://busbuskimki.com`
3. Doğrulama yapın (HTML tag veya DNS)
4. Sitemaps > Submit Sitemap: `https://busbuskimki.com/sitemap.xml`

## 🌍 Yandex Webmaster

1. [Yandex Webmaster](https://webmaster.yandex.com) adresine gidin
2. Site ekleyin ve doğrulayın
3. Indexing > Sitemap files > Add sitemap
4. URL: `https://busbuskimki.com/sitemap.xml`

## 📊 Sitemap İçeriği (Özet)

Oluşturulan sitemap şunları içerir:

### Ana Sayfalar (9 URL)

- `/tr`, `/en`, `/sr` (3 ana sayfa)
- `/tr/tarotokumasi`, `/en/tarotokumasi`, `/sr/tarotokumasi`
- `/tr/numeroloji`, `/en/numerology`, `/sr/numerologija`

### Tarot Spread Sayfaları (15 URL)

- 5 spread × 3 dil = 15 sayfa
- love-spread, career-spread, situation-analysis, vb.

### Tarot Kart Sayfaları (234 URL)

- 78 kart × 3 dil = 234 sayfa
- Major Arcana: 22 kart
- Minor Arcana: 56 kart (Cups, Swords, Wands, Pentacles)

### Dashboard Sayfaları (9 URL)

- `/tr/dashboard`, `/en/dashboard`, `/sr/dashboard`
- `/dashboard/credits`, `/dashboard/packages`, `/dashboard/readings`, vb.

### Auth Sayfaları (3 URL)

- `/tr/auth`, `/en/auth`, `/sr/auth`

### Legal Sayfaları (27 URL)

- `/legal/about`, `/legal/contact`, `/legal/privacy-policy`, vb.
- Her biri 3 dil = 9 × 3 = 27 sayfa

**TOPLAM:** ~300+ sayfa

## 🔧 Sitemap Testi

Deployment öncesi test:

```bash
npm run build
npm run start

# Tarayıcıda test edin:
http://busbuskimki.com/sitemap.xml
http://busbuskimki.com/robots.txt
```

Deployment sonrası test:

```bash
# Sitemap erişimini test et
curl https://busbuskimki.com/sitemap.xml | head -20

# robots.txt erişimini test et
curl https://busbuskimki.com/robots.txt

# Google validator ile test et
# https://www.xml-sitemaps.com/validate-xml-sitemap.html
```

## ⚡ Hızlı Indexleme İpuçları

1. **URL Inspection Tool Kullanın**
   - Google Search Console > URL Inspection
   - Önemli sayfalar için "Request Indexing" yapın

2. **Priority & Change Frequency**
   - Ana sayfa: priority 1.0, daily
   - Tarot sayfaları: priority 0.9, weekly
   - Kart sayfaları: priority 0.8, monthly

3. **Internal Linking**
   - Ana sayfadan önemli sayfalara link verin
   - Breadcrumb navigation ekleyin (zaten mevcut)

4. **Social Signals**
   - İlk deployment sonrası sosyal medyada paylaşın
   - OpenGraph tags sayesinde güzel görünecek

## 📈 İzleme

### İlk 24 Saat

- [ ] Sitemap submit edildi mi?
- [ ] robots.txt erişilebilir mi?
- [ ] İlk sayfalar indexlendi mi?

### İlk Hafta

- [ ] Indexlenen sayfa sayısı artıyor mu?
- [ ] Coverage raporu: Hata var mı?
- [ ] Mobile usability: Sorun var mı?

### İlk Ay

- [ ] Tüm sayfalar indexlendi mi?
- [ ] Core Web Vitals nasıl?
- [ ] Search query'ler hangileri?

## 🎯 Beklenen Sonuçlar

**İlk 24-48 saat:**

- 10-20 sayfa indexlenmeye başlar (ana sayfalar)

**İlk hafta:**

- 50-100 sayfa indexlenir

**İlk ay:**

- 200+ sayfa indexlenir
- Search Console'da ilk trafik görülür

---

**Son Güncelleme:** 14 Ekim 2025 **Sitemap Dosyası:** src/app/sitemap.ts
**Robots Dosyası:** src/app/robots.ts
