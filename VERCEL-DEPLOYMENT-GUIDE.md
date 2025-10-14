# 🚀 Vercel Deployment Rehberi - TaraTarot

**Son Güncelleme:** 13 Ekim 2025  
**Durum:** ✅ DEPLOYMENT'A HAZIR  
**Tahmini Süre:** 30-45 dakika

---

## 📋 HIZLI BAŞLANGIÇ

### Ön Gereksinimler ✅

- [x] Git repository hazır
- [x] Vercel hesabı (https://vercel.com/signup)
- [x] Supabase production projesi hazır
- [x] Shopier production credentials
- [x] SMTP/Email credentials

---

## 🔐 1. GÜVENLİK ÖNLEMLERİ (KRİTİK!)

### ✅ Tamamlandı - .gitignore Güncellemesi

`.gitignore` dosyası aşağıdaki kritik dosyaları koruyacak şekilde güncellendi:

```gitignore
.env
.env.production
.env.development
.gemini/
*.key
*.pem
```

### ⚠️ Kontrol Listesi

Deployment öncesi **MUTLAKA** kontrol edin:

```bash
# Local'de .env dosyanız var mı? (Olmamalı!)
ls -la .env

# Eğer varsa, git'te olmadığını doğrulayın:
git status | grep .env

# .gemini/ klasörü var mı? (Olmamalı!)
ls -la .gemini/

# Eğer varsa, silin:
rm -rf .gemini/
```

---

## 🌍 2. ENVIRONMENT VARIABLES (30 Değişken)

Vercel Dashboard'da **Settings → Environment Variables** bölümüne gidin ve
aşağıdaki değişkenleri ekleyin.

### 🔴 Kritik - Olmadan Çalışmaz

#### Supabase Configuration

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_URL=https://your-production-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Nereden Bulunur:**

- Supabase Dashboard → Settings → API
- **ANON_KEY:** Public, client-side safe
- **SERVICE_ROLE_KEY:** ⚠️ Private, server-only, RLS bypass

#### Application URLs

```bash
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NEXT_PUBLIC_CONTACT_PHONE=+90 (xxx) xxx xx xx
```

**Not:** İlk deployment'tan sonra `NEXT_PUBLIC_SITE_URL`'i gerçek domain'iniz
ile güncelleyin.

### 🟡 Önemli - Özellikler İçin Gerekli

#### AI Services (En az biri gerekli)

```bash
GROQ_API_KEY=gsk_...
# VEYA
GEMINI_API_KEY=AIzaSy...
```

**Nereden Alınır:**

- **GROQ:** https://console.groq.com/keys
- **GEMINI:** https://makersuite.google.com/app/apikey

**Kullanım:** Tarot kartı yorumları için kritik

#### Payment - Shopier

```bash
SHOPIER_MERCHANT_ID=your-merchant-id
SHOPIER_API_KEY=your-api-key
SHOPIER_API_SECRET=your-api-secret
SHOPIER_TEST_MODE=false
NEXT_PUBLIC_SHOPIER_API_URL=https://www.shopier.com/ShowProduct/api_pay4.php
NEXT_PUBLIC_SHOPIER_CALLBACK_URL=https://your-domain.vercel.app/payment/callback
NEXT_PUBLIC_SHOPIER_WEBHOOK_URL=https://your-domain.vercel.app/api/webhook/shopier
```

**⚠️ ÖNEMLİ:**

- `SHOPIER_TEST_MODE=false` **MUTLAKA** false olmalı!
- URL'leri gerçek domain'iniz ile güncelleyin

**Nereden Alınır:**

- Shopier Merchant Panel → API Ayarları

#### Email Configuration

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
```

**Gmail App Password Oluşturma:**

1. Google Account → Security
2. 2-Step Verification aktif olmalı
3. App passwords → Generate
4. Uygulamanızı seçin → Generate
5. 16 haneli şifreyi `SMTP_PASS` olarak kullanın

#### Security

```bash
WEBHOOK_SECRET=your-secure-random-secret-minimum-32-characters-long
```

**Güçlü Secret Oluşturma:**

```bash
# Terminal'de çalıştırın:
openssl rand -base64 32
```

### 🟢 Opsiyonel - Gelişmiş Özellikler

#### OAuth (İleride kullanılacaksa)

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_FACEBOOK_CLIENT_ID=your-app-id
FACEBOOK_CLIENT_SECRET=your-app-secret
```

#### Monitoring & Analytics

```bash
# Sentry (Error tracking)
SENTRY_DSN=https://...@sentry.io/...

# Debug mode (Development için true, Production için false)
DEBUG=false
```

---

## 📝 3. VERCEL'DE ENVIRONMENT VARIABLES EKLEME

### Yöntem 1: Dashboard (Önerilen - Kolay)

1. **Vercel'e gidin:** https://vercel.com/dashboard
2. **Projenizi seçin**
3. **Settings** sekmesine gidin
4. **Environment Variables** bölümüne gidin
5. Her bir değişken için:
   - **Name:** Değişken adı (örn: `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value:** Değişken değeri
   - **Environment:** `Production` seçin (Preview ve Development için de
     ekleyebilirsiniz)
   - **Add** butonuna tıklayın

### Yöntem 2: CLI (Hızlı - Toplu Ekleme)

```bash
# Vercel CLI kurulumu
npm i -g vercel

# Login
vercel login

# Projenizi linkleyin
vercel link

# Environment variables ekleyin (her biri için)
vercel env add NEXT_PUBLIC_SUPABASE_URL production
# Değeri yapıştırın ve Enter'a basın

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add GROQ_API_KEY production
# ... diğerleri
```

### Yöntem 3: .env Dosyasından Toplu Import

**⚠️ DİKKAT:** Bu yöntem sadece lokal test için! Production'da asla .env dosyası
kullanmayın!

```bash
# Geliştirme için .env.local oluşturun (Git'e eklenmez)
cp env.example .env.local

# Değerleri doldurun
nano .env.local
```

---

## 🚀 4. DEPLOYMENT ADIMLARI

### Adım 1: Local Build Test (5 dk)

```bash
cd /Users/tugi/Desktop/TaraTarot

# Dependencies güncelleme
npm install

# Type check
npm run typecheck

# Build test
npm run build
```

**Başarı Kriterleri:**

- ✅ "Compiled successfully" mesajı görülmeli
- ✅ Build errors olmamalı
- ❌ Eğer hata varsa, deployment YAPMAYIN!

### Adım 2: Git Repository Hazırlama (3 dk)

```bash
# Değişiklikleri commit edin
git add .gitignore
git commit -m "🔒 Security: Update .gitignore for deployment"

# Main branch'e push
git push origin main
```

### Adım 3: Vercel'e Import (5 dk)

#### Yeni Proje (İlk Deployment)

1. **Vercel'e gidin:** https://vercel.com/new
2. **Import Git Repository** seçin
3. **Repository'nizi seçin** (GitHub/GitLab/Bitbucket)
4. **Configure Project:**
   - **Project Name:** `tara-tarot` (veya tercih ettiğiniz isim)
   - **Framework Preset:** Next.js (otomatik seçilir)
   - **Root Directory:** `.` (default)
   - **Build Command:** `npm run build` (otomatik)
   - **Output Directory:** `.next` (otomatik)
5. **Environment Variables:** "Skip" seçin (sonra ekleyeceğiz)
6. **Deploy** butonuna tıklamayın henüz!

### Adım 4: Environment Variables Ekleme (15 dk)

**Dashboard'dan yukarıdaki 30 değişkeni ekleyin** (Bölüm 2'ye bakın)

**Minimum Gerekli 14 Değişken:**

1. NEXT_PUBLIC_SUPABASE_URL
2. NEXT_PUBLIC_SUPABASE_ANON_KEY
3. SUPABASE_SERVICE_ROLE_KEY
4. NEXT_PUBLIC_SITE_URL
5. NODE_ENV
6. GROQ_API_KEY (veya GEMINI_API_KEY)
7. SHOPIER_MERCHANT_ID
8. SHOPIER_API_KEY
9. SHOPIER_API_SECRET
10. SHOPIER_TEST_MODE
11. SMTP_HOST
12. SMTP_USER
13. SMTP_PASS
14. WEBHOOK_SECRET

### Adım 5: İlk Deployment (5 dk)

```bash
# CLI ile
vercel --prod

# VEYA Dashboard'dan
# Settings → Deployments → Deploy
```

**Deployment süreci:**

- ⏳ Building... (2-3 dakika)
- ⏳ Deploying... (1-2 dakika)
- ✅ Success!

### Adım 6: Domain Ayarları (Opsiyonel - 10 dk)

**Vercel Domain (Otomatik):**

- `https://tara-tarot.vercel.app`

**Custom Domain Ekleme:**

1. **Vercel Dashboard → Settings → Domains**
2. **Add Domain:** `yourdomain.com`
3. **DNS kayıtlarını güncelleyin:**
   - Type: `A` Record
   - Name: `@`
   - Value: `76.76.21.21`

   **VEYA**
   - Type: `CNAME`
   - Name: `www`
   - Value: `cname.vercel-dns.com`

4. **SSL/HTTPS** otomatik aktif edilir (Let's Encrypt)

---

## ✅ 5. DEPLOYMENT SONRASI KONTROLLER

### Immediate Checks (5 dk)

```bash
# Site açılıyor mu?
curl -I https://your-domain.vercel.app
# Response: 200 OK

# SSL sertifikası geçerli mi?
curl https://your-domain.vercel.app
# HTTPS çalışmalı
```

### Functional Tests (15 dk)

Browser'da test edin:

#### 1. Ana Sayfa

- ✅ `https://your-domain.vercel.app/tr`
- ✅ Sayfa yükleniyor mu?
- ✅ Görüntüler yükleniyor mu?
- ✅ Console'da critical error yok mu?

#### 2. Dil Değiştirme (i18n)

- ✅ `/tr` → `/en` → `/sr` geçişleri çalışıyor mu?
- ✅ Çeviriler doğru mu?

#### 3. Authentication

- ✅ `/tr/auth` - Login sayfası açılıyor mu?
- ✅ Yeni kullanıcı kaydı yapılabiliyor mu?
- ✅ Email confirmation geliyor mu?
- ✅ Login çalışıyor mu?

#### 4. Tarot Reading

- ✅ `/tr/tarotokumasi` - Sayfa açılıyor mu?
- ✅ Açılım seçimi çalışıyor mu?
- ✅ Kart çekimi yapılabiliyor mu?
- ✅ AI yorumları geliyor mu? (GROQ/GEMINI test)

#### 5. Payment

- ✅ Dashboard → Credit Packages
- ✅ Paketler görünüyor mu?
- ✅ **TEST PAYMENT YAPMAYIN** (Test mode kapalı!)
- ✅ Sadece görsel olarak kontrol edin

#### 6. Email

```bash
# Test email endpoint (production'da dikkatli!)
curl -X POST https://your-domain.vercel.app/api/email/test \
  -H "Content-Type: application/json"
```

### Performance Checks (10 dk)

#### Lighthouse Audit

```bash
# Chrome DevTools → Lighthouse
# Run audit on: https://your-domain.vercel.app
```

**Başarı Kriterleri:**

- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

#### Vercel Analytics

1. **Dashboard → Analytics**
2. **Core Web Vitals** kontrol edin:
   - LCP (Largest Contentful Paint): <2.5s
   - FID (First Input Delay): <100ms
   - CLS (Cumulative Layout Shift): <0.1

---

## 🔍 6. MONITORING & LOGGING

### Vercel Logs

```bash
# Realtime logs
vercel logs --follow

# Specific deployment
vercel logs <deployment-url>

# Filter by function
vercel logs --filter=api
```

### Error Tracking

**Dashboard'da:**

- **Functions** sekmesi → Error rates
- **Analytics** sekmesi → Page errors

### Database Monitoring

**Supabase Dashboard:**

1. **Database → Query Performance**
2. **API → Logs**
3. **Auth → Users** (Yeni kayıtlar var mı?)

---

## 🆘 7. SORUN GİDERME

### Build Hatası

**Hata:** `Build failed`

**Çözüm:**

```bash
# Local'de build test yapın
npm run build

# Hata loglarını kontrol edin
# Eksik dependency var mı?
npm install

# Type errors var mı?
npm run typecheck
```

### Environment Variable Hatası

**Hata:** `NEXT_PUBLIC_SUPABASE_URL is undefined`

**Çözüm:**

1. Vercel Dashboard → Settings → Environment Variables
2. Değişkenin **Production** environment'ında olduğunu doğrulayın
3. **Redeploy** yapın (değişiklikler aktif olması için)

### 500 Internal Server Error

**Çözüm:**

```bash
# Function logs kontrol edin
vercel logs --follow

# Supabase bağlantısını test edin
# Browser console'da:
console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)
```

### AI Yorumları Gelmiyor

**Çözüm:**

1. `GROQ_API_KEY` veya `GEMINI_API_KEY` doğru mu?
2. API key'in rate limit'i dolmuş olabilir mi?
3. Function logs'da AI API error'u var mı?

```bash
vercel logs --filter=api/tarot
```

---

## 🔄 8. GÜNCELLEME VE REDEPLOY

### Kod Değişiklikleri

```bash
# Değişiklikleri commit edin
git add .
git commit -m "feat: New feature"
git push origin main

# Vercel otomatik deploy yapar!
```

### Environment Variable Değişiklikleri

1. **Dashboard → Settings → Environment Variables**
2. Değişkeni bulun → **Edit**
3. Yeni değeri girin → **Save**
4. **⚠️ ÖNEMLİ:** Redeploy gerekli!
   - **Deployments** → En son deployment → **Redeploy**

### Rollback (Geri Alma)

```bash
# CLI ile
vercel rollback <deployment-url>

# VEYA Dashboard'dan
# Deployments → Eski deployment → "Promote to Production"
```

---

## 📊 9. PRODUCTION CHECKLIST

Deployment öncesi son kontrol:

### Güvenlik ✅

- [ ] `.env` dosyası Git'te yok
- [ ] `.gemini/` klasörü silindi ve .gitignore'da
- [ ] API key'ler hardcode edilmemiş
- [ ] `SUPABASE_SERVICE_ROLE_KEY` sadece server-side
- [ ] HTTPS aktif ve zorlamalı
- [ ] WEBHOOK_SECRET güçlü (32+ karakter)

### Configuration ✅

- [ ] `NODE_ENV=production`
- [ ] `SHOPIER_TEST_MODE=false`
- [ ] `NEXT_PUBLIC_SITE_URL` gerçek domain
- [ ] Tüm callback URL'ler gerçek domain
- [ ] SMTP credentials doğru

### Database ✅

- [ ] Supabase production projesi hazır
- [ ] Migration'lar çalıştırıldı
- [ ] RLS policies aktif
- [ ] Test data temizlendi

### Testing ✅

- [ ] Local build başarılı
- [ ] Type check geçti
- [ ] Tüm sayfalar açılıyor
- [ ] Auth flow çalışıyor
- [ ] Payment görünümü doğru
- [ ] AI yorumları geliyor

### Monitoring ✅

- [ ] Vercel Analytics aktif
- [ ] Error tracking kurulu (Sentry opsiyonel)
- [ ] Logs akıyor
- [ ] Alerts ayarlandı

---

## 🎯 10. BAŞARI KRİTERLERİ

Deployment başarılı sayılır:

### Teknik ✅

- Build sürecinde hata yok
- 200 OK response
- HTTPS aktif
- Core Web Vitals sağlıklı

### Fonksiyonel ✅

- Tüm sayfalar açılıyor
- i18n çalışıyor (TR/EN/SR)
- Auth flow sorunsuz
- Tarot readings çalışıyor
- AI yorumları geliyor

### Performans ✅

- Lighthouse score >90
- First Paint <1.5s
- Time to Interactive <3s
- No console errors

---

## 📞 DESTEK

### Vercel

- **Docs:** https://vercel.com/docs
- **Support:** https://vercel.com/support
- **Status:** https://www.vercel-status.com

### Framework & Services

- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **Shopier:** https://shopier.com/destek

---

## ✅ SONUÇ

Bu rehberi takip ederek:

- ✅ Güvenli deployment
- ✅ Production-ready yapılandırma
- ✅ Monitoring ve alerting
- ✅ Sorun giderme stratejisi

**Tahmini süre:** 30-45 dakika  
**Zorluk seviyesi:** Orta  
**Başarı oranı:** %95+

---

**🚀 Başarılı Deployment'lar!**

_Son güncelleme: 13 Ekim 2025_
