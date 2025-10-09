# ✅ CAREER SPREAD POZİSYON KONTROL LİSTESİ

**Tarih:** 2025-10-08  
**Toplam Pozisyon:** 7  
**Kart/Pozisyon:** 73

---

## 📋 ÇALIŞTIRMA SIRASI

Her pozisyon için bu adımları takip edin:

### 1️⃣ Extraction (~1 dk)
```bash
node scripts/extract-career-position{X}-tr.js
```
✅ Beklenen: "73 kart objesi bulundu"

### 2️⃣ Translation (~20-25 dk) 
```bash
# Background'da çalıştır
nohup python3 scripts/translate-career-position{X}.py > /tmp/career-pos{X}.log 2>&1 &

# İzlemek için
tail -f /tmp/career-pos{X}.log
```
✅ Beklenen: "73/73 kart tamamlandı"

### 3️⃣ Cleanup (~2 dk)
```bash
python3 scripts/fix-keywords-to-json-string.py
python3 scripts/transliterate-serbian.py
python3 scripts/fix-sentence-spacing.py
python3 scripts/fix-embedded-code-in-json.py
```
✅ Beklenen: "Tüm kontroller geçti"

### 4️⃣ Doğrulama
```python
python3 -c "
import json
en = json.load(open('messages/en.json'))
count = len([k for k,v in en.get('career',{}).get('meanings',{}).items() if 'position{X}' in v])
print(f'Position-{X}: {count}/73 kart ✅' if count == 73 else f'Position-{X}: {count}/73 ❌')
"
```

### 5️⃣ Commit
```bash
git add messages/*.json scripts/*career-position{X}*
git commit -m "feat: add career position-{X} i18n"
```

---

## 🗓️ POZİSYON DURUMU

| # | Pozisyon Başlığı | TR | EN | SR | Durum | Süre |
|---|-----------------|----|----|----|----|------|
| 1 | Gerçekten istediğim kariyer bu mu? | 🔄 | 🔄 | 🔄 | **ÇEVİRİLİYOR** | - |
| 2 | Hangi adımlar atabilirim? | ⏳ | ⏳ | ⏳ | Bekliyor | - |
| 3 | Değiştiremediğim taraflar | ⏳ | ⏳ | ⏳ | Bekliyor | - |
| 4 | Elimden gelenin en iyisi mi? | ⏳ | ⏳ | ⏳ | Bekliyor | - |
| 5 | Yardımcı olacak değişiklikler | ⏳ | ⏳ | ⏳ | Bekliyor | - |
| 6 | Geçmişimdeki engeller | ⏳ | ⏳ | ⏳ | Bekliyor | - |
| 7 | Sonuç ne olacak? | ⏳ | ⏳ | ⏳ | Bekliyor | - |

**İlerleme:** %0 (0/7 tamamlandı)  
**Şu an:** Position-1 çeviriliyor (~20 dk kaldı)

---

## 📊 BEKLENEN SONUÇ

### Career Spread Tamamlandığında
- **Pozisyonlar:** 7 ✅
- **Kartlar:** 73 × 7 = 511 kart
- **i18n Anahtarları:** 511 × 4 alan × 3 dil = **6,132 anahtar**
- **Toplam Süre:** ~3 saat
- **Maliyet:** $0

### Tüm Spread'ler (Love + Career)
- **Love:** 3,744 anahtar ✅
- **Career:** 6,132 anahtar (işleniyor)
- **TOPLAM:** ~10,000 anahtar

---

## 🎯 SONRAKİ ADIM

Position-1 çevirisi tamamlanınca:
```bash
# Cleanup
python3 scripts/fix-keywords-to-json-string.py
python3 scripts/transliterate-serbian.py
python3 scripts/fix-sentence-spacing.py
python3 scripts/fix-embedded-code-in-json.py

# Doğrula
python3 -c "import json; en=json.load(open('messages/en.json')); print(f'{len([k for k,v in en.get(\"career\",{}).get(\"meanings\",{}).items() if \"position1\" in v])}/73')"

# Position-2'ye geç
node scripts/extract-career-position2-tr.js
python3 scripts/translate-career-position2.py
```

---

**Güncelleme:** Çeviri devam ediyor...  
**Son Güncelleme:** 2025-10-08 23:53
