# 📊 SEO & E-E-A-T Analiz Script'i

Bu script, Tarot kart JSON dosyalarınızı Google'ın SEO kuralları ve E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) ilkelerine göre kapsamlı şekilde analiz eder.

## 🎯 Amaç

JSON formatındaki tarot kartı içeriklerinin:
- ✅ SEO uyumluluğunu kontrol etmek
- ✅ İçerik kalitesini değerlendirmek
- ✅ E-E-A-T standartlarına uygunluğunu test etmek
- ✅ AdSense politikalarına uyumunu doğrulamak
- ✅ Kullanıcı deneyimi (UX) standartlarını ölçmek

## 📋 Kontrol Edilen Kurallar

### 🔍 SEO (50 puan)
1. **Meta Title** - 60 karakter limiti
2. **Meta Description** - 140-160 karakter aralığı
3. **Focus Keywords** - 3-5 anahtar kelime
4. **Ana Keyword Title'da** - Ana anahtar kelimenin başlıkta varlığı
5. **URL Slug** - SEO-friendly (sadece küçük harf, rakam ve tire)

### 📝 İçerik Kalitesi (65 puan)
1. **Toplam Kelime Sayısı** - Minimum 1500 kelime (Kritik!)
   - 2000+ kelime: 15 puan ⭐️
   - 1500-2000 kelime: 12 puan ✅
   - 1000-1500 kelime: 8 puan ⚠️
   - 800-1000 kelime: 5 puan ❌
2. **Görsel Mevcudiyeti** - En az 1 görsel (önerilen 3-4)
3. **FAQ Bölümü** - Minimum 3 soru
4. **İlişkili Kartlar** - Minimum 3 iç bağlantı
5. **Kart Kombinasyonları** - Minimum 3 kombinasyon
6. **Sembolik Açıklamalar** - Minimum 3 sembol

### ⭐ E-E-A-T (45 puan)
1. **Experience** - Kişisel/deneyimsel dil kullanımı (sen/sana hitabı)
2. **Expertise** - Mitoloji, tarih, numeroloji bilgisi
3. **Authoritativeness** - Detaylı açıklamalar (min 100 karakter)
4. **Trustworthiness** - FAQ ve tutarlı bilgi yapısı

### 💰 AdSense Uyumluluğu (30 puan)
1. **Özgün İçerik** - Minimum 50 karakter açıklama
2. **Yeterli Hacim** - Ana içerik 300+ kelime
3. **Uygun İçerik** - Yanıltıcı ifadelerden kaçınma

### 👤 Kullanıcı Deneyimi (40 puan)
1. **Kısa Özet** - Minimum 100 karakter
2. **Yapılandırılmış Kategoriler** - 5 alan (general, love, career, money, spiritual)
3. **Okunabilirlik** - Ortalama cümle uzunluğu ≤25 kelime
4. **Numeroloji İçgörüleri** - Minimum 3 içgörü

**TOPLAM: 220 puan**

## 🚀 Kullanım

### Gereksinimler
```bash
npm install
# TypeScript ve Node.js kurulu olmalı
```

### Temel Kullanım
```bash
# Varsayılan dosya ile (kartlarfinal.json)
npx ts-node scripts/seo-eeat-checker.ts

# Özel dosya ile
npx ts-node scripts/seo-eeat-checker.ts ./data/kartlar.json

# Özel çıktı dosyası ile
npx ts-node scripts/seo-eeat-checker.ts ./data/kartlar.json ./custom-report.json
```

### Çıktı Formatları

#### 1. Konsol Çıktısı
- Genel özet istatistikler
- En iyi 3 kart
- İyileştirme gerektiren 3 kart
- Her kart için detaylı analiz

#### 2. JSON Raporu (seo-eeat-report.json)
```json
{
  "summary": {
    "totalCards": 78,
    "averageScore": "200.5",
    "maxScore": 220,
    "percentage": "91.1",
    "topCards": [...],
    "bottomCards": [...]
  },
  "cards": [
    {
      "cardId": "the-fool",
      "cardName": "Joker Tarot Kartı Anlamı ve Yolculuk Rehberi",
      "overallScore": 212,
      "maxScore": 220,
      "checks": {
        "seo": [...],
        "content": [...],
        "eeat": [...],
        "adsense": [...],
        "ux": [...]
      }
    }
  ]
}
```

## 📊 Mevcut Analiz Sonuçları

**Analiz Tarihi:** 31 Ekim 2025

### Genel Durum
- **Toplam Kart:** 78
- **Ortalama Skor:** 200.5/220 (91.1%) ✅
- **Genel Değerlendirme:** Çok İyi

### 🏆 En İyi Kartlar
1. **Joker Tarot Kartı** - 212/220 (96.4%) - A+
2. **Büyücü Tarot Kartı** - 207/220 (94.1%) - A
3. **Başrahibe Tarot Kartı** - 207/220 (94.1%) - A

### ⚠️ İyileştirme Gereken Kartlar
1. **Kader Çarkı** - 182/220 (82.7%) - B
2. **Asa On** - 187/220 (85.0%) - B
3. **Asaların Dokuzlusu** - 187/220 (85.0%) - B

## 🔧 Notasyon Sistemi

| Skor | Not | Durum |
|------|-----|-------|
| 90%+ | A+ | Mükemmel |
| 80-90% | A | Çok İyi |
| 70-80% | B | İyi |
| 60-70% | C | Orta |
| 50-60% | D | Zayıf |
| <50% | F | Yetersiz |

## ⚡ Kritik İyileştirme Önerileri

### 1. Kelime Sayısı Eksikliği (En Önemli!)
Tüm kartlarda **1500+ kelime** hedefine ulaşılmalı. Şu anda kartların çoğu 800-1000 kelime arasında.

**Çözüm:**
- Celtic Cross pozisyonlarını genişletin
- Günlük affirmation/pratik bölümü ekleyin
- Tarot okuma örnekleri ekleyin
- Kişisel deneyim hikayeleri ekleyin
- Kart kombinasyonlarını detaylandırın

### 2. Görsel Eksikliği
Her kart için **3-4 özgün görsel** eklenmeli.

**Önerilen Görseller:**
- Ana kart görseli (mevcut)
- Sembol detay görselleri
- Kart kombinasyonu görselleri
- İnfografik/şema

### 3. ALT Text Optimizasyonu
Tüm görsellere SEO uyumlu ALT text eklenmeli.

## 📁 Dosya Yapısı

```
busbuskimki/
├── scripts/
│   ├── seo-eeat-checker.ts       # Ana script
│   └── SEO-EEAT-CHECKER-README.md # Bu dosya
├── data/
│   ├── kartlarfinal.json         # Analiz edilen dosya
│   └── kartlar.json              # Alternatif dosya
└── seo-eeat-report.json          # Çıktı raporu
```

## 🐛 Sorun Giderme

### JSON Parse Hatası
Script, bozuk JSON formatlarını otomatik düzeltmeye çalışır:
- Eksik açılış süslü parantezi ekler
- Eksik kapanış süslü parantezlerini tamamlar
- Sondaki virgülü temizler

### TypeScript Hatası
```bash
# ts-node yüklü değilse
npm install -D ts-node typescript @types/node
```

## 📞 Destek

Herhangi bir sorunla karşılaşırsanız:
1. JSON dosyanızın geçerli olduğundan emin olun
2. Node.js ve npm versiyonlarını kontrol edin
3. Script çıktısındaki detaylı hata mesajlarını inceleyin

## 🎓 Best Practices

### İçerik Yazımı
- Doğal ve akıcı Türkçe kullanın
- Okuyucuya direkt hitap edin (sen/sana)
- Kısa paragraflar kullanın (3-4 satır)
- Her 200 kelimede bir alt başlık ekleyin
- Madde işaretleri ve tablolar kullanın

### SEO Optimizasyonu
- Ana keyword'ü title'a başta ekleyin
- Meta description'da CTA (Call to Action) kullanın
- URL'lerde Türkçe karakter kullanmayın
- İç bağlantıları anlamlı ankor textlerle ekleyin

### E-E-A-T Güçlendirme
- Mitolojik referanslar ekleyin
- Tarihsel bağlamlar verin
- Numeroloji analizi derinleştirin
- Kişisel deneyimlerden bahsedin

## 📈 Gelecek Güncellemeler

- [ ] Schema.org yapılandırılmış veri kontrolü
- [ ] Anahtar kelime yoğunluğu analizi
- [ ] Okunabilirlik skoru hesaplama (Flesch Reading Score)
- [ ] Görsel boyut ve optimizasyon kontrolü
- [ ] Bağlantı kontrolü (iç/dış linkler)
- [ ] HTML çıktı desteği

---

**Son Güncelleme:** 31 Ekim 2025  
**Versiyon:** 1.0.0  
**Lisans:** MIT








