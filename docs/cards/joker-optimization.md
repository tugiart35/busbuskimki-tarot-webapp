# Joker (Deli) Kartı Optimizasyon Çalışma Planı

Bu dosya, `data/card-backlog.csv` içinde `S1 - Pilot Joker` olarak işaretlenen Joker kartını (slug: `the-fool`) AdSense ve kalite standartlarına uygun hâle getirmek için gereken tüm işleri detaylandırır.

---

## 1. Başlangıç Durumu (29 Ekim 2025)
- **Kaynak dosya**: `src/lib/data/tarot-cards.json › blog.cards['the-fool']`
- **Kelime sayısı**: ≈ 744 (script ile hesaplanan toplam)
- **Soru sayısı**: 3 FAQ
- **Toplam kalite puanı**: 34/100 (bkz. `card-quality-report.json:22`)
- **Görseller**: 1 adet, ALT metni belirsiz
- **Eksik alanlar**:
  - Büşbüşkimki yorumu alanı yok
  - Sembol analizi yok
  - Kombinasyon, günlük pratik, affirmation alanları eksik
  - 1200–1500 kelime aralığının altında
  - SEO metadata ve schema alanları doldurulmamış

---

## 2. Hedefler
1. Kelime sayısını **min. 1.500** seviyesine çıkarmak (Majör Arkana standardı).
2. Her ana bölüm için tutarlı alt başlıklar (`H2/H3`) ve Türkçe odaklı, özgün içerik yazmak.
3. Google’ın “Düşük değere sahip içerik” uyarısını ortadan kaldıracak şekilde benzersiz, derinlikli ve kaynaklı yorumlar sunmak.
4. Görsel sayısını 4’e çıkarıp, hepsine açıklayıcı ALT metni eklemek.
5. FAQ, kombinasyon, affirmation ve günlük pratik bölümlerini kullanıcı sorularına göre zenginleştirmek.
6. SEO metadata, schema markup ve iç linkleme gereksinimlerini karşılamak.

---

## 3. İçerik Üretim Akışı

### 3.1. Düz Anlamlar (Upright)
- **Genel**: 200+ kelime; arketipsel anlam, yolculuğun başlangıcı, cesaret ve potansiyel vurgusu.
- **Aşk**: 180+ kelime; bekar/ilişki/gölge yönleri, örnek senaryolar.
- **Kariyer**: 180+ kelime; girişimcilik, risk, yaratıcı projeler, dikkat edilmesi gerekenler.
- **Para**: 150+ kelime; yatırım, bütçe disiplinine karşın sezgi, örnek vaka.
- **Ruhsal**: 150+ kelime; içsel çocuk, spiritüel sıçrama, meditasyon önerileri.

### 3.2. Ters Anlamlar (Reversed)
- Aynı başlık yapısıyla her alt konu için 150+ kelime.
- Riskler, uyarılar, dönüşüm ipuçları ve toparlayıcı akış.

### 3.3. Büşbüşkimki Yorumu Bölümü
- 200–250 kelimelik marka perspektifi.
- Duygusal farkındalık, sezgisel denge ve topluluk deneyimleri üzerine özgün analiz.
- Uygulanabilir öneriler (ör. günlük tutma, farkındalık egzersizleri).

### 3.4. Sembol Analizi
- En az 4 ana sembol: uçurum, köpek, beyaz gül, güneş vb.
- Her sembol için 80–100 kelimelik açıklama + tarot tarihindeki yeri.

### 3.5. Mitoloji / Hikâye
- Mevcut 111 kelimelik bölüm 250 kelimeye çıkarılacak.
- Jung arketipleri, kolektif bilinç ve farklı destelerdeki temsil.

### 3.6. Kombinasyonlar
- 5 kombinasyon kartı (örn. **Joker + Büyücü**, **Joker + Kule**).
- Her kombinasyon için 80–100 kelimelik senaryo.

### 3.7. Affirmation (Olumlamalar)
- 5 adet, her biri 1 cümlelik güçlü olumlama.
- Duygusal ve spiritüel dönüşümü destekleyecek özgün dil.

### 3.8. Günlük Pratikler
- 3–5 adet uygulanabilir öneri (nefes egzersizi, rutine yenilik katma vb.).
- Her biri 60–80 kelimelik açıklama ile.

### 3.9. FAQ
- Toplam 7 soru.
- Kullanıcı arama niyetlerine göre (aşk, kariyer, ters anlam, kombinasyon).
- 100–120 kelimelik net cevaplar; anahtar kelime içeren sorular.

---

## 4. Görsel ve Multimedya Gereksinimleri
- **Görsel Seti**:
  1. Ana kart görseli (Rider-Waite) – mevcut, ALT metni güncellenecek.
  2. Sembolleri işaretleyen infografik.
  3. Düz vs. ters anlam karşılaştırma görseli.
  4. Büşbüşkimki perspektifini temsil eden konsept görseli.
- **Alt metin standardı**: 110–125 karakter, anahtar kelimeyi doğal biçimde içerir.
- **Dosya yolu önerisi**: `public/cards/joker/` altında `joker-main.jpg`, `joker-symbols.jpg`, `joker-upright-vs-reversed.jpg`, `joker-busbuskimki.jpg`.
- **Ekstra**: Varsa kısa video/animasyon için transkript notu.

---

## 5. SEO, Schema ve Teknik Görevler
- **Meta Title**: 60 karakter sınırında, ana anahtar kelime + ikincil kelime.
- **Meta Description**: 150–155 karakter, CTA içeren.
- **URL kontrolü**: `/tr/kartlar/joker` canonical, `slug` uyumu doğrulanacak.
- **Structured Data**:
  - `Article` schema (Türkçe içerik, yazar, yayın tarihi).
  - `FAQPage` schema (7 soru/cevap).
  - `BreadcrumbList`.
- **İç Linkleme**:
  - En az 4 iç link: (ör. `the-magician`, `the-high-priestess`, tarot açılım rehberi, blog yazısı).
  - Navigasyon düğümleri, CTA butonu (“Tüm kartları keşfet”).
- **External/study kaynakları**: Makalenin sonunda 2–3 güvenilir referans bağlantısı.

---

## 6. QA ve Yayın Öncesi Kontroller
- Grammarly/LanguageTool ile yazım denetimi.
- Copyscape veya benzeri bir araçla %100 özgünlük raporu.
- Lighthouse erişilebilirlik testi (kontrast, başlık hiyerarşisi).
- Görseller için WebP alternatifi ve `loading="lazy"`.
- Tarayıcı önizleme (mobil + masaüstü).
- PR açmadan önce `npm run lint` ve varsa içerik test scripti çalıştır.

---

## 7. Teslimatlar
1. Güncellenmiş içerik (`src/lib/data/tarot-cards.json` ilgili alan).
2. Yeni görseller + optimizasyon raporu.
3. Copyscape/özgünlük çıktısı (`evidence/the-fool-YYYYMMDD.pdf`).
4. QA checklist (`logs/progress.md` içine kart bazlı not).
5. Meta ve schema güncellemelerini içeren commit/pull request.

---

## 8. Sonraki Adım
- İçerik taslağı hazırlandığında `data/card-backlog.csv:2` satırındaki `durum` alanını “İçerik Taslak” olarak güncelle.
- Editör onayı ve SEO kontrolleri sonrası aşamaları aynı satırda güncelleyerek ilerlemeyi izleyin.

Bu plan tamamlandığında Joker kartı, tüm diğer kartlar için örnek şablon işlevi görecek kalite seviyesine ulaşacaktır.

---

## 9. Durum Güncellemesi (29 Ekim 2025)
- **Kelime sayısı**: 2.121 (hedef 1.500’ün üzerinde)
- **Yeni bölümler**: Büşbüşkimki yorumu, sembol analizi, numeroloji, kombinasyonlar, affirmation seti ve günlük pratikler eklendi.
- **FAQ**: 7 soruya çıkarıldı; kullanıcı arama niyetleri ve kombinasyon soruları dahil edildi.
- **Görsel planı**: `image_gallery` alanında dört görsel için yol ve ALT metinleri (Büşbüşkimki perspektifi dahil) tanımlandı.
- **SEO**: Meta başlık, açıklama ve odak anahtar kelimeler güncellendi.
- **Backlog**: `data/card-backlog.csv:2` satırı “Canlı” durumuna çekildi ve sorumlular atandı.
- **Kanıt**: İçerik güncellemeleri `src/lib/data/tarot-cards.json` dosyasında kayıtlı.
