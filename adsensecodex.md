# AdSenseCodex: Sıfırdan Finale Yol Haritası

Bu doküman, AdSense politikalarından “düşük değere sahip içerik” uyarısı alan bir sitenin baştan sona nasıl iyileştirileceğini adım adım anlatır. Her faz, yapılacak işlerin sırasını, sorumluları ve teslim çıktılarıyla birlikte listelenmiştir.

---

## Faz 0 – Hazırlık ve İhlal Analizi
- **AdSense paneli incelemesi**: “İlkelere uymayan siteler” bölümünden tüm örnek URL’leri ve hata mesajlarını çıkar.
- **Mevcut raporların toplanması**: `ADSENSE_ACTION_PLAN.md`, `tarot-card-main.json`, Search Console ve Analytics verilerini tek klasörde topla.
- **Başlangıç metrikleri**: Toplam sayfa, kelime ortalaması, hemen çıkma oranı, indekslenmiş URL sayısını tabloya dök.
- **Teslim**: `reports/initial-status-YYYYMMDD.md` dosyası ve örnek ekran görüntüleri.

## Faz 1 – İçerik Envanteri ve Önceliklendirme
- **Site haritası çıkar**: XML sitemap + gerçek URL taraması (Screaming Frog / site: araması).
- **Kritiklik puanı ver**: Her URL için kelime sayısı, özgünlük, görsel sayısı, UX sorunları sütunlarını içeren bir envanter tablosu oluştur.
- **Öncelik matrisi**: Trafiği yüksek ama kalitesi düşük sayfalar ilk sırada olacak şekilde “A/B/C” listesi.
- **Teslim**: `data/content-inventory.csv` ve `docs/prioritization-matrix.md`.

## Faz 2 – İçerik Stratejisi ve Standartları
- **Editoryal rehber**: Minimum 500 kelime, net H1/H2 yapısı, kartlara özel alt başlıklar, CTA ve FAQ şablonlarını tanımla.
- **Dil/ton yönergeleri**: Türkçe lokalizasyon, kopya metinlerden kaçınma, psikolojik yorum formatı.
- **Ekip brief’i**: İçerik ekibi için görev kartları (Asana/Trello) ve teslim tarihleri.
- **Teslim**: `docs/content-style-guide.md` ve görev kartı listesi.

## Faz 3 – İçerik Üretimi ve Revizyonu
- **Pilot kart seti**: Önce 5 kart seç, yeni şablona göre tamamen yeniden yaz.
- **Geri bildirim döngüsü**: Editör kontrolü → SEO kontrolü → yayına alma.
- **Toplu üretim**: Her sprint 10–15 kart; ilerleme `tarot-card-main.json` içine “status” alanıyla işlenir.
- **Teslim**: Güncellenmiş kart sayfaları, özgünlük raporu (Copyscape / GPT detektör), görsel lisans notları.

## Faz 4 – UX ve Navigasyon İyileştirmeleri
- **Bilgi mimarisi**: Menü, kategori, breadcrumb yapısını gözden geçir.
- **İç linkleme planı**: Kartlar arası öneriler, blog → kart yönlendirmeleri, anahtar kelime anchor’ları.
- **Mobil deneyim**: CLS, metin okunabilirliği, buton boyutları; Lighthouse mobil skorunu referans al.
- **Teslim**: Güncellenmiş menü/kategori yapı dosyaları, Lighthouse raporu.

## Faz 5 – Teknik Temizlik ve SEO Sağlaması
- **Thin content yönetimi**: Yetersiz sayfaları ya zenginleştir ya da `noindex`.
- **Schema markup**: Article, Breadcrumb, FAQ gibi şemaları `src/` içindeki bileşenlere uygula; Rich Results testinden geçir.
- **Hata taraması**: Kırık link, 404, yönlendirme zincirleri ve resim boyutları için otomasyon (Scripts klasöründe rapor).
- **Teslim**: Teknik rapor, schema validasyon sonuçları, düzeltme pull request listesi.

## Faz 6 – Güven Sinyalleri ve Politikalar
- **Yasal sayfalar**: `Hakkımızda`, `İletişim`, `Gizlilik Politikası`, `Kullanım Koşulları`, `Çerez Politikası` güncelle.
- **Footer ve header**: İletişim bilgileri, sosyal medya, telif yılı.
- **E-A-T öğeleri**: Yazar biyografileri, kaynak linkleri, profesyonel referanslar.
- **Teslim**: Güncel yasal sayfa dosyaları ve yeni yazar kartları.

## Faz 7 – Performans ve Core Web Vitals
- **Hız optimizasyonu**: Görsel sıkıştırma, lazy-load, kritik CSS; `CORE_WEB_VITALS_OPTIMIZATION.md` ile hizalı.
- **Test otomasyonu**: Lighthouse CI veya PageSpeed batch raporu.
- **Mobil-first doğrulama**: Search Console “Mobil Kullanılabilirlik” testleri.
- **Teslim**: Öncesi/sonrası metrik tablosu ve rapor ekran görüntüleri.

## Faz 8 – Reklam Yerleşimi Hazırlığı
- **Mock yerleşimler**: Reklam bloklarını (üst, içerik içi, sidebar) maket üzerinde test et; kullanıcı deneyimi bozmasın.
- **Politika uyumu**: Reklamları tıklamaya teşvik eden ifadeler, pop-up’lar, otomatik oynatılan medya kaldır.
- **AdSense kodu**: Yeniden başvuru öncesi `ads.txt` doğrula, otomatik yerleşimleri kapatıp manuel test et.
- **Teslim**: Yerleşim dokümanı ve test ekran görüntüleri.

## Faz 9 – Nihai Kalite Güvencesi ve Belgeleme
- **Checklist turu**: `SEO_CHECKLIST.md`, bu doküman ve AdSense rehberi maddelerini tek tek işaretle.
- **Rastgele kullanıcı testi**: 5–10 sayfayı kullanıcı gözüyle incele; ekran kaydı veya not al.
- **Değişiklik günlüğü**: Tarih, yapılan iş, sorumlu kişiyi içeren log (`logs/adsense-readiness.md`).
- **Teslim**: QA raporu ve kontrol listeleri.

## Faz 10 – Yeniden Başvuru ve Takip
- **Başvuru öncesi kontrol**: 48 saat organik trafik izlenimi, hata bulunmadığının teyidi.
- **AdSense yeniden inceleme formu**: Yapılan tüm geliştirmeleri, tarihleri ve süreci açıklayan kısa özet.
- **Takip süreci**: Günlük panel kontrolü, Google’dan gelen e-postaları arşivle, gerekiyorsa ek kanıt hazırla.
- **Teslim**: Başvuru formu metni, panel ekranı ve onay sonrası yapılacak reklam optimizasyon planı.

---

## Zaman Çizelgesi (Öneri)
| Faz | Süre | Sorumlu |
|-----|------|---------|
| 0–1 | 3 gün | SEO Lead |
| 2–3 | 2 hafta | İçerik Ekibi + Editör |
| 4–6 | 1 hafta | UX/Frontend + Hukuk |
| 7–8 | 4 gün | Teknik SEO + Monetization |
| 9–10 | 3 gün | Proje Yöneticisi + SEO Lead |

---

## Kontrol Listesi Özeti
- [ ] AdSense panel logları toplandı
- [ ] İçerik envanteri ve öncelik matrisi hazır
- [ ] Editoryal rehber ve üretim akışı onaylandı
- [ ] Pilot içerikler yayınlandı ve ölçüldü
- [ ] UX/teknik sorunlar çözüldü, schema validasyonu yapıldı
- [ ] Güven sinyalleri ve yasal sayfalar güncellendi
- [ ] Core Web Vitals hedef değerleri yakalandı
- [ ] Reklam yerleşim planı politikaya uygun
- [ ] QA ve checklist süreçleri kapandı
- [ ] Yeniden başvuru formu gönderildi ve takip planı oluşturuldu

Bu plan sırasıyla uygulandığında, site “düşük değere sahip içerik” sorununu giderecek ve AdSense onayı için gereken kalite standardına ulaşacaktır.
