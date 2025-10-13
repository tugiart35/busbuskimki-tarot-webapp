# 🚀 Vercel'e Deployment - Hızlı Başlangıç

**Durum:** ✅ DEPLOYMENT'A HAZIR  
**Güncelleme:** 13 Ekim 2025  
**Tahmini Süre:** 30-45 dakika

> **📚 Detaylı Rehber:** `VERCEL-DEPLOYMENT-GUIDE.md` dosyasına bakın  
> **✅ Kontrol Listesi:** `vercel-deploy-checklist.md` dosyasını kullanın

## 1. Vercel Projesi Oluşturma ve Yapılandırma

1.  **Vercel Hesabı:** Vercel'de bir hesap oluşturun veya mevcut hesabınıza giriş yapın.
2.  **Yeni Proje:** "Add New... -> Project" seçeneği ile yeni bir proje oluşturun.
3.  **Git Entegrasyonu:** Projenizin bulunduğu Git deposunu (GitHub, GitLab, Bitbucket) Vercel'e bağlayın.
4.  **Proje Ayarları:**
    *   **Framework Preset:** `Next.js` olarak otomatik algılanmalıdır.
    *   **Build Command:** `next build`
    *   **Output Directory:** `.next`
    *   **Install Command:** `npm install` (veya `pnpm install` / `yarn install`)

## 2. 🔐 Güvenlik Önlemleri (KRİTİK!)

### ✅ Tamamlandı
- [x] `.gitignore` güncellendi (.env ve .gemini/ koruması eklendi)
- [x] API key güvenlik kontrolleri yapıldı

### ⚠️ Deployment Öncesi Kontrol
```bash
# .env dosyası git'te olmamalı
git status | grep .env

# .gemini/ klasörü silinmeli
ls -la .gemini/
```

## 3. Ortam Değişkenleri (Environment Variables)

**TOPLAM: 30 değişken**  
**Minimum Gerekli: 14 değişken**

> **Template:** `.env.vercel.template` dosyasına bakın

**Vercel Dashboard → Settings → Environment Variables** bölümüne gidin:

### Supabase

*   `NEXT_PUBLIC_SUPABASE_URL`
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
*   `SUPABASE_URL`
*   `SUPABASE_SERVICE_ROLE_KEY`

### Webhooks

*   `WEBHOOK_SECRET`

### Shopier

*   `SHOPIER_MERCHANT_ID`
*   `SHOPIER_API_KEY`
*   `SHOPIER_API_SECRET`
*   `SHOPIER_TEST_MODE` (üretim için `false` olarak ayarlayın)

### OAuth

*   `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
*   `GOOGLE_CLIENT_SECRET`
*   `NEXT_PUBLIC_FACEBOOK_CLIENT_ID`
*   `FACEBOOK_CLIENT_SECRET`

### Email

*   `SMTP_HOST`
*   `SMTP_PORT`
*   `SMTP_SECURE`
*   `SMTP_USER`
*   `SMTP_PASS`

### Genel

*   `NODE_ENV`: `production` olarak ayarlanmalıdır.
*   `NEXT_PUBLIC_SITE_URL`: `https://sitenizin-adi.vercel.app` (veya özel alan adınız)
*   `NEXT_PUBLIC_CONTACT_PHONE`
*   `NEXT_PUBLIC_SHOPIER_CALLBACK_URL`: `https://sitenizin-adi.vercel.app/payment/callback`
*   `NEXT_PUBLIC_SHOPIER_WEBHOOK_URL`: `https://sitenizin-adi.vercel.app/api/webhook/shopier`

### 🔴 Kritik Uyarılar
- ⚠️ `NEXT_PUBLIC_` ile başlayanlar **client-side'da görünür**
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` **ASLA** NEXT_PUBLIC ile başlamamalı
- ⚠️ `SHOPIER_TEST_MODE=false` **MUTLAKA** production'da
- ⚠️ Webhook secret **minimum 32 karakter** olmalı

### 🎯 Hızlı Ekleme (CLI)
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add GROQ_API_KEY production
# ... diğerleri
```

## 4. Dağıtım (Deployment)

1.  **Tetikleme:** Ortam değişkenlerini ekledikten sonra, Vercel projenizin **Deployments** sekmesine gidin.
2.  **Yeniden Dağıt:** Projenizin son commit'ini seçerek "Redeploy" yapın. Bu, yeni eklenen ortam değişkenlerinin dağıtım tarafından kullanılmasını sağlar.
3.  **İzleme:** Dağıtım sürecini Vercel'in log ekranından takip edin. Olası hataları burada görebilirsiniz.

## 5. Deployment Sonrası Kontroller

### Immediate Tests (5 dk)
- [ ] Site açılıyor: `https://your-domain.vercel.app`
- [ ] HTTPS aktif (yeşil kilit)
- [ ] Ana sayfa render oluyor

### Functional Tests (15 dk)
- [ ] `/tr`, `/en`, `/sr` sayfaları çalışıyor
- [ ] Login/Register çalışıyor
- [ ] Tarot okuma yapılabiliyor
- [ ] AI yorumları geliyor
- [ ] Dashboard erişilebiliyor

### Performance (10 dk)
```bash
# Lighthouse audit
# Chrome DevTools → Lighthouse
# Target: >85 score
```

### Monitoring
- [ ] Vercel Analytics aktif
- [ ] No errors in logs
- [ ] Supabase bağlantısı çalışıyor

---

## 📚 Kaynak Dosyalar

- **`VERCEL-DEPLOYMENT-GUIDE.md`** - Detaylı adım adım rehber (20+ sayfa)
- **`vercel-deploy-checklist.md`** - Basılabilir kontrol listesi
- **`.env.vercel.template`** - Environment variables şablonu
- **`env.example`** - Geliştirme ortamı örneği

---

## 🆘 Sorun mu Yaşıyorsunuz?

### Build Hatası
```bash
npm run build  # Local'de test edin
```

### Environment Variable Hatası
- Dashboard'da **Production** environment'ında mı kontrol edin
- **Redeploy** yapın (değişiklikler aktif olsun)

### Detaylı Sorun Giderme
`VERCEL-DEPLOYMENT-GUIDE.md` → Bölüm 7

---

## ✅ Hızlı Başlangıç (5 Adım)

1. **Güvenlik:** `.gitignore` güncellenmiş ✅
2. **Build Test:** `npm run build` ✅
3. **Vercel Import:** Repository import edin
4. **Env Variables:** 14 kritik değişkeni ekleyin
5. **Deploy:** `vercel --prod` veya Dashboard'dan

**Başarılar! 🚀**
