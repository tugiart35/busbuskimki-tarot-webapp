# ✅ Vercel Deployment Kontrol Listesi

**Proje:** TaraTarot  
**Tarih:** ___________  
**Deploy Eden:** ___________

---

## 🔒 1. GÜVENLİK KONTROLÜ (5 dk)

### .gitignore Koruması
- [ ] `.env` dosyası .gitignore'da
- [ ] `.gemini/` klasörü .gitignore'da
- [ ] Local'de `.env` dosyası varsa Git'te olmadığını doğrula
  ```bash
  git status | grep .env
  # Sonuç: boş olmalı
  ```
- [ ] `.gemini/` klasörü silinmiş
  ```bash
  ls -la .gemini/
  # Sonuç: No such file or directory
  ```

### API Key Güvenliği
- [ ] Kodda hardcoded API key yok
- [ ] Tüm secrets environment variables'da
- [ ] `SUPABASE_SERVICE_ROLE_KEY` sadece server-side kullanımda

---

## 🌍 2. ENVIRONMENT VARIABLES (15 dk)

Vercel Dashboard → Settings → Environment Variables

### Kritik (14 Değişken) 🔴
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_SITE_URL`
- [ ] `NODE_ENV=production`
- [ ] `GROQ_API_KEY` VEYA `GEMINI_API_KEY`
- [ ] `SHOPIER_MERCHANT_ID`
- [ ] `SHOPIER_API_KEY`
- [ ] `SHOPIER_API_SECRET`
- [ ] `SHOPIER_TEST_MODE=false` ⚠️
- [ ] `SMTP_HOST`
- [ ] `SMTP_USER`
- [ ] `SMTP_PASS`
- [ ] `WEBHOOK_SECRET` (min 32 karakter)

### Shopier URL'leri (Gerçek domain ile güncelleyin)
- [ ] `NEXT_PUBLIC_SHOPIER_CALLBACK_URL`
- [ ] `NEXT_PUBLIC_SHOPIER_WEBHOOK_URL`

### Opsiyonel
- [ ] `SENTRY_DSN` (Error tracking için)
- [ ] `DEBUG=false`

---

## 🛠️ 3. BUILD TEST (5 dk)

```bash
cd /Users/tugi/Desktop/TaraTarot

# Dependencies
npm install

# Type check
npm run typecheck

# Build test
npm run build
```

### Başarı Kriterleri
- [ ] Build tamamlandı: "✓ Compiled successfully"
- [ ] Build error yok
- [ ] Type error yok (test dosyaları hariç - OK)

---

## 🚀 4. GIT HAZIRLIĞI (3 dk)

```bash
# Son değişiklikleri commit edin
git add .gitignore
git commit -m "🔒 Security: Update .gitignore for Vercel deployment"
git push origin main
```

- [ ] `.gitignore` güncellemesi commit edildi
- [ ] Main branch güncel
- [ ] No uncommitted changes

---

## 📦 5. VERCEL IMPORT (5 dk)

### Yeni Proje
- [ ] https://vercel.com/new adresine gidildi
- [ ] Repository import edildi
- [ ] Framework: Next.js seçildi (otomatik)
- [ ] Project name belirlendi: `tara-tarot`

### Mevcut Proje
- [ ] Vercel projesine gidildi
- [ ] Environment variables kontrol edildi

---

## 🔧 6. DEPLOYMENT (5 dk)

```bash
# CLI ile
vercel --prod

# VEYA Dashboard'dan Deploy butonu
```

### Deployment Süreci
- [ ] Building başladı
- [ ] Build logs temiz (error yok)
- [ ] Deployment tamamlandı
- [ ] Production URL alındı: ___________

---

## ✅ 7. DEPLOYMENT SONRASI TEST (15 dk)

### Basic Checks
- [ ] Site açılıyor: `https://your-domain.vercel.app`
- [ ] HTTPS aktif
- [ ] SSL sertifikası geçerli (yeşil kilit ikonu)

### Functional Tests
- [ ] **Ana sayfa:** `/tr` açılıyor
- [ ] **Dil değiştirme:** TR → EN → SR çalışıyor
- [ ] **Login:** `/tr/auth` açılıyor
- [ ] **Kayıt:** Yeni kullanıcı oluşturulabiliyor
- [ ] **Tarot:** `/tr/tarotokumasi` açılıyor
- [ ] **Kart çekimi:** Çalışıyor
- [ ] **AI yorumu:** Geliyor (GROQ/GEMINI test)
- [ ] **Dashboard:** Login sonrası erişilebiliyor
- [ ] **Credit packages:** Görünüyor (SATINALMA!)

### Browser Console
- [ ] No critical errors
- [ ] No 404 errors
- [ ] No CORS errors

### Performance
```bash
# Chrome DevTools → Lighthouse
# URL: https://your-domain.vercel.app
```
- [ ] Performance: >85
- [ ] Accessibility: >90
- [ ] Best Practices: >85
- [ ] SEO: >85

---

## 📊 8. MONITORING SETUP (5 dk)

### Vercel Dashboard
- [ ] Analytics aktif
- [ ] Functions logs akıyor
- [ ] No errors in logs (ilk 5 dakika)

### Supabase
- [ ] Database bağlantısı başarılı
- [ ] New auth users görünüyor (test kayıt)
- [ ] Readings tablosuna veri yazılıyor

### Email
- [ ] Test email gönderildi (opsiyonel)
- [ ] SMTP bağlantısı çalışıyor

---

## 🔄 9. DOMAIN AYARLARI (Opsiyonel - 10 dk)

### Custom Domain
- [ ] Vercel → Settings → Domains
- [ ] Domain eklendi: ___________
- [ ] DNS kayıtları güncellendi
  - A Record: `76.76.21.21`
  - VEYA CNAME: `cname.vercel-dns.com`
- [ ] SSL/HTTPS aktif (otomatik)

### Environment Variables Güncelleme (Domain değiştikten sonra)
- [ ] `NEXT_PUBLIC_SITE_URL` güncellendi
- [ ] `NEXT_PUBLIC_SHOPIER_CALLBACK_URL` güncellendi
- [ ] `NEXT_PUBLIC_SHOPIER_WEBHOOK_URL` güncellendi
- [ ] **Redeploy yapıldı** (değişiklikler aktif olsun)

---

## 🆘 10. SORUN GİDERME

### Yaygın Hatalar ve Çözümleri

#### Build Hatası
```bash
# Local'de test edin
npm run build
# Hataları düzeltin ve tekrar push edin
```

#### Environment Variable Hatası
- [ ] Dashboard'da değişken var mı kontrol edin
- [ ] **Production** environment'ında mı kontrol edin
- [ ] Redeploy yapın (değişiklikler aktif olsun)

#### 500 Internal Server Error
```bash
# Logs kontrol edin
vercel logs --follow
```

#### AI Yorumları Gelmiyor
- [ ] `GROQ_API_KEY` veya `GEMINI_API_KEY` doğru mu?
- [ ] API rate limit dolmuş olabilir mi?
- [ ] Function logs'da hata var mı?

---

## 📝 11. DEPLOYMENT NOTLARI

### Deployment Bilgileri
- **Deployment URL:** ___________
- **Deployment ID:** ___________
- **Deployment Time:** ___________
- **Git Commit:** ___________

### Test Sonuçları
- **Build Süresi:** ___ dakika
- **First Deploy:** ___ dakika
- **Lighthouse Score:**
  - Performance: ___
  - Accessibility: ___
  - Best Practices: ___
  - SEO: ___

### Sorunlar ve Çözümler
_Yaşanan sorunları ve çözümlerini buraya not edin_

---

## 🎯 12. BAŞARI KRİTERLERİ

Deployment başarılı sayılır:

### Zorunlu ✅
- [x] Build başarılı
- [x] Site açılıyor (200 OK)
- [x] HTTPS aktif
- [x] Ana sayfa render oluyor
- [x] Auth flow çalışıyor
- [x] Tarot reading çalışıyor
- [x] AI yorumları geliyor

### Önerilen ✅
- [ ] Lighthouse score >85
- [ ] No console errors
- [ ] Email gönderimi çalışıyor
- [ ] Custom domain aktif
- [ ] Monitoring kurulu

---

## ✍️ ONAY

### Deployment Onayı
- **Deploy Eden:** ___________
- **Tarih/Saat:** ___________
- **Durum:** ☐ BAŞARILI ☐ BAŞARISIZ

### Sonraki Adımlar
- [ ] Team'e bilgi verildi
- [ ] Documentation güncellendi
- [ ] Users'a duyuru yapıldı (eğer gerekirse)
- [ ] Monitoring kuruldu
- [ ] Backup alındı

---

**🚀 Deployment Tamamlandı!**

*Bu checklist'i her deployment için kullanın ve arşivleyin.*

