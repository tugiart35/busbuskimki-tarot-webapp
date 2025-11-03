# 🎯 Tarot Kartları Kalite Analiz Scripti

## 📋 Genel Bakış

Bu script, tüm tarot kartlarınızı **Google AdSense onay kriterleri** ve **SEO kalitesi** standartlarına göre analiz eder ve puanlar.

## 🚀 Kullanım

### Temel Kullanım

```bash
cd /Users/tugi/Desktop/busbuskimki
node scripts/analyze-card-quality.js
```

### Çıktılar

Script çalıştırıldığında:

1. **Terminal Çıktısı**: Renkli, detaylı analiz raporu
2. **JSON Raporu**: `card-quality-report.json` dosyası (proje kök dizininde)

## 📊 Puanlama Sistemi

### Toplam Puan: 113

#### [İÇERİK KALİTESİ - 95 Puan]

| Kriter | Max Puan | Açıklama |
|--------|----------|----------|
| **Kelime Sayısı** | 25 | 1200-1500 kelime hedef |
| **Görseller** | 15 | En az 4 görsel |
| **FAQ** | 15 | En az 5 soru-cevap |
| **Psikolog Yorumu** | 15 | 150+ kelime unique content |
| **Sembol Analizi** | 10 | En az 4 sembol açıklaması |
| **Kart Kombinasyonları** | 5 | En az 3 kombinasyon |
| **SEO Metadata** | 5 | Title + Description |
| **İçerik Derinliği** | 5 | Tüm anlamlar (Düz/Ters) |
| **Mitoloji/Hikaye** | 3 | 100+ kelime hikaye |
| **Günlük Pratik** | 2 | Affirmation veya pratik |

#### [TEKNİK SEO & ADSENSE - 18 Puan]

| Kriter | Max Puan | Açıklama |
|--------|----------|----------|
| **Canonical & OG Image** | 3 | Teknik SEO temel |
| **Schema.org Hazırlık** | 2 | JSON-LD veri yapısı |
| **İç Bağlantılar** | 2 | Cross-linking |
| **Görsel ALT Text** | 2 | Görsel SEO |
| **Kullanıcı Etkileşimi** | 2 | İnteraktif elementler |

### Notlar

| Puan Aralığı | Not | Durum |
|--------------|-----|--------|
| 85-100 | A+ | ✅ AdSense'e Hazır |
| 70-84 | B+ | 🔸 Küçük iyileştirme gerekli |
| 55-69 | C+ | ⚠️ Orta seviye çalışma |
| 40-54 | D | ❌ Kapsamlı çalışma |
| <40 | F | 🚨 Tümden yenileme |

## 📈 Mevcut Durum (Son Analiz)

```
📅 Analiz Tarihi: 29 Ekim 2025
📊 Toplam Kart: 78
⭐ Ortalama Puan: 27/113 (23.9%)
🎯 AdSense Hazır Kartlar: 0 (%0)

Not Dağılımı:
- A+ (85-100%): 0 kart
- B+ (70-84%): 0 kart
- C+ (55-69%): 0 kart
- D (40-54%): 0 kart
- F (<40%): 78 kart ❌

En Yaygın Sorunlar:
1. SEO Metadata Eksik: 156 sorun (Canonical + OG Image)
2. Kelime Sayısı Yetersiz: 78 kart
3. Görsel Eksikliği: 78 kart
```

## 🎯 En İyi Kart

**Deli (Joker) Kartı** - 34/113 puan (30.1%)
- ✅ Temel içerik var (679 kelime)
- ✅ Schema.org için veri hazır
- ❌ Psikolog yorumu yok
- ❌ Sembol analizi yok
- ❌ Sadece 1 görsel
- ❌ SEO metadata eksik (Canonical & OG Image)

## ⚠️ En Yaygın Sorunlar

### İçerik Kalitesi

1. **Kelime Sayısı Yetersiz**: 78 kart (%100)
   - Mevcut: ~70-100 kelime
   - Hedef: 1200-1500 kelime

2. **Görsel Eksikliği**: 78 kart (%100)
   - Mevcut: 1 görsel
   - Hedef: 4+ görsel

3. **Psikolog Yorumu Yok**: 78 kart (%100)
   - Bu unique content için kritik!

4. **Sembol Analizi Yok**: 78 kart (%100)
   - Derin içerik sinyali

5. **FAQ Yetersiz**: 78 kart (%100)
   - Mevcut: 2-3 soru
   - Hedef: 5+ soru

### Teknik SEO & AdSense

6. **SEO Metadata Eksik**: 156 sorun (Canonical + OG Image)
   - Tüm kartlarda canonical URL yok
   - Tüm kartlarda OG Image yok (1200x630px gerekli)

7. **Görsel ALT Text Yok**: 78 kart (%100)
   - Görsel SEO için kritik

8. **İnteraktif Element Eksik**: 78 kart (%100)
   - AdSense için kullanıcı etkileşimi gerekli

## 🛠️ Önerilen Aksiyonlar

### Kısa Vadeli (1 Hafta)

1. ✅ **Deli Kartını Optimize Edin** (Model olarak)
   - **İçerik:** Kelime sayısı: 679 → 1500
   - **İçerik:** Görsel: 1 → 4 (ALT text ile)
   - **İçerik:** Psikolog yorumu ekle (150+ kelime)
   - **İçerik:** Sembol analizi ekle (4+ sembol)
   - **İçerik:** FAQ: 3 → 7
   - **SEO:** Canonical URL ekle
   - **SEO:** OG Image ekle (1200x630px)
   - **SEO:** Görsel ALT textler optimize et
   - **AdSense:** İnteraktif element ekle (kart çekme butonu)

2. **En Zayıf 5 Kartı İyileştirin**
   - Başrahibe
   - Büyücü
   - İmparatoriçe
   - İmparator
   - Başrahip

### Orta Vadeli (1 Ay)

3. **22 Majör Arkana Kartını Tamamlayın**
   - Tüm kartları Deli kartı seviyesine getirin
   - Her karta psikolog yorumu ekleyin
   - Her karta sembol analizi ekleyin

### Uzun Vadeli (3 Ay)

4. **56 Minor Arkana Kartını Optimize Edin**
   - Aynı standartları uygulayın
   - Kart takımlarına özel içerik ekleyin

## 📝 JSON Rapor Yapısı

```json
{
  "generatedAt": "2025-10-29T...",
  "summary": {
    "totalCards": 78,
    "avgScore": 24.0,
    "gradeDistribution": { ... },
    "adsenseReadiness": { ... }
  },
  "cards": [
    {
      "slug": "the-fool",
      "name": "...",
      "totalScore": 31,
      "grade": "F",
      "scores": { ... },
      "issuesCount": 8,
      "strengthsCount": 2
    }
  ],
  "topIssues": [ ... ]
}
```

## 🔄 Scripti Tekrar Çalıştırma

Her kart güncellemesinden sonra scripti tekrar çalıştırın:

```bash
node scripts/analyze-card-quality.js
```

İlerlemenizi takip edebilirsiniz!

## 📌 Hedef Timeline

| Tarih | Hedef | Beklenen Sonuç |
|-------|-------|----------------|
| 1 Hafta | Deli kartı optimize | 85+ puan |
| 2 Hafta | 5 kart optimize | Ortalama 30→50 |
| 1 Ay | 22 Majör Arkana | Ortalama 50→70 |
| 3 Ay | Tüm 78 kart | Ortalama 70→85 |
| **3 Ay** | **AdSense Onay Başvurusu** | ✅ Onay! |

## 🎓 Deli Kartı Şablonu

Deli kartını optimize ettikten sonra, onu diğer kartlar için şablon olarak kullanabilirsiniz:

```bash
# Deli kartı optimize edilmiş haliyle:
- Kelime Sayısı: 1500+
- Görsel: 4+
- FAQ: 7+
- Psikolog Yorumu: ✅
- Sembol Analizi: ✅
- Kombinasyonlar: ✅
- Puan: 85-90/100
```

Bu şablonu tüm kartlara uygulayın!

## 💡 İpuçları

1. **Batch İşleme**: Bir seferde 5 kartı optimize edin
2. **Görsel Önceliği**: Görseller en kolay kazanılan puanlardır
3. **FAQ Optimizasyonu**: Long-tail anahtar kelimelerle FAQ yazın
4. **Psikolog Yorumu**: Unique content için en kritik alan
5. **Test Edin**: Her güncelleme sonrası scripti çalıştırın

## 🚨 Kritik Uyarılar

- ❌ Tüm kartların %100'ü AdSense standartlarının altında
- ❌ Ortalama kelime sayısı: ~80 kelime (Hedef: 1200-1500)
- ❌ Hiçbir kartta psikolog yorumu yok
- ❌ Hiçbir kartta sembol analizi yok

**Google AdSense onayı için KAPSAMLI iyileştirme şart!**

## 📞 Destek

Script ile ilgili sorun yaşarsanız:
1. Terminal çıktısını kontrol edin
2. `card-quality-report.json` dosyasını inceleyin
3. Error mesajları için scripti debug modda çalıştırın

---

**Son Güncelleme**: 29 Ekim 2025
**Script Versiyonu**: 1.0.0
**Yazar**: AI Assistant

