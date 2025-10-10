# 📋 MARRIAGE SPREAD EKSİK ÇEVİRİLER RAPORU

**Tarih:** 2025-10-09  
**Durum:** ❌ ÇEVİRİLER YARIM KALDI

---

## 📊 MEVCUT DURUM

### Position-1 (Sonuç ne olacak?)
- ✅ TR: 78/78 - TAM
- ❌ EN: 0/78 - HİÇ YOK
- ❌ SR: 0/78 - HİÇ YOK

### Position-2 (Eşimi beklerken ne yapmam gerekiyor?)
- ✅ TR: 78/78 - TAM
- ❌ EN: 0/78 - HİÇ YOK
- ❌ SR: 0/78 - HİÇ YOK

### Position-3 (Mali kaynaklarımızı paylaşacak mıyız?)
- ✅ TR: 78/78 - TAM
- ❌ EN: 0/78 - HİÇ YOK
- ❌ SR: 0/78 - HİÇ YOK

### Position-4 (Her ikimiz de bağlanmak isteyecek miyiz?)
- ⚠️ TR: 64/78 - 14 KART EKSİK!
- ❌ EN: 0/78 - HİÇ YOK
- ❌ SR: 0/78 - HİÇ YOK

### Position-5 (Benzer yanlarımız olacak mı?)
- ✅ TR: 78/78 - TAM
- ✅ EN: 78/78 - TAM
- ❌ SR: 0/78 - HİÇ YOK

### Position-6 (Bu kişinin ailesi beni kabul edecek mi?)
- ✅ TR: 78/78 - TAM
- ✅ EN: 78/78 - TAM
- ❌ SR: 0/78 - HİÇ YOK

### Position-7 (Birbirimizi nasıl bulacağız?)
- ✅ TR: 78/78 - TAM
- ✅ EN: 78/78 - TAM
- ✅ SR: 78/78 - TAM

### Position-8 (Anlaşabilecek miyiz?)
- ✅ TR: 78/78 - TAM
- ⚠️ EN: 77/78 - 1 KART EKSİK
- ⚠️ SR: 77/78 - 1 KART EKSİK

### Position-9 (Benim için nasıl bir eş uygundur?)
- ✅ TR: 78/78 - TAM
- ✅ EN: 78/78 - TAM
- ✅ SR: 78/78 - TAM

### Position-10 (Evlenebilecek miyim?)
- ✅ TR: 78/78 - TAM
- ✅ EN: 78/78 - TAM
- ✅ SR: 78/78 - TAM

---

## 🎯 ÖNCELIK SIRASI

### YÜKSEK ÖNCELİK (Position 1-4)
Bu pozisyonlar EN ve SR çevirileri olmadan **ÇALIŞMAZ**:

1. **Position-1**: EN + SR çevirisi gerekiyor (78 kart × 2 dil = 156 çeviri)
2. **Position-2**: EN + SR çevirisi gerekiyor (78 kart × 2 dil = 156 çeviri)
3. **Position-3**: EN + SR çevirisi gerekiyor (78 kart × 2 dil = 156 çeviri)
4. **Position-4**: Önce TR'yi tamamla (14 kart), sonra EN + SR (78 kart × 2 dil = 156 çeviri)

### ORTA ÖNCELİK (Position 5-6)
Sadece SR çevirisi eksik:

5. **Position-5**: SR çevirisi (78 kart)
6. **Position-6**: SR çevirisi (78 kart)

### DÜŞÜK ÖNCELİK (Position 8)
Sadece 1 kart eksik:

7. **Position-8**: Eksik kartı bul ve EN + SR'ye ekle

---

## 🔧 NASIL DÜZELTİLİR?

### Position-1 İçin Adımlar:

```bash
# 1. Çeviri scriptini çalıştır
cd /Users/tugi/Desktop/TaraTarot
python3 scripts/translate-marriage-position1.py

# Beklenen süre: 30-45 dakika
# Output: EN ve SR dosyalarına 78 kart çevirileri eklenecek
```

### Position-2 İçin Adımlar:

```bash
python3 scripts/translate-marriage-position2.py
# Beklenen süre: 30-45 dakika
```

### Position-3 İçin Adımlar:

```bash
python3 scripts/translate-marriage-position3.py
# Beklenen süre: 30-45 dakika
```

### Position-4 İçin Adımlar:

**ÖNCE:** Position-4 dosyasında 14 eksik kartı kontrol et ve ekle
```bash
# Eksik kartları listele
python3 -c "
import json
tr = json.load(open('messages/tr.json'))
all_cards = set([
    'thefool', 'themagician', 'thehighpriestess', 'theempress', 'theemperor',
    'thehierophant', 'thelovers', 'thechariot', 'strength', 'thehermit',
    'wheeloffortune', 'justice', 'thehangedman', 'death', 'temperance',
    'thedevil', 'thetower', 'thestar', 'themoon', 'thesun', 'judgement', 'theworld',
    # Kupalar
    'aceofcups', 'twoofcups', 'threeofcups', 'fourofcups', 'fiveofcups',
    'sixofcups', 'sevenofcups', 'eightofcups', 'nineofcups', 'tenofcups',
    'pageofcups', 'knightofcups', 'queenofcups', 'kingofcups',
    # Kılıçlar
    'aceofswords', 'twoofswords', 'threeofswords', 'fourofswords', 'fiveofswords',
    'sixofswords', 'sevenofswords', 'eightofswords', 'nineofswords', 'tenofswords',
    'pageofswords', 'knightofswords', 'queenofswords', 'kingofswords',
    # Asalar
    'aceofwands', 'twoofwands', 'threeofwands', 'fourofwands', 'fiveofwands',
    'sixofwands', 'sevenofwands', 'eightofwands', 'nineofwands', 'tenofwands',
    'pageofwands', 'knightofwands', 'queenofwands', 'kingofwands',
    # Tılsımlar
    'aceofpentacles', 'twoofpentacles', 'threeofpentacles', 'fourofpentacles', 'fiveofpentacles',
    'sixofpentacles', 'sevenofpentacles', 'eightofpentacles', 'nineofpentacles', 'tenofpentacles',
    'pageofpentacles', 'knightofpentacles', 'queenofpentacles', 'kingofpentacles'
])
existing = set()
for card_key in tr['marriage']['meanings']:
    if 'position4' in tr['marriage']['meanings'][card_key]:
        existing.add(card_key)
missing = all_cards - existing
print(f'Eksik kartlar ({len(missing)}):')
for card in sorted(missing):
    print(f'  - {card}')
"
```

**SONRA:** Çeviri yap
```bash
python3 scripts/translate-marriage-position4.py
```

### Position-5 ve Position-6 için SR Çevirisi:

```bash
python3 scripts/translate-marriage-position5.py
python3 scripts/translate-marriage-position6.py
```

### Position-8 için Eksik Kartı Bul:

```bash
python3 -c "
import json
en = json.load(open('messages/en.json'))
sr = json.load(open('messages/sr.json'))

all_cards = ['thefool', 'themagician', ..., 'kingofpentacles']  # 78 kart

en_cards = set()
sr_cards = set()

for card_key in en['marriage']['meanings']:
    if 'position8' in en['marriage']['meanings'][card_key]:
        en_cards.add(card_key)

for card_key in sr['marriage']['meanings']:
    if 'position8' in sr['marriage']['meanings'][card_key]:
        sr_cards.add(card_key)

print('EN eksik:', set(all_cards) - en_cards)
print('SR eksik:', set(all_cards) - sr_cards)
"
```

---

## ⏱️ TAHMİNİ SÜRE

| Pozisyon | İşlem | Süre |
|----------|-------|------|
| Position-1 | EN + SR çeviri | 30-45 dk |
| Position-2 | EN + SR çeviri | 30-45 dk |
| Position-3 | EN + SR çeviri | 30-45 dk |
| Position-4 | TR tamamla + EN/SR çevir | 60 dk |
| Position-5 | SR çeviri | 15-20 dk |
| Position-6 | SR çeviri | 15-20 dk |
| Position-8 | 1 kart düzelt | 5 dk |
| **TOPLAM** | | **~3-4 saat** |

---

## 📦 SCRIPTLER HAZIR MI?

✅ Mevcut scriptler:
- `translate-marriage-position1.py` - HAZIR
- `translate-marriage-position2.py` - HAZIR
- `translate-marriage-position3.py` - HAZIR
- `translate-marriage-position4.py` - HAZIR
- `translate-marriage-position5.py` - HAZIR
- `translate-marriage-position6.py` - HAZIR

⚠️ Dikkat:
- Position-4 için önce TR'deki 14 eksik kartı tamamlamak gerekiyor
- Position-8 için eksik kartı manuel bulmak ve eklemek gerekiyor

---

## ✅ TAMAMLANMA KRİTERLERİ

Marriage spread i18n entegrasyonu **tamamlanmış sayılır** eğer:

- [ ] Position-1: 78 kart × 3 dil (TR/EN/SR)
- [ ] Position-2: 78 kart × 3 dil (TR/EN/SR)
- [ ] Position-3: 78 kart × 3 dil (TR/EN/SR)
- [ ] Position-4: 78 kart × 3 dil (TR/EN/SR)
- [ ] Position-5: 78 kart × 3 dil (TR/EN/SR)
- [ ] Position-6: 78 kart × 3 dil (TR/EN/SR)
- [ ] Position-7: 78 kart × 3 dil (TR/EN/SR) ✅ TAM
- [ ] Position-8: 78 kart × 3 dil (TR/EN/SR)
- [ ] Position-9: 78 kart × 3 dil (TR/EN/SR) ✅ TAM
- [ ] Position-10: 78 kart × 3 dil (TR/EN/SR) ✅ TAM

**Mevcut tamamlanma:** 3/10 pozisyon (%30)

---

## 🚀 HIZLI BAŞLATMA

Tüm çevirileri sırayla yapmak için:

```bash
cd /Users/tugi/Desktop/TaraTarot

# Position 1-3 çevirileri (paralel çalıştırılabilir)
python3 scripts/translate-marriage-position1.py &
python3 scripts/translate-marriage-position2.py &
python3 scripts/translate-marriage-position3.py &
wait

# Position 4 (önce TR'yi tamamla)
# Manuel: position-4 dosyasına 14 eksik kartı ekle
python3 scripts/translate-marriage-position4.py

# Position 5-6 SR çevirileri
python3 scripts/translate-marriage-position5.py
python3 scripts/translate-marriage-position6.py

# Position 8 eksik kartı düzelt
# Manuel: Eksik kartı bul ve ekle

echo "✅ TÜM ÇEVİRİLER TAMAMLANDI!"
```

---

**Not:** Bu çeviriler Google Translate ücretsiz API ile yapılacak, toplam maliyet $0.

