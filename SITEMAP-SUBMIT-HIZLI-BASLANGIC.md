# ⚡ Sitemap Submit - Hızlı Başlangıç

**5 Dakikada Google'a Sitemap Submit Etme Rehberi**

---

## 🎯 HIZLI ADIMLAR

### 1️⃣ Google Search Console'a Git
🔗 https://search.google.com/search-console

- Google hesabınla giriş yap
- **"Property Ekle"** → **"URL prefix"** seç
- Domain gir: `https://busbuskimki.com`

---

### 2️⃣ Verification Kodu Al
- **"HTML tag"** yöntemini seç
- Size verilen koddan sadece **content** kısmını kopyala:
  ```html
  <meta name="google-site-verification" content="abc123XYZ456def789" />
  ```
  → Sadece: `abc123XYZ456def789`

---

### 3️⃣ Kodu Environment'a Ekle

#### A) Local (Geliştirme için)
Proje root'unda `.env.local` dosyası oluştur:
```bash
NEXT_PUBLIC_SITE_URL=https://busbuskimki.com
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123XYZ456def789
```

#### B) Production (Vercel)
1. Vercel Dashboard → Projen → **Settings** → **Environment Variables**
2. Ekle:
   - Name: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - Value: `abc123XYZ456def789`
   - Environment: **Production, Preview**
3. **Save**
4. **Deployments** → En son deployment → **Redeploy**

---

### 4️⃣ Verification Yap
- Google Search Console'a dön
- **"Verify"** butonuna tıkla
- ✅ **"Ownership verified"** mesajını al

**Not:** Başarısız olursa 5-10 dakika bekle ve tekrar dene.

---

### 5️⃣ Sitemap Submit Et
- Sol menüden **"Sitemaps"** sekmesine git
- **"Yeni sitemap ekle"**
- Yaz: `sitemap.xml`
- **"Submit"** / **"Gönder"**

✅ **Başarılı!** Sitemap'iniz Google'a gönderildi.

---

## 🔍 TEST ET

### Sitemap'i Kontrol Et
Tarayıcıda aç:
```
https://busbuskimki.com/sitemap.xml
```
✅ XML görünüyorsa başarılı!

### Robots.txt'i Kontrol Et
```
https://busbuskimki.com/robots.txt
```
✅ "Sitemap: https://busbuskimki.com/sitemap.xml" satırını gör.

---

## ⏱️ BEKLEME SÜRELERİ

| Adım | Süre |
|------|------|
| Verification | Hemen |
| Sitemap submit | Hemen |
| İlk crawling | 1-2 gün |
| İlk indexleme | 3-7 gün |
| Tam indexleme | 2-4 hafta |

---

## 📊 SONUÇLARI KONTROL ET

### 1 Hafta Sonra
Google Search Console → **Coverage**
- Indexed pages: 50-100+ sayfa
- Valid URLs görmeye başlarsın

### 1 Ay Sonra
Google Search Console → **Performance**
- Total clicks: İlk tıklamalar
- Total impressions: İlk gösterimler
- Top queries: İlk anahtar kelimeler

---

## 🎁 BONUS: Bing'e de Ekle

🔗 https://www.bing.com/webmasters

1. Microsoft hesabınla giriş yap
2. **"Import from Google Search Console"** seç (en kolay!)
3. Google hesabınla bağlan
4. Site otomatik import edilir
5. Sitemap otomatik eklenir

**Süre:** 2 dakika ⚡

---

## ❓ SORUN GİDERME

### Verification başarısız olursa:
1. ✅ Vercel'de Redeploy yaptın mı?
2. ✅ Environment variable doğru mu?
3. ✅ 5-10 dakika bekledin mi?
4. ✅ Browser cache'i temizledin mi?

### Sitemap görünmüyorsa:
1. ✅ Build başarılı mı? (`npm run build`)
2. ✅ Sitemap dosyası var mı? (`src/app/sitemap.ts`)
3. ✅ Production'da deploy edildi mi?

---

## 📞 YARDIM

**Detaylı Rehber:** `GOOGLE-SEARCH-CONSOLE-REHBER.md` dosyasını oku

**Test Araçları:**
- Rich Results Test: https://search.google.com/test/rich-results
- Mobile-Friendly: https://search.google.com/test/mobile-friendly
- PageSpeed Insights: https://pagespeed.web.dev

---

## ✅ CHECKLIST

Tamamladıkça işaretle:

- [x] Google Search Console hesabı açtım ✅
- [x] Property ekledim (busbuskimki.com) ✅
- [x] Verification kodu aldım ✅
- [ ] `.env.local`'e ekledim (opsiyonel - local dev için)
- [x] Vercel Environment Variables'a ekledim ✅
- [ ] **ÖNEMLİ:** Vercel'de Redeploy yaptım ⚠️
- [ ] Production sitede meta tag'leri kontrol ettim
- [ ] Verification başarılı oldu
- [ ] Sitemap submit ettim
- [ ] Sitemap "Success" durumunda
- [x] (Bonus) Bing'e de ekledim ✅

---

## 🎯 ŞİMDİ YAPILMASI GEREKENLER

### 1️⃣ Öncelik: Vercel Redeploy
**Neden:** Environment variables ekledikten sonra mutlaka redeploy yapılmalı!

1. Vercel Dashboard → Projeniz
2. **Deployments** sekmesi
3. En son deployment → **⋮ (üç nokta)** → **Redeploy**
4. 2-3 dakika bekle

### 2️⃣ Meta Tag Kontrolü
**Tarayıcıda:**
```
https://busbuskimki.com/tr
```
- Sağ tık → "View Page Source"
- `Ctrl+F` → Ara: `google-site-verification`
- Ara: `msvalidate.01`

**Görmelisiniz:**
```html
<meta name="google-site-verification" content="abc123..." />
<meta name="msvalidate.01" content="def456..." />
```

### 3️⃣ Verification Tamamla
- Google Search Console → **Verify** butonuna tıkla
- Bing Webmaster Tools → **Verify** butonuna tıkla

### 4️⃣ Sitemap Submit
- Google: Sitemaps → `sitemap.xml` → Submit
- Bing: Sitemaps → `https://busbuskimki.com/sitemap.xml` → Submit

---

**Tebrikler! 🎉**

Sitemap'iniz artık Google'a gönderildi. 1-2 hafta içinde sayfalarınız indexlenmeye başlayacak!

---

**Hazırlayan:** AI SEO Uzmanı  
**Tarih:** 13 Ekim 2025

