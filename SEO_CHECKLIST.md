# ✅ SEO & AdSense Kontrol Listesi

## 📋 Her Kart için Teknik SEO Checklist

Bu listeyi her kart optimize ederken kullanın:

---

### 1️⃣ İçerik Kalitesi (95 Puan)

- [ ] **Kelime Sayısı**: 1200-1500 kelime ✓
- [ ] **Görseller**: 4+ adet (Ana + Semboller + Düz/Ters + Psikoloji)
- [ ] **FAQ**: 5-7 soru-cevap (long-tail keywords ile)
- [ ] **Psikolog Yorumu**: 150+ kelime (unique, kişisel perspektif)
- [ ] **Sembol Analizi**: 4+ sembol detaylı açıklama
- [ ] **Kart Kombinasyonları**: 3-5 kombinasyon
- [ ] **İçerik Derinliği**: Düz + Ters tüm anlamlar (General, Love, Career, Money, Spiritual)
- [ ] **Mitoloji/Hikaye**: 100+ kelime hikaye/arketip
- [ ] **Günlük Pratik**: 3-5 pratik veya 5 affirmation

---

### 2️⃣ Teknik SEO (18 Puan)

#### A. Meta Taglar

```json
{
  "seoMetadata": {
    "title": "Deli Tarot Anlamı | The Fool Kartı: Yeni Başlangıçlar ve Cesaret",
    "description": "Deli (The Fool) tarot kartı ne anlama gelir? Aşk, kariyer, para ve ruhsal yolculukta yeni başlangıçlar, cesaret ve potansiyeli keşfet. Psikolog yorumu ve kombinasyonlar.",
    "canonicalUrl": "/tr/kartlar/joker",
    "ogImage": "/cards/seo/fool-og-image.webp"
  }
}
```

**Kontroller:**
- [ ] Meta Title: 50-60 karakter, ana keyword içeriyor
- [ ] Meta Description: 150-160 karakter, CTA içeriyor
- [ ] Canonical URL: Tam path (ör: `/tr/kartlar/joker`)
- [ ] OG Image: 1200x630px, optimize edilmiş

#### B. Görsel SEO

```json
{
  "additionalImages": [
    {
      "url": "/cards/rws/0-Fool.webp",
      "alt": "Deli tarot kartı, joker tarot kartı, the fool card",
      "caption": "Klasik Rider-Waite-Smith Deli (Joker) Kartı - Majör Arkana 0"
    }
  ]
}
```

**Kontroller:**
- [ ] Her görselde ALT text var (10+ karakter)
- [ ] ALT text doğal, anahtar kelime içeriyor
- [ ] Her görselde caption var
- [ ] Görseller WebP formatında
- [ ] Görseller optimize edilmiş (<200KB)

#### C. Schema.org / JSON-LD

```javascript
// CardPage.tsx içinde otomatik oluşturuluyor
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Deli Tarot Kartı Anlamı",
  "image": [
    "https://siteadresi.com/cards/rws/0-Fool.webp"
  ],
  "author": {
    "@type": "Person",
    "name": "Psikolog Adınız"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Site Adınız"
  },
  "description": "...",
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://siteadresi.com/tr/kartlar/joker"
  }
}
```

**Kontroller:**
- [ ] Article schema eklendi
- [ ] FAQ schema eklendi (FAQ varsa)
- [ ] Breadcrumb schema eklendi
- [ ] ImageObject schema eklendi

#### D. İç Bağlantılar

```json
{
  "related_cards": ["the-magician", "the-sun", "the-tower", "ace-of-wands"],
  "card_combinations": [
    {
      "cards": "Deli + Büyücü",
      "meaning": "..."
    }
  ]
}
```

**Kontroller:**
- [ ] En az 3 related card
- [ ] En az 3 kombinasyon
- [ ] Her kombinasyonda kart ismi linkli
- [ ] İçsel bağlantılar doğal anchor text ile

---

### 3️⃣ AdSense Hazırlık

#### A. Kullanıcı Etkileşim Elementleri

**Gerekli Bileşenler:**
- [ ] "Bugünün Kartını Çek" butonu
- [ ] Emoji reaksiyonu sistemi
- [ ] Yorum bölümü (Disqus veya custom)
- [ ] Affirmation'lar interaktif kartlar halinde
- [ ] Günlük pratikler checkbox'larla

**Örnek Komponent:**
```tsx
<CardDrawWidget 
  locale={locale} 
  cardSlug={cardData.slug}
  onCardDrawn={(card) => {
    // Google Analytics event
    gtag('event', 'card_drawn', { card_name: card.name });
  }}
/>
```

#### B. Sayfa Performansı

- [ ] Sayfa yükleme: <3 saniye
- [ ] LCP (Largest Contentful Paint): <2.5s
- [ ] FID (First Input Delay): <100ms
- [ ] CLS (Cumulative Layout Shift): <0.1
- [ ] Mobile-responsive: ✓

#### C. İçerik Kalitesi Sinyalleri

- [ ] Bounce rate: <%60 (Google Analytics)
- [ ] Avg. time on page: >2 dakika
- [ ] Scroll depth: >60%
- [ ] Interaksiyon: En az 1 aksiyon/kullanıcı

---

## 🔍 Heading Hiyerarşisi Kontrolü

```html
<h1>Deli Tarot Anlamı | The Fool Kartı: Yeni Başlangıçlar ve Cesaret</h1>

<h2>🔮 Deli Kartı Genel Anlamı</h2>
<h3>Düz Pozisyon</h3>
<h3>Ters Pozisyon</h3>

<h2>💖 Aşk Hayatında Deli Kartı</h2>
<h3>Düz Pozisyon</h3>
<h3>Ters Pozisyon</h3>

<h2>💼 Kariyerde Deli Kartı</h2>
<!-- ... -->

<h2>🔮 Deli Kartının Sembolleri</h2>
<h3>Uçurum Kenarı</h3>
<h3>Beyaz Köpek</h3>
<!-- ... -->

<h2>👩‍⚕️ Psikolog Gözüyle Deli Kartı</h2>

<h2>🎴 Deli Kartı Kombinasyonları</h2>

<h2>❓ Sık Sorulan Sorular</h2>
<h3>Deli kartı aşk hayatında ne anlama gelir?</h3>
<!-- ... -->
```

**Kontroller:**
- [ ] Sadece 1 adet H1
- [ ] H1 ana anahtar kelime içeriyor
- [ ] H2'ler mantıklı bölümler
- [ ] H3'ler H2'lerin alt başlıkları
- [ ] Heading atlama yok (H1→H3 değil)

---

## 🎯 Script ile Test

Her kart optimize edildikten sonra:

```bash
node scripts/analyze-card-quality.js
```

**Hedef Puanlar:**
- Minimum: 85/113 (%75+)
- Ideal: 96-113 (%85-100)

---

## 📝 Örnek: Deli Kartı Tam Optimize Edilmiş JSON

```json
{
  "the-fool": {
    "name": "Deli (Joker) Tarot Kartı Anlamı ve Hikayesi (0. Majör Arkana): Yeni Başlangıçlar",
    "short_description": "Deli kartının gerçek anlamını ve mistik hikayesini keşfedin...",
    
    "meanings": {
      "upright": {
        "general": "1500+ kelime içerik...",
        "love": "...",
        "career": "...",
        "money": "...",
        "spiritual": "..."
      },
      "reversed": { /* aynı detayda */ }
    },
    
    "symbolism": {
      "title": "🔮 Deli Kartının Sembolleri",
      "description": "...",
      "symbols": [
        { "name": "Uçurum Kenarı", "meaning": "..." },
        { "name": "Beyaz Köpek", "meaning": "..." },
        { "name": "Beyaz Gül", "meaning": "..." },
        { "name": "Asa ve Çanta", "meaning": "..." },
        { "name": "Sarı Gökyüzü", "meaning": "..." },
        { "name": "Renkli Kıyafet", "meaning": "..." }
      ]
    },
    
    "psychologist_perspective": {
      "title": "👩‍⚕️ Psikolog Gözüyle Deli Kartı",
      "content": "200+ kelime unique yorum..."
    },
    
    "card_combinations": {
      "title": "🎴 Deli Kartı Kombinasyonları",
      "combinations": [
        { "cards": "Deli + Büyücü", "meaning": "..." },
        { "cards": "Deli + Aşıklar", "meaning": "..." },
        { "cards": "Deli + Kader Çarkı", "meaning": "..." },
        { "cards": "Deli + Kule", "meaning": "..." },
        { "cards": "Deli + Ters Şeytan", "meaning": "..." }
      ]
    },
    
    "affirmations": [
      "Evrene güveniyorum ve bilinmeyene cesaretle adım atıyorum. ✨",
      "Yeni başlangıçlar için hazırım, tüm potansiyelime açılıyorum. 🌱",
      "Hatalarımdan korkmuyorum, her deneyim beni büyütür. 🦋",
      "İçsel çocuğumla bağlantılıyım ve hayatın keyfini çıkarıyorum. 🎈",
      "Risk alırken sezgime güveniyorum, evren beni destekliyor. 🌟"
    ],
    
    "daily_practice": {
      "title": "🧘 Deli Enerjisiyle Günlük Pratik",
      "practices": [
        "**Yeni Rota:** Her gün evden çıktığınızda farklı bir yol kullanın.",
        "**Spontane Eylem:** Günde bir kez planlamadığınız bir şey yapın.",
        "**'Evet' Pratiği:** Bir gün boyunca güvenli yeni deneyimlere 'evet' deyin.",
        "**İçsel Çocuk Oyunu:** 15 dakika yaratıcı oyun oynayın.",
        "**Deli Meditasyonu:** Uçurum kenarında durduğunuzu hayal edin."
      ]
    },
    
    "faq": [
      {
        "question": "Deli (Joker) tarot kartı hangi enerjiyi ve arketipi temsil eder?",
        "answer": "200+ kelime detaylı cevap..."
      },
      {
        "question": "Deli kartı ters geldiğinde neye dikkat edilmelidir?",
        "answer": "..."
      },
      {
        "question": "Joker kartının yeni başlangıç enerjisi nasıl dengelenir?",
        "answer": "..."
      },
      {
        "question": "Deli kartı aşk hayatında ne anlama gelir?",
        "answer": "..."
      },
      {
        "question": "Deli kartı hangi tarot kartlarıyla güçlü kombinasyon yapar?",
        "answer": "..."
      },
      {
        "question": "Deli kartının sembollerinin anlamı nedir?",
        "answer": "..."
      },
      {
        "question": "Psikolojik olarak Deli kartı ne ifade eder?",
        "answer": "..."
      }
    ],
    
    "keywords": [
      "deli tarot anlamı",
      "joker tarot kartı",
      "tarot the fool türkçe",
      "tarot yeni başlangıç",
      "tarot psikoloji yorumu",
      "deli kartı ters anlamı",
      "majör arkana sıfır",
      "deli tarot sembolleri"
    ],
    
    "related_cards": [
      "the-magician", 
      "the-sun", 
      "the-tower", 
      "ace-of-wands", 
      "wheel-of-fortune", 
      "the-star"
    ],
    
    "imageUrl": "/cards/rws/0-Fool.webp",
    
    "additionalImages": [
      {
        "url": "/cards/rws/0-Fool.webp",
        "alt": "Deli tarot kartı, joker tarot kartı, the fool card",
        "caption": "Klasik Rider-Waite-Smith Deli (Joker) Kartı"
      },
      {
        "url": "/cards/symbols/fool-symbols.webp",
        "alt": "Deli tarot sembolleri, uçurum kenarı, beyaz köpek",
        "caption": "Deli Kartının Sembolik Detayları"
      },
      {
        "url": "/cards/positions/fool-upright-reversed.webp",
        "alt": "Deli tarot düz ve ters pozisyon",
        "caption": "Deli Kartı Düz ve Ters Pozisyonları"
      },
      {
        "url": "/cards/concepts/fool-psychology.webp",
        "alt": "Tarot psikoloji bağlantısı, deli kartı",
        "caption": "Psikolojik Perspektif: Deli Kartı"
      }
    ],
    
    "seoMetadata": {
      "title": "Deli Tarot Anlamı | The Fool Kartı: Yeni Başlangıçlar ve Cesaret",
      "description": "Deli (The Fool) tarot kartı ne anlama gelir? Aşk, kariyer, para ve ruhsal yolculukta yeni başlangıçlar, cesaret ve potansiyeli keşfet. Psikolog yorumu ve kombinasyonlar.",
      "canonicalUrl": "/tr/kartlar/joker",
      "ogImage": "/cards/seo/fool-og-image.webp",
      "schemaType": "Article"
    }
  }
}
```

---

## ✅ Final Checklist (Gönder Öncesi)

- [ ] Script ile test: 85+ puan
- [ ] Linter hataları yok
- [ ] Tüm görseller yüklendi
- [ ] Mobile test yapıldı
- [ ] PageSpeed Insights: 80+ puan
- [ ] Google Search Console'da hata yok
- [ ] İç bağlantılar çalışıyor
- [ ] Canonical URL doğru
- [ ] OG Image görüntüleniyor (Facebook Debugger ile test)
- [ ] Schema.org test geçti (Google Rich Results Test)

---

**Son Güncelleme:** 29 Ekim 2025  
**Versiyon:** 2.0 (SEO & AdSense Optimized)

