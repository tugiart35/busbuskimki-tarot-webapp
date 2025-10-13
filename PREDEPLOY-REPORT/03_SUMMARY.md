# i18n & SEO Analiz Özeti

**Tarih:** 13 Ekim 2025  
**Oluşturulan Raporlar:**
- `03_I18N.txt` - i18n coverage analizi
- `03_SEO.txt` - SEO tags analizi

---

## 📊 i18n Coverage Sonuçları

### Genel Durum

- **Toplam kullanılan anahtar:** 641 unique key
- **TR locale anahtarları:** 28,385 key
- **EN locale anahtarları:** 28,385 key  
- **SR locale anahtarları:** 27,971 key

### ❌ Kritik Bulgular

#### TR Locale'de Eksik Anahtarlar: 115

Bulunan eksik anahtarlar çoğunlukla dinamik template string'lerden kaynaklanıyor:

1. **Template string'ler** (gerçekte eksik değil):
   - `${config.spreadId}.data.spreadTitle`
   - `${config.translationNamespace}.data.badgeText`
   - `career.meanings.${cardKey}.position1.*`
   - `love.meanings.${cardKey}.position1.*`
   - `money.meanings.${cardKey}.position1.*`

2. **Gerçek eksik anahtarlar:**
   - `email`
   - `minLength`
   - `pattern`
   - `required`
   - `notFound`
   - `notFoundDescription`

#### SR Locale'de Eksik Anahtarlar: 428

SR (Sırpça) çevirileri EN'e göre 428 eksik anahtar içeriyor:
- Çoğunlukla `numerology.birthdayMeanings.*` anahtarları
- Toplam 414 anahtar daha var

### ⚠️ Kullanılmayan Anahtarlar

Her locale'de **~27,445 kullanılmayan anahtar** tespit edildi. Bu çok yüksek bir sayı ve olası nedenler:
1. Script'in tüm kullanımları yakalayamamış olması (dinamik anahtarlar)
2. Eski/kullanılmayan içerikler
3. Gelecekte kullanılmak üzere hazırlanmış anahtarlar

---

## 🔍 SEO Tags Analizi

### Genel Durum

- **Analiz edilen sayfa:** 50 page/layout dosyası
- **Metadata bulunan:** 14 sayfa (%28)
- **Metadata eksik:** 36 sayfa (%72)
- **Alternates/hreflang bulunan:** 40 sayfa (%80)
- **Canonical URL bulunan:** 41 sayfa (%82)

### ✅ İyi Durumdaki Sayfalar

Aşağıdaki sayfalar tam SEO metadata'ya sahip:
- `/cards` (kartlar listeleme)
- `/kartlar` (TR)
- `/kartice` (SR)
- Tüm legal sayfalar (about, privacy, terms, vb.)
- Blog sayfaları
- Numeroloji ana sayfası

### ❌ SEO Eksiklikleri

#### 1. Metadata Eksik Sayfalar (36 sayfa)

**Tüm admin sayfaları** metadata'ya sahip değil:
- `/admin/analytics`
- `/admin/auth`
- `/admin/orders`
- `/admin/packages`
- `/admin/readings`
- `/admin/settings`
- `/admin/users`

**Dashboard sayfaları:**
- `/dashboard/credits`
- `/dashboard/packages`
- `/dashboard/readings`
- `/dashboard/settings`
- `/dashboard/statistics`

**Auth sayfaları:**
- `/auth/reset-password`

**Payment sayfaları:**
- `/payment/cancel`
- `/payment/success`

**Diğer:**
- `/maintenance`

#### 2. Hreflang Eksik Sayfalar (10 sayfa)

- `/cards/[slug]` - Dinamik kart detay sayfaları (3 dil için)
- `/numeroloji` layout
- `/tarotokumasi` layout
- `/auth` layout ve page
- `/dashboard` layout
- Root layout

#### 3. Canonical URL Eksik Sayfalar (9 sayfa)

Hreflang eksik sayfalarla büyük oranda örtüşüyor.

---

## 🎯 Öneriler

### i18n İçin

1. **Gerçek eksik anahtarları ekleyin:**
   ```json
   {
     "email": "E-posta",
     "minLength": "Minimum uzunluk",
     "pattern": "Geçersiz format",
     "required": "Bu alan zorunludur",
     "notFound": "Sayfa bulunamadı",
     "notFoundDescription": "Aradığınız sayfa bulunamadı"
   }
   ```

2. **SR locale'yi güncelleyin:**
   - `numerology.birthdayMeanings.*` anahtarlarını çevirin
   - EN ile karşılaştırarak eksik 428 anahtarı tamamlayın

3. **Kullanılmayan anahtarları temizleyin** (opsiyonel):
   - Önce production'da kullanım kontrolü yapın
   - Gerçekten kullanılmayan anahtarları kaldırarak dosya boyutunu küçültün

### SEO İçin

#### Yüksek Öncelik

1. **Dinamik kart sayfalarına metadata ekleyin:**
   ```typescript
   // src/app/[locale]/(main)/cards/[slug]/page.tsx
   export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
     const { locale, slug } = params;
     
     return {
       title: `${cardName} - Tarot Kartı`,
       description: `${cardName} tarot kartının anlamı, yorumu...`,
       alternates: {
         canonical: `https://yoursite.com/${locale}/cards/${slug}`,
         languages: {
           'tr': `/tr/kartlar/${slug}`,
           'en': `/en/cards/${slug}`,
           'sr': `/sr/kartice/${slug}`
         }
       },
       openGraph: {
         title: `${cardName} - Tarot Kartı`,
         description: `${cardName} tarot kartının anlamı...`,
         images: [cardImage]
       }
     };
   }
   ```

2. **Layout'lara metadata ekleyin:**
   - `/numeroloji/layout.tsx`
   - `/tarotokumasi/layout.tsx`
   - `/dashboard/layout.tsx`

#### Orta Öncelik

3. **Dashboard sayfalarına temel metadata ekleyin:**
   ```typescript
   export const metadata: Metadata = {
     title: 'Dashboard',
     robots: {
       index: false,  // Private sayfalar için
       follow: false
     }
   };
   ```

4. **Admin sayfalarına noindex ekleyin:**
   ```typescript
   export const metadata: Metadata = {
     robots: {
       index: false,
       follow: false
     }
   };
   ```

#### Düşük Öncelik

5. **Auth ve ödeme sayfalarına metadata:**
   - Bu sayfalar genellikle geçici/private olduğu için düşük öncelik
   - Yine de temel title ve noindex eklenmeli

---

## 📈 Başarı Metrikleri

### i18n Coverage

| Locale | Toplam Key | Eksik Key | Durum |
|--------|-----------|-----------|-------|
| TR     | 28,385    | 115 (~%0.4) | ✅ Çok İyi |
| EN     | 28,385    | 115 (~%0.4) | ✅ Çok İyi |
| SR     | 27,971    | 543 (~%1.9) | ⚠️ İyileştirilebilir |

### SEO Coverage

| Kriter | Kapsam | Durum |
|--------|--------|-------|
| Metadata var | %28 (14/50) | ⚠️ Düşük |
| Hreflang var | %80 (40/50) | ✅ İyi |
| Canonical var | %82 (41/50) | ✅ İyi |

**Not:** Metadata düşük görünse de, eksik olanlar çoğunlukla private sayfalar (admin, dashboard, auth). Public sayfaların %90+ metadata'ya sahip olması bekleniyor.

---

## ✅ Sonraki Adımlar

1. ✅ i18n ve SEO raporları oluşturuldu
2. ⏳ Gerçek eksik i18n anahtarlarını ekle
3. ⏳ SR locale'deki 428 eksik anahtarı tamamla
4. ⏳ Dinamik kart sayfalarına generateMetadata ekle
5. ⏳ Layout'lara metadata ekle
6. ⏳ Private sayfalara noindex robots metadata ekle

---

**Rapor Sonu**

