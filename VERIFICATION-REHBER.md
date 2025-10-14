# 🔐 Google & Bing Verification Rehberi

## 📊 GOOGLE SEARCH CONSOLE VERİFİCATION

### Adım 1: Google Search Console'a Giriş Yap

1. **URL:** https://search.google.com/search-console
2. Google hesabınla giriş yap
3. "Property ekle" / "Add Property" butonuna tıkla

### Adım 2: Domain veya URL Prefix Seç

İki seçenek var:

**Seçenek A: Domain (Önerilen)**

```
Domain: busbuskimki.com
```

- Tüm subdomain'leri (www, blog, etc.) otomatik kapsar
- Tüm protokolleri (http, https) kapsar
- **Ancak DNS verification gerektirir**

**Seçenek B: URL Prefix (Daha Kolay)**

```
URL prefix: https://busbuskimki.com
```

- Sadece belirtilen URL'yi kapsar
- HTML tag verification kullanabilirsin
- **BU YÖNTEMI ÖNERİYORUM (daha kolay)**

### Adım 3: Verification Yöntemi Seç

"URL Prefix" seçtiysen şu yöntemlerden birini kullanabilirsin:

#### Yöntem 1: HTML Tag (EN KOLAY - BİZ BUNU KULLANACAĞIZ) ✅

```html
<!-- Google Search Console şuna benzer bir kod verecek: -->
<meta name="google-site-verification" content="abc123xyz456..." />
```

**Ne yapman gerekiyor:**

1. Google sana yukarıdaki gibi bir meta tag verecek
2. `content="..."` içindeki kodu kopyala (örnek: `abc123xyz456...`)
3. `.env.local` dosyana ekle:

```bash
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz456...
```

#### Yöntem 2: HTML Dosyası

- Google bir .html dosyası verir, onu public/ klasörüne at
- Daha zahmetli, önermiyor um

#### Yöntem 3: DNS Record

- Domain DNS'ine TXT record eklemen gerekir
- Domain sağlayıcında (GoDaddy, Cloudflare, vb.) yapılır
- Biraz teknik

#### Yöntem 4: Google Analytics

- Zaten Google Analytics varsa bu yöntemi kullanabilirsin
- Ama meta tag daha kolay

### Adım 4: Verification Kodunu Ekle

**Bizim projede zaten hazırladık!**

1. `.env.local` dosyasını aç (yoksa oluştur):

```bash
# .env.local dosyası
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=BURAYA_KODU_YAPIŞTIR
```

2. Google'dan aldığın kodu yapıştır:

```bash
# Örnek:
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz456def789ghi
```

3. **ÖNEMLİ:** Sadece kodu yapıştır, `<meta>` tag'lerini yapıştırma!

### Adım 5: Test Et (Local)

1. Development server'ı başlat:

```bash
npm run dev
```

2. Tarayıcıda aç: `http://busbuskimki.com`

3. Sayfa kaynağını görüntüle (Ctrl+U veya Cmd+Option+U)

4. Arama yap (Ctrl+F): `google-site-verification`

5. Şunu görmeli sin:

```html
<meta name="google-site-verification" content="abc123xyz456..." />
```

### Adım 6: Production'a Deploy Et

1. Vercel'e git (veya deployment platformun)
2. Settings → Environment Variables
3. Ekle:
   - **Name:** `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
   - **Value:** `abc123xyz456...` (aldığın kod)
   - **Environment:** Production

4. Redeploy yap

### Adım 7: Google'da Verify Et

1. Google Search Console'a dön
2. "Verify" / "Doğrula" butonuna tıkla
3. ✅ Başarılı mesajı göreceksin!

**Sorun çıkarsa:**

- 5-10 dakika bekle, cache temizlensin
- Tarayıcı cache'ini temizle
- Incognito/Private window'da dene
- View Source'da meta tag'i kontrol et

---

## 🔍 BING WEBMASTER TOOLS VERİFİCATION

### Adım 1: Bing Webmaster Tools'a Giriş Yap

1. **URL:** https://www.bing.com/webmasters
2. Microsoft hesabınla giriş yap (yoksa oluştur)
3. "Add a site" / "Site ekle" butonuna tıkla

### Adım 2: Site URL'ini Ekle

```
Site URL: https://busbuskimki.com
```

### Adım 3: Sitemap Ekle (Opsiyonel ama Önerilen)

```
Sitemap URL: https://busbuskimki.com/sitemap.xml
```

### Adım 4: Verification Yöntemi Seç

Bing de benzer yöntemler sunuyor:

#### Yöntem 1: Meta Tag (EN KOLAY - BİZ BUNU KULLANACAĞIZ) ✅

```html
<!-- Bing şuna benzer bir kod verecek: -->
<meta name="msvalidate.01" content="xyz789abc456..." />
```

**Ne yapman gerekiyor:**

1. Bing sana yukarıdaki gibi bir meta tag verecek
2. `content="..."` içindeki kodu kopyala
3. `.env.local` dosyana ekle:

```bash
NEXT_PUBLIC_BING_SITE_VERIFICATION=xyz789abc456...
```

#### Yöntem 2: XML Dosyası

- Bing bir .xml dosyası verir
- Zahmetli, önermiyor um

#### Yöntem 3: CNAME Record

- DNS'te CNAME record eklemen gerekir
- Biraz teknik

### Adım 5: Verification Kodunu Ekle

1. `.env.local` dosyasını aç:

```bash
# .env.local dosyası
NEXT_PUBLIC_BING_SITE_VERIFICATION=BURAYA_KODU_YAPIŞTIR
```

2. Bing'den aldığın kodu yapıştır:

```bash
# Örnek:
NEXT_PUBLIC_BING_SITE_VERIFICATION=xyz789abc456def123ghi
```

### Adım 6: Test Et (Local)

1. Development server çalışıyorsa yeniden başlat:

```bash
npm run dev
```

2. Tarayıcıda aç: `http://busbuskimki.com`

3. Sayfa kaynağını görüntüle

4. Arama yap: `msvalidate.01`

5. Şunu görmelisin:

```html
<meta name="msvalidate.01" content="xyz789abc456..." />
```

### Adım 7: Production'a Deploy Et

1. Vercel'e git (veya deployment platformun)
2. Settings → Environment Variables
3. Ekle:
   - **Name:** `NEXT_PUBLIC_BING_SITE_VERIFICATION`
   - **Value:** `xyz789abc456...` (aldığın kod)
   - **Environment:** Production

4. Redeploy yap

### Adım 8: Bing'de Verify Et

1. Bing Webmaster Tools'a dön
2. "Verify" butonuna tıkla
3. ✅ Başarılı mesajı göreceksin!

---

## 📝 ÖZET KONTROL LİSTESİ

### Google Search Console

- [ ] https://search.google.com/search-console adresine git
- [ ] "Add Property" → "URL Prefix" seç
- [ ] `https://busbuskimki.com` yaz
- [ ] "HTML Tag" verification yöntemi seç
- [ ] Verification kodunu kopyala (sadece content içindeki)
- [ ] `.env.local` dosyasına ekle: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=...`
- [ ] Local'de test et (npm run dev)
- [ ] Production'da environment variable ekle (Vercel)
- [ ] Redeploy yap
- [ ] Google'da "Verify" butonuna tıkla
- [ ] ✅ Başarılı!

### Bing Webmaster Tools

- [ ] https://www.bing.com/webmasters adresine git
- [ ] "Add a site" tıkla
- [ ] `https://busbuskimki.com` yaz
- [ ] Sitemap ekle: `https://busbuskimki.com/sitemap.xml`
- [ ] "Meta Tag" verification yöntemi seç
- [ ] Verification kodunu kopyala (sadece content içindeki)
- [ ] `.env.local` dosyasına ekle: `NEXT_PUBLIC_BING_SITE_VERIFICATION=...`
- [ ] Local'de test et
- [ ] Production'da environment variable ekle (Vercel)
- [ ] Redeploy yap
- [ ] Bing'de "Verify" butonuna tıkla
- [ ] ✅ Başarılı!

---

## 🖼️ GÖRSEL REHBERİ

### Google Search Console

**1. Property Ekleme Ekranı:**

```
┌─────────────────────────────────────┐
│  Select property type               │
├─────────────────────────────────────┤
│  Domain                URL prefix   │
│  ┌──────────┐        ┌──────────┐  │
│  │ Domain   │        │ URL      │  │ ← BU SEÇENEĞİ SEÇ
│  └──────────┘        └──────────┘  │
│                                     │
│  https://busbuskimki.com           │
│  [Continue]                         │
└─────────────────────────────────────┘
```

**2. Verification Yöntemi:**

```
┌─────────────────────────────────────┐
│  Verify ownership                   │
├─────────────────────────────────────┤
│  ○ HTML file upload                 │
│  ● HTML tag                         │ ← BU SEÇENEĞİ SEÇ
│  ○ Google Analytics                 │
│  ○ Google Tag Manager               │
│  ○ Domain name provider             │
├─────────────────────────────────────┤
│  Copy this meta tag and paste it   │
│  into your site's <head> section:  │
│                                     │
│  <meta name="google-site-           │
│   verification" content="abc123..." │
│                  ↑                  │
│            BU KODU KOPYALA          │
└─────────────────────────────────────┘
```

### Bing Webmaster Tools

**1. Site Ekleme:**

```
┌─────────────────────────────────────┐
│  Add a site                         │
├─────────────────────────────────────┤
│  Enter your website URL:            │
│  https://busbuskimki.com           │
│                                     │
│  Sitemap (optional):                │
│  https://busbuskimki.com/sitemap.xml│
│                                     │
│  [Add]                              │
└─────────────────────────────────────┘
```

**2. Verification:**

```
┌─────────────────────────────────────┐
│  Verify ownership                   │
├─────────────────────────────────────┤
│  Option 1: Add a meta tag          │ ← BU SEÇENEĞİ SEÇ
│  ● <meta name="msvalidate.01"       │
│      content="xyz789..." />         │
│                ↑                    │
│          BU KODU KOPYALA            │
│                                     │
│  Option 2: Add XML file             │
│  Option 3: Add CNAME record         │
└─────────────────────────────────────┘
```

---

## 🔧 .env.local DOSYASI ÖRNEK

Dosya konumu: `/Users/tugi/Desktop/busbuskimki/.env.local`

```bash
# App
NODE_ENV=development

# Site URL
NEXT_PUBLIC_SITE_URL=https://busbuskimki.com

# ==========================================
# SEO VERIFICATION CODES
# ==========================================

# Google Search Console Verification
# Adres: https://search.google.com/search-console
# Örnek: abc123def456ghi789jkl
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=BURAYA_GOOGLE_KODU

# Bing Webmaster Tools Verification
# Adres: https://www.bing.com/webmasters
# Örnek: xyz789abc456def123ghi
NEXT_PUBLIC_BING_SITE_VERIFICATION=BURAYA_BING_KODU

# ==========================================
# DİĞER ENV VARIABLES
# ==========================================

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qtlokdkcerjrbrtphlrh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ... diğer env variables
```

---

## 🚀 VERCEL ENVIRONMENT VARIABLES

### Vercel Dashboard'da Nasıl Eklenir:

1. **Vercel Dashboard'a Git:**
   - https://vercel.com/dashboard
   - Projenizi seçin (busbuskimki)

2. **Settings Sekmesine Git:**

   ```
   Dashboard → busbuskimki → Settings
   ```

3. **Environment Variables'a Git:**

   ```
   Settings → Environment Variables
   ```

4. **Yeni Variable Ekle:**

   ```
   ┌─────────────────────────────────────┐
   │ Add New Environment Variable        │
   ├─────────────────────────────────────┤
   │ Name:                               │
   │ NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION│
   │                                     │
   │ Value:                              │
   │ abc123def456ghi789jkl               │
   │                                     │
   │ Environment:                        │
   │ ☑ Production                        │
   │ ☐ Preview                           │
   │ ☐ Development                       │
   │                                     │
   │ [Save]                              │
   └─────────────────────────────────────┘
   ```

5. **İkinci Variable Ekle:**

   ```
   Name: NEXT_PUBLIC_BING_SITE_VERIFICATION
   Value: xyz789abc456def123ghi
   Environment: ☑ Production
   ```

6. **Redeploy Yap:**
   ```
   Deployments → Latest Deployment → ⋯ (3 nokta) → Redeploy
   ```

---

## ❓ SIKÇA SORULAN SORULAR

### S: Verification kodu nerede görünecek?

**C:** HTML'in `<head>` bölümünde, diğer meta tag'lerle birlikte.

### S: Local'de çalışıyor ama production'da çalışmıyor?

**C:** Vercel environment variables'ı kontrol et. Redeploy yap.

### S: "Could not verify" hatası alıyorum?

**C:**

- 5-10 dakika bekle
- Tarayıcı cache'ini temizle
- View Source'da meta tag'i kontrol et
- Vercel'de environment variable doğru mu kontrol et

### S: Hem Google hem Bing için aynı kodu kullanabilir miyim?

**C:** Hayır, her biri farklı kod verir ve farklı meta tag kullanır:

- Google: `google-site-verification`
- Bing: `msvalidate.01`

### S: Production'a deploy etmeden test edebilir miyim?

**C:** Local'de (localhost) görebilirsin ama Google/Bing sadece gerçek domain'i
verify edebilir.

### S: Kodları nerede saklıyoruz?

**C:**

- **Local:** `.env.local` dosyası (git ignore'da)
- **Production:** Vercel Environment Variables

### S: Birden fazla domain verify edebilir miyim?

**C:** Evet, her domain için ayrı property ekle ve ayrı verification kod
alırsın.

---

## 🎯 BAŞARI SONRASI

Verification başarılı olduktan sonra:

### Google Search Console'da Yapılacaklar:

1. **Sitemap Gönder:**

   ```
   Sitemaps → Add new sitemap
   URL: https://busbuskimki.com/sitemap.xml
   [Submit]
   ```

2. **Performance İzle:**
   - Hangi keyword'ler trafik getiriyor
   - Hangi sayfalar iyi performans gösteriyor
   - Click-through rate (CTR)

3. **Coverage Kontrol Et:**
   - Hangi sayfalar index'lendi
   - Hangi sayfalar hata veriyor
   - Mobile usability sorunları

4. **Core Web Vitals:**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

### Bing Webmaster Tools'da Yapılacaklar:

1. **Sitemap Gönder:**

   ```
   Sitemaps → Submit sitemap
   URL: https://busbuskimki.com/sitemap.xml
   [Submit]
   ```

2. **SEO Reports:**
   - SEO analyzer
   - Keyword research
   - Backlinks

3. **Site Scan:**
   - SEO issues
   - Accessibility
   - Mobile-friendliness

---

## ✅ BAŞARI KONTROL LİSTESİ

Verification başarılı olduysa:

- [ ] Google Search Console dashboard'ı görüyorum
- [ ] "Property verified" mesajı aldım
- [ ] Sitemap gönderildi ve "Success" görünüyor
- [ ] Performance sekmesinde veri gelmeye başladı (24-48 saat sonra)
- [ ] Coverage sekmesinde sayfa sayısı görünüyor
- [ ] Bing Webmaster Tools dashboard'ı görüyorum
- [ ] "Site verified" mesajı aldım
- [ ] Bing'de de sitemap gönderildi
- [ ] SEO reports erişilebiliyor

---

## 📞 YARDIM

Sorun yaşarsan:

1. **Google Help:**
   - https://support.google.com/webmasters/

2. **Bing Help:**
   - https://www.bing.com/webmasters/help/

3. **Bu Dosyayı Kontrol Et:**
   - `src/lib/config/metadata.ts` (satır 101-102)
   - Meta tag'lerin doğru yerleştirildiğinden emin ol

4. **View Source:**
   - Production site'ında sağ tık → "View Page Source"
   - Ctrl+F / Cmd+F ile ara: `google-site-verification`
   - Ctrl+F / Cmd+F ile ara: `msvalidate.01`

---

**🎉 İyi şanslar! Verification kolay bir işlem, 10 dakikada halledersin!**

**Son Güncelleme:** 13 Ekim 2025  
**Hazırlayan:** AI SEO Uzmanı
