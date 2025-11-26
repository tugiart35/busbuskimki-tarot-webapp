# 🔮 TaraTarot - Tarot Reading Platform

Modern, çok dilli tarot okuma platformu. Next.js 15, Supabase ve TypeScript ile geliştirilmiştir.

---

## 📋 İçindekiler

- [Teknoloji Stack](#-teknoloji-stack)
- [Proje Yapısı](#-proje-yapısı)
- [Veritabanı Şeması](#-veritabanı-şeması)
- [Özellikler](#-özellikler)
- [Tarot Açılımları](#-tarot-açılımları)
- [API Endpoints](#-api-endpoints)
- [Uygulama Akışı](#-uygulama-akışı)
- [Kurulum](#-kurulum)
- [Geliştirme](#-geliştirme)

---

## 🛠 Teknoloji Stack

### Frontend
| Teknoloji | Versiyon | Kullanım |
|-----------|----------|----------|
| **Next.js** | 15.5.5 | App Router, SSR, ISR |
| **React** | 18.3.1 | UI Components |
| **TypeScript** | 5.9.2 | Type Safety |
| **Tailwind CSS** | 3.3.0 | Styling |
| **Framer Motion** | 12.23.0 | Animasyonlar |
| **next-intl** | 4.3.6 | i18n (TR, EN, SR) |
| **React Hook Form** | 7.62.0 | Form Yönetimi |
| **Zod** | 4.0.5 | Validation |

### Backend & Database
| Teknoloji | Kullanım |
|-----------|----------|
| **Supabase** | Auth, Database, RLS |
| **PostgreSQL** | Ana veritabanı |
| **Supabase Edge Functions** | Serverless Functions |

### Ödeme & Entegrasyonlar
| Teknoloji | Kullanım |
|-----------|----------|
| **Shopier** | Ödeme işlemleri |
| **Nodemailer** | E-posta gönderimi |
| **FingerprintJS** | Cihaz tanımlama |

### Analytics & Monitoring
| Teknoloji | Kullanım |
|-----------|----------|
| **Vercel Analytics** | Site analytics |
| **Google Analytics** | Kullanıcı takibi |
| **Facebook Pixel** | Marketing |
| **Web Vitals** | Performance monitoring |

### Testing
| Teknoloji | Kullanım |
|-----------|----------|
| **Jest** | Unit tests |
| **Playwright** | E2E tests |
| **Testing Library** | Component tests |

---

## 📁 Proje Yapısı

```
TaraTarot/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── [locale]/             # Çok dilli rotalar (tr, en, sr)
│   │   │   ├── (main)/           # Ana sayfalar
│   │   │   │   ├── tarotokumasi/ # Tarot okuma sayfaları
│   │   │   │   ├── kartlar/      # Kart detay sayfaları (TR)
│   │   │   │   ├── cards/        # Kart detay sayfaları (EN)
│   │   │   │   ├── kartice/      # Kart detay sayfaları (SR)
│   │   │   │   ├── numeroloji/   # Numeroloji sayfaları
│   │   │   │   ├── legal/        # Yasal sayfalar
│   │   │   │   └── aklindaki-kisi/ # Aklındaki Kişi özelliği
│   │   │   ├── auth/             # Kimlik doğrulama
│   │   │   ├── dashboard/        # Kullanıcı paneli
│   │   │   ├── pakize/           # Admin paneli
│   │   │   └── payment/          # Ödeme sayfaları
│   │   ├── api/                  # API Routes
│   │   │   ├── admin/            # Admin API'leri
│   │   │   ├── cards/            # Kart API'leri
│   │   │   ├── reading-sessions/ # Okuma oturumları
│   │   │   ├── webhook/          # Shopier webhook
│   │   │   └── ...
│   │   ├── robots.ts             # SEO robots.txt
│   │   └── sitemap.ts            # SEO sitemap
│   │
│   ├── components/               # Paylaşılan UI bileşenleri
│   │   ├── admin/                # Admin bileşenleri
│   │   ├── ads/                  # Reklam bileşenleri
│   │   ├── analytics/            # Analytics bileşenleri
│   │   ├── auth/                 # Auth bileşenleri
│   │   ├── consent/              # GDPR consent
│   │   ├── dashboard/            # Dashboard bileşenleri
│   │   ├── seo/                  # SEO bileşenleri
│   │   └── shared/               # Ortak UI bileşenleri
│   │
│   ├── features/                 # Feature-based modüller
│   │   ├── tarot/                # Ana tarot modülü
│   │   │   ├── components/       # Spread bileşenleri
│   │   │   │   ├── Love-Spread/
│   │   │   │   ├── Career-Spread/
│   │   │   │   ├── Marriage/
│   │   │   │   ├── Money-Spread/
│   │   │   │   ├── New-Lover/
│   │   │   │   ├── Problem-Solving/
│   │   │   │   ├── Relationship-Analysis/
│   │   │   │   ├── Relationship-Problems/
│   │   │   │   ├── Situation-Analysis/
│   │   │   │   └── Single-Card/
│   │   │   ├── lib/              # Spread-specific anlamlar
│   │   │   └── shared/           # Paylaşılan tarot utils
│   │   ├── tarot-cards/          # Kart detay sayfaları
│   │   ├── numerology/           # Numeroloji modülü
│   │   ├── psychological-tests/  # Psikolojik testler
│   │   └── shared/               # Paylaşılan feature utils
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── useAuth*.ts           # Auth hooks
│   │   ├── usePayment.ts         # Ödeme hook
│   │   ├── useTarotReading.ts    # Tarot okuma hook
│   │   └── ...
│   │
│   ├── lib/                      # Utility kütüphaneleri
│   │   ├── supabase/             # Supabase client & types
│   │   ├── auth/                 # Auth utilities
│   │   ├── payment/              # Ödeme işlemleri
│   │   ├── seo/                  # SEO utilities
│   │   ├── constants/            # Sabit değerler
│   │   │   └── tarotSpreads.ts   # Tüm spread tanımları
│   │   ├── email/                # E-posta templates
│   │   ├── security/             # Güvenlik utilities
│   │   └── analytics/            # Analytics utilities
│   │
│   ├── providers/                # React Context Providers
│   ├── types/                    # TypeScript tip tanımları
│   └── utils/                    # Yardımcı fonksiyonlar
│
├── functions/                    # Supabase Edge Functions
│   ├── payment-webhook/          # Ödeme webhook işleyici
│   ├── email-notifications/      # E-posta bildirimleri
│   ├── scheduled-cleanup/        # Zamanlanmış temizlik
│   └── refresh-materialized-views/
│
├── migrations/                   # Veritabanı migration'ları
├── messages/                     # i18n çeviri dosyaları
│   ├── tr.json
│   ├── en.json
│   └── sr.json
│
├── public/
│   ├── cards/                    # Tarot kart görselleri (78 kart)
│   └── icons/                    # PWA ikonları
│
└── docs/                         # Dokümantasyon
```

---

## 🗄 Veritabanı Şeması

### Ana Tablolar

```sql
-- Kullanıcı Profilleri
profiles
├── id (UUID, PK)
├── user_id (TEXT, UNIQUE)
├── email (VARCHAR)
├── display_name (VARCHAR)
├── credit_balance (INTEGER, DEFAULT 100)
├── is_premium (BOOLEAN)
├── is_admin (BOOLEAN)
├── timezone (VARCHAR)
├── preferred_language (VARCHAR)
└── created_at, updated_at

-- Tarot Okumaları
readings
├── id (UUID, PK)
├── user_id (TEXT, FK)
├── reading_type (ENUM: love, career, marriage, money, etc.)
├── spread_name (VARCHAR)
├── title (VARCHAR)
├── interpretation (TEXT)
├── cards (JSONB)
├── questions (JSONB)
├── cost_credits (INTEGER)
├── status (ENUM: pending, completed, failed)
└── created_at, updated_at

-- Kredi İşlemleri
transactions
├── id (UUID, PK)
├── user_id (TEXT, FK)
├── type (ENUM: purchase, refund, bonus, deduction, reading)
├── amount (INTEGER)
├── description (TEXT)
├── balance_before (INTEGER)
├── balance_after (INTEGER)
└── created_at

-- Kredi Paketleri
packages
├── id (SERIAL, PK)
├── name (VARCHAR)
├── credits (INTEGER)
├── price (DECIMAL)
├── currency (ENUM: TRY, EUR, USD)
├── features (TEXT[])
├── is_active (BOOLEAN)
└── created_at, updated_at

-- Tarot Açılımları
spreads
├── id (SERIAL, PK)
├── name_tr, name_en, name_sr (VARCHAR)
├── description_tr, description_en, description_sr (TEXT)
├── positions (JSONB)
├── card_count (INTEGER)
├── cost_credits (INTEGER)
├── category (ENUM)
├── difficulty_level (ENUM)
└── active (BOOLEAN)

-- Müşteri Linkleri (Token-based reading)
customer_links
├── id (UUID, PK)
├── customer_email (VARCHAR)
├── token (VARCHAR)
├── token_hash (VARCHAR)
├── status (ENUM: active, expired, used)
├── allowed_ips (TEXT[])
└── expiry_date (TIMESTAMP)

-- Kart Oturumları (Aklındaki Kişi)
card_sessions
├── id (UUID, PK)
├── customer_email (VARCHAR)
├── cards_drawn_today_count (INTEGER)
├── last_24_drawn_cards (JSONB)
├── period_drawn_cards (JSONB)
└── period_start_date (DATE)

-- Audit Logları
audit_logs
├── id (UUID, PK)
├── user_id (TEXT)
├── action (VARCHAR)
├── resource_type (VARCHAR)
├── resource_id (VARCHAR)
├── details (JSONB)
├── ip_address (INET)
└── created_at
```

### Enum Tipleri

```sql
-- Okuma Türleri
reading_type: 'tarot', 'numerology', 'love', 'career', 'general',
              'relationshipAnalysis', 'money', 'relationshipProblems',
              'situationAnalysis', 'newLover', 'problemSolving',
              'marriage', 'single-card'

-- Okuma Durumları
reading_status: 'pending', 'completed', 'failed'

-- İşlem Türleri
transaction_type: 'purchase', 'refund', 'bonus', 'deduction', 'reading'

-- Para Birimleri
currency_type: 'TRY', 'EUR', 'USD'
```

---

## ✨ Özellikler

### 🎴 Tarot Özellikleri
- **10 farklı açılım türü** (Aşk, Kariyer, Evlilik, Para, vb.)
- **78 tarot kartı** detaylı anlamlarıyla
- **Çoklu dil desteği** (Türkçe, İngilizce, Sırpça)
- **Kart çevirme animasyonları** (Framer Motion)
- **Pozisyon bazlı yorumlar**
- **PDF export** özelliği

### 👤 Kullanıcı Özellikleri
- **Supabase Auth** ile kimlik doğrulama
- **Kredi sistemi** (Satın alma, harcama)
- **Okuma geçmişi**
- **Dashboard** ile istatistikler
- **Referral sistemi**

### 💳 Ödeme Sistemi
- **Shopier** entegrasyonu
- **Webhook** ile otomatik kredi yükleme
- **Çoklu para birimi** (TRY, EUR)
- **Güvenli işlem** doğrulama

### 🔐 Güvenlik
- **Row Level Security (RLS)**
- **Rate limiting**
- **IP kısıtlama**
- **Audit logging**
- **GDPR uyumlu consent**

### 📊 SEO & Analytics
- **Dinamik meta tags**
- **Structured data (JSON-LD)**
- **Sitemap generation**
- **Open Graph images**
- **Google Analytics**
- **Facebook Pixel**

---

## 🎴 Tarot Açılımları

| Açılım | Kart Sayısı | Kredi | Kategori |
|--------|-------------|-------|----------|
| **Aşk Uyumu** | 4 | 2 | love |
| **Kariyer** | 7 | 2 | career |
| **Evlilik** | 6 | 2 | marriage |
| **Para** | 5 | 2 | money |
| **Yeni Aşk** | 4 | 2 | newLover |
| **Problem Çözme** | 6 | 2 | problemSolving |
| **İlişki Analizi** | 5 | 2 | relationshipAnalysis |
| **İlişki Sorunları** | 6 | 2 | relationshipProblems |
| **Durum Analizi** | 5 | 2 | situationAnalysis |
| **Tek Kart** | 1 | 1 | single-card |

---

## 🔌 API Endpoints

### Public APIs
```
GET  /api/cards/[locale]/[slug]     # Kart detayları
GET  /api/geolocation               # Kullanıcı lokasyonu
GET  /api/exchange-rate             # Döviz kurları
POST /api/contact                   # İletişim formu
```

### Auth APIs
```
GET  /api/auth-check                # Auth durumu
POST /api/auth/callback             # OAuth callback
```

### Reading APIs
```
POST /api/reading-sessions/validate # Token doğrulama
POST /api/reading-sessions/complete # Okuma tamamlama
POST /api/reading-sessions/save-reading # Okuma kaydetme
```

### Admin APIs
```
GET  /api/admin/reading-sessions    # Tüm oturumlar
POST /api/admin/customer-links      # Link oluşturma
POST /api/admin/send-reading-link   # Link gönderme
POST /api/admin/notify-reading-completed # Bildirim gönderme
```

### Webhook
```
POST /api/webhook/shopier           # Ödeme webhook
```

---

## 🔄 Uygulama Akışı

### 1. Kullanıcı Kayıt/Giriş Akışı
```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Auth Page  │ ──▶ │ Supabase Auth│ ──▶ │  Dashboard  │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │ Auto Profile │
                    │   Creation   │
                    └──────────────┘
```

### 2. Tarot Okuma Akışı
```
┌────────────────┐     ┌─────────────┐     ┌───────────────┐
│ Spread Seçimi  │ ──▶ │ Kart Çekme  │ ──▶ │   Yorum       │
└────────────────┘     └─────────────┘     └───────────────┘
        │                     │                    │
        ▼                     ▼                    ▼
┌────────────────┐     ┌─────────────┐     ┌───────────────┐
│ Kredi Kontrolü │     │  Animasyon  │     │  PDF Export   │
└────────────────┘     └─────────────┘     └───────────────┘
```

### 3. Ödeme Akışı
```
┌───────────────┐     ┌─────────────┐     ┌───────────────┐
│ Paket Seçimi  │ ──▶ │   Shopier   │ ──▶ │   Webhook     │
└───────────────┘     └─────────────┘     └───────────────┘
                                                  │
                                                  ▼
                                          ┌───────────────┐
                                          │ Kredi Ekleme  │
                                          └───────────────┘
```

### 4. Token-Based Reading Akışı (Admin → Müşteri)
```
┌────────────────┐     ┌─────────────┐     ┌───────────────┐
│ Admin: Link    │ ──▶ │ E-posta     │ ──▶ │ Müşteri:      │
│ Oluşturma      │     │ Gönderimi   │     │ Link Açma     │
└────────────────┘     └─────────────┘     └───────────────┘
                                                  │
                                                  ▼
                                          ┌───────────────┐
                                          │ Token Validate│
                                          └───────────────┘
                                                  │
                                                  ▼
                                          ┌───────────────┐
                                          │ Kart Çekme    │
                                          └───────────────┘
```

---

## 🚀 Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn
- Supabase hesabı
- Shopier hesabı (ödeme için)

### 1. Projeyi Klonlayın
```bash
git clone <repo-url>
cd TaraTarot
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Environment Variables
```bash
cp env.example .env.local
```

Gerekli değişkenler:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Shopier
SHOPIER_API_KEY=
SHOPIER_API_SECRET=

# Email
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# Analytics
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_FB_PIXEL_ID=
```

### 4. Veritabanı Migration
```bash
# Supabase CLI ile
supabase db push
```

### 5. Geliştirme Sunucusu
```bash
npm run dev
```

---

## 🧪 Geliştirme

### Scriptler
```bash
# Geliştirme
npm run dev           # Dev server
npm run build         # Production build
npm run start         # Production server

# Kod Kalitesi
npm run lint          # ESLint
npm run format        # Prettier
npm run typecheck     # TypeScript check
npm run code-quality  # Tümü

# Test
npm run test          # Jest tests
npm run test:e2e      # Playwright E2E
npm run test:coverage # Coverage report

# i18n
npm run i18n:check    # Hardcoded string kontrolü
npm run i18n:migrate  # Otomatik migration

# Performance
npm run analyze       # Bundle analyzer
npm run lighthouse    # Lighthouse audit
```

### Dosya Boyutu Kuralları
- **Warning**: 700 satır
- **Hard Limit**: 1000 satır
- 700+ satırda yeni kod eklenemez (refactoring gerekir)

---

## 📄 Lisans

Bu proje özel mülkiyettedir. Tüm hakları saklıdır.

---

## 👥 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

**TaraTarot** © 2024-2025

