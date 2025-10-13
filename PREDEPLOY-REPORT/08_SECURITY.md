# 🛡️ GÜVENLİK TARAMA RAPORU

**Tarih:** 13 Ekim 2025  
**Kapsam:** Hard-coded secrets, CSP konfigürasyonu, güvenlik header'ları  
**Durum:** ⚠️ KRİTİK SORUNLAR TESPİT EDİLDİ

---

## 📋 YÖNETİCİ ÖZETİ

Bu rapor, TaraTarot projesinin güvenlik taraması sonuçlarını içermektedir. Tarama sırasında **kritik güvenlik açıkları** tespit edilmiştir ve bu açıkların production deployment öncesinde mutlaka düzeltilmesi gerekmektedir.

### Kritik Bulgular
- 🔴 **KRİTİK:** 3 adet hard-coded API key tespit edildi
- 🔴 **KRİTİK:** .env dosyalarında hassas bilgiler açıkta
- 🟡 **ORTA:** CSP yapılandırmasında iyileştirme alanları
- 🟢 **İYİ:** Güvenlik header'ları doğru yapılandırılmış

---

## 🔴 KRİTİK GÜVENLIK AÇIKLARI

### 1. Hard-Coded API Keys ve Secrets

#### 1.1 GEMINI_API_KEY (EXPOSED)
**Dosya:** `.env`, `.env.local`  
**Durum:** 🔴 AÇIKTA  
**Risk Seviyesi:** KRİTİK

```
GEMINI_API_KEY=AIzaSyAgjVO0rAe1DishHl4KGRxpiQBDaHomhPs
```

**Risk:**
- API key'in public repository'de olması durumunda kötüye kullanım riski
- Sınırsız API çağrısı ile mali kayıp riski
- Google hesabı güvenlik riski

**Acil Aksiyon:**
1. ✅ Mevcut API key'i Google Cloud Console'dan **HEMEN** iptal et
2. ✅ Yeni API key oluştur ve sadece Vercel environment variables'a ekle
3. ✅ .env dosyalarını .gitignore'a eklendiğinden emin ol
4. ✅ Git history'den hassas bilgileri temizle (git-secrets kullan)

#### 1.2 SHOPIER_API_KEY (EXPOSED)
**Dosya:** `.env`, `.env.local`  
**Durum:** 🔴 AÇIKTA  
**Risk Seviyesi:** KRİTİK

```
SHOPIER_API_KEY=684fb826c76a726e2be5c049d110029c
SHOPIER_API_SECRET=e860249c45e6e4a6e8eca2c5b327eb77
```

**Risk:**
- Ödeme sistemi güvenliği tehlikede
- Yetkisiz ödeme işlemleri riski
- Mali kayıp ve yasal sorumluluk

**Acil Aksiyon:**
1. ✅ Shopier kontrol panelinden API credentials'ları **HEMEN** yenile
2. ✅ Yeni credentials'ları sadece Vercel environment variables'a ekle
3. ✅ Webhook secret'ları güçlü rastgele değerlerle değiştir
4. ✅ Son 48 saatteki tüm Shopier işlemlerini kontrol et

#### 1.3 SUPABASE_ACCESS_TOKEN (EXPOSED)
**Dosya:** `.env`, `.env.local`  
**Durum:** 🔴 AÇIKTA  
**Risk Seviyesi:** KRİTİK

```
SUPABASE_ACCESS_TOKEN="sbp_d20ce89d09f9d7346066e44eed8011b5a3a96fc4"
```

**Risk:**
- Veritabanı tam erişim riski
- Kullanıcı verilerinin güvenliği
- RLS bypass riski

**Acil Aksiyon:**
1. ✅ Supabase dashboard'dan token'ı **HEMEN** iptal et
2. ✅ Yeni token oluştur ve sadece güvenli ortamda sakla
3. ✅ Supabase audit logs'ları kontrol et
4. ✅ Tüm database activity'lerini gözden geçir

---

## 📁 EXPOSED FILES RAPORU

### .env Dosyaları
```
❌ .env
❌ .env.local
✅ env.example (güvenli - placeholder değerler içeriyor)
```

### Hard-Coded Secrets İçeren Diğer Dosyalar

#### Dokümantasyon Dosyaları (Düşük Risk)
```
⚠️ %100-DEPLOY-READY.mdc
   - GEMINI_API_KEY reference (dokümantasyon amaçlı)
   - Deploy talimatları içeriyor
   - Risk: Düşük (referans olarak kullanılıyor)
```

#### Python Script'leri
```
✅ translate_en_json.py
   - .env dosyasından okuyor (hard-coded değil)
   - Risk: Yok
```

#### Edge Functions
```
✅ functions/email-notifications/index.ts
   - RESEND_API_KEY'i environment'tan okuyor
   - Risk: Yok

✅ functions/payment-webhook/index.ts
   - WEBHOOK_SECRET'ı environment'tan okuyor
   - Risk: Yok
```

---

## 🛡️ CONTENT SECURITY POLICY (CSP) ANALİZİ

### Mevcut Durum: 🟡 ORTA

CSP header'ları hem `middleware.ts` hem de `src/utils/security.ts` dosyalarında yapılandırılmış.

### middleware.ts CSP Konfigürasyonu

```typescript
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https:",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com https://www.googletagmanager.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')
```

### CSP Güvenlik Değerlendirmesi

#### 🟢 İyi Uygulamalar
- ✅ `frame-ancestors 'none'` - Clickjacking koruması
- ✅ `object-src 'none'` - Flash/plugin güvenliği
- ✅ `base-uri 'self'` - Base tag injection koruması
- ✅ `form-action 'self'` - Form hijacking koruması
- ✅ `upgrade-insecure-requests` - HTTPS zorunluluğu

#### 🟡 İyileştirme Alanları
- ⚠️ `script-src 'unsafe-inline' 'unsafe-eval'` - XSS riski
- ⚠️ `style-src 'unsafe-inline'` - CSS injection riski
- ⚠️ `img-src https:` - Çok geniş, belirli domain'lerle sınırlandırılmalı

#### 🔴 Önerilen İyileştirmeler

```typescript
// ÖNERİLEN CSP (Nonce-based)
'Content-Security-Policy': [
  "default-src 'self'",
  "script-src 'self' 'nonce-{RANDOM}' https://www.googletagmanager.com",
  "style-src 'self' 'nonce-{RANDOM}'",
  "img-src 'self' data: https://*.supabase.co https://*.googletagmanager.com",
  "font-src 'self'",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://www.google-analytics.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ')
```

---

## 🔒 GÜVENLİK HEADER'LARI ANALİZİ

### Mevcut Durum: 🟢 İYİ

Tüm güvenlik header'ları doğru şekilde yapılandırılmış:

```typescript
✅ X-Frame-Options: DENY
✅ X-Content-Type-Options: nosniff
✅ Referrer-Policy: strict-origin-when-cross-origin
✅ Permissions-Policy: camera=(), microphone=(), geolocation=()
✅ X-XSS-Protection: 1; mode=block
✅ Strict-Transport-Security: max-age=31536000; includeSubDomains (production)
```

### Next.js Image CSP
```typescript
✅ contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
```

---

## 🔍 DİĞER GÜVENLİK KONTROLLER

### ✅ Supabase RLS (Row Level Security)
- Policies.sql dosyası mevcut
- RLS politikaları tanımlı
- Service role kullanımı doğru

### ✅ Auth Validation
```
✅ src/lib/auth/__tests__/auth-validation.test.ts
   - Password strength validation
   - Input sanitization
```

### ✅ Input Sanitization
```
✅ src/utils/security.ts
   - sanitizeNumerologyInput()
   - validateDateInput()
   - validateNameInput()
   - sanitizeHtml()
   - XSS protection functions
```

### ✅ Rate Limiting
```typescript
// middleware.ts'de rate limiting devre dışı (development)
// Production'da aktifleştirilmeli
```

---

## 📊 GÜVENLİK SKORU

### Genel Değerlendirme

| Kategori | Skor | Durum |
|----------|------|-------|
| Hard-coded Secrets | 🔴 0/100 | KRİTİK |
| CSP Konfigürasyonu | 🟡 70/100 | İYİ |
| Security Headers | 🟢 95/100 | ÇOK İYİ |
| Input Validation | 🟢 90/100 | ÇOK İYİ |
| Auth Security | 🟢 85/100 | ÇOK İYİ |
| **TOPLAM** | 🟡 **68/100** | **DEPLOYMENT HAZIR DEĞİL** |

---

## ✅ DEPLOYMENT ÖNCESİ CHECKLIST

### Kritik (Production blocker)
- [ ] GEMINI_API_KEY yenilendi ve sadece Vercel'de
- [ ] SHOPIER_API_KEY/SECRET yenilendi ve sadece Vercel'de
- [ ] SUPABASE_ACCESS_TOKEN yenilendi ve sadece Vercel'de
- [ ] .env ve .env.local dosyaları .gitignore'da
- [ ] Git history'den hassas bilgiler temizlendi
- [ ] Son 48 saatteki API/ödeme logları kontrol edildi

### Yüksek Öncelikli
- [ ] CSP'de nonce-based inline script implementasyonu
- [ ] `img-src` directive'i belirli domain'lerle sınırlandırıldı
- [ ] Rate limiting production'da aktif
- [ ] Webhook secret'ları güçlü değerlerle değiştirildi

### Orta Öncelikli
- [ ] `unsafe-eval` kullanımı minimize edildi veya kaldırıldı
- [ ] JSON-LD script'leri için hash-based CSP eklendi
- [ ] Security headers test edildi (securityheaders.com)
- [ ] OWASP ZAP taraması yapıldı

---

## 🚨 ACİL AKSIYON PLANI

### 1. Hemen (0-2 saat)
```bash
# 1. API key'leri iptal et
# - Google Cloud Console → GEMINI_API_KEY → Delete
# - Shopier Panel → API Credentials → Regenerate
# - Supabase Dashboard → Settings → Tokens → Revoke

# 2. Yeni key'ler oluştur ve Vercel'e ekle
vercel env add GEMINI_API_KEY production
vercel env add GROQ_API_KEY production
vercel env add SHOPIER_API_KEY production
vercel env add SHOPIER_API_SECRET production
vercel env add SUPABASE_ACCESS_TOKEN production

# 3. .gitignore kontrolü
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore

# 4. Git history temizliği (dikkatli!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env .env.local" \
  --prune-empty --tag-name-filter cat -- --all
```

### 2. Bugün (2-8 saat)
- Audit log'ları incele
- Tüm API/ödeme işlemlerini gözden geçir
- Security test'leri çalıştır
- Documentation güncelle

### 3. Bu Hafta
- CSP iyileştirmeleri implement et
- Rate limiting aktifleştir
- Penetration test yap
- Security monitoring kur

---

## 📚 KAYNAKLAR VE ÖNERİLER

### Araçlar
- **git-secrets**: Git commits'te secret'ları tespit et
- **truffleHog**: Git history'de secret taraması
- **OWASP ZAP**: Web application security scanner
- **securityheaders.com**: Header konfigürasyonu test

### Best Practices
1. **Asla** API key'leri commit'leme
2. **Her zaman** environment variables kullan
3. **Düzenli** secret rotation yap
4. **Monitoring** ve alerting kur
5. **Least privilege** prensibini uygula

### Next.js Security Guide
- https://nextjs.org/docs/app/building-your-application/configuring/content-security-policy
- https://owasp.org/www-project-web-security-testing-guide/

---

## 📞 İLETİŞİM

Güvenlik açıkları veya sorular için:
- Email: security@taratarot.com
- Acil: Teknik ekip lead

---

**Rapor Hazırlayan:** AI Security Scan  
**Tarih:** 13 Ekim 2025  
**Versiyon:** 1.0  
**Durum:** 🔴 DEPLOYMENT BLOCKER - KRİTİK SORUNLAR MEVCUT

