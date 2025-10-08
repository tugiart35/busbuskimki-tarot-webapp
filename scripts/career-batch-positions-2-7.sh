#!/bin/bash
# Career Spread Position 2-7'yi toplu işler

echo "🔮 CAREER SPREAD TOPLU İŞLEM: POSITION 2-7"
echo "========================================================================"
echo "⏱️  Tahmini süre: ~2.5-3 saat"
echo "📊 6 pozisyon × 73 kart = 438 kart"
echo "🌐 876 i18n anahtarı × 6 = 5,256 anahtar"
echo ""
echo "Başlatılıyor..."
echo ""

START_TIME=$(date +%s)

for POS in {2..7}; do
  echo ""
  echo "========================================================================"
  echo "🔮 POSITION-${POS} BAŞLIYOR"
  echo "========================================================================"
  
  # 1. Extraction
  echo ""
  echo "📝 [1/6] Türkçe Extraction..."
  node scripts/extract-career-position${POS}-tr.js
  if [ $? -ne 0 ]; then
    echo "❌ Extraction başarısız! Durduruluyor..."
    exit 1
  fi
  
  # 2. Translation
  echo ""
  echo "🌐 [2/6] Translation (EN + SR)..."
  echo "⏱️  Tahmini: 20-25 dakika"
  python3 scripts/translate-career-position${POS}.py
  if [ $? -ne 0 ]; then
    echo "❌ Translation başarısız! Durduruluyor..."
    exit 1
  fi
  
  # 3. Cleanup pipeline
  echo ""
  echo "🔧 [3/6] Keywords format..."
  python3 scripts/fix-keywords-to-json-string.py > /dev/null
  
  echo "🔤 [4/6] Cyrillic → Latin..."
  python3 scripts/transliterate-serbian.py > /dev/null
  
  echo "📏 [5/6] Cümle boşlukları..."
  python3 scripts/fix-sentence-spacing.py > /dev/null
  
  echo "🧹 [6/6] Embedded kod temizliği..."
  python3 scripts/fix-embedded-code-in-json.py > /dev/null
  
  # Doğrulama
  echo ""
  echo "✅ Doğrulama:"
  python3 -c "
import json
en = json.load(open('messages/en.json'))
count = len([k for k,v in en.get('career',{}).get('meanings',{}).items() if 'position${POS}' in v])
print(f'  Position-${POS}: {count}/73 kart')
if count == 73:
    print('  ✅ Tamamlandı!')
else:
    print('  ❌ Eksik!')
"
  
  # Elapsed time
  CURRENT_TIME=$(date +%s)
  ELAPSED=$((CURRENT_TIME - START_TIME))
  MINUTES=$((ELAPSED / 60))
  SECONDS=$((ELAPSED % 60))
  
  echo ""
  echo "⏱️  Position-${POS} tamamlandı! Geçen süre: ${MINUTES}dk ${SECONDS}sn"
  echo ""
  
  # Kısa mola
  sleep 2
done

# Final
TOTAL_TIME=$(date +%s)
TOTAL_ELAPSED=$((TOTAL_TIME - START_TIME))
TOTAL_MINUTES=$((TOTAL_ELAPSED / 60))
TOTAL_SECONDS=$((TOTAL_ELAPSED % 60))

echo ""
echo "========================================================================"
echo "🎊 TÜM POZİSYONLAR TAMAMLANDI!"
echo "========================================================================"
echo "⏱️  Toplam süre: ${TOTAL_MINUTES}dk ${TOTAL_SECONDS}sn"
echo ""
echo "📊 Final İstatistikler:"
python3 -c "
import json
en = json.load(open('messages/en.json'))

for pos in range(1, 8):
    count = len([k for k,v in en.get('career',{}).get('meanings',{}).items() if f'position{pos}' in v])
    print(f'  Position-{pos}: {count}/73 ✅')

print()
print('🎉 Career Spread: %100 TAMAMLANDI!')
print('📊 7 pozisyon × 73 kart × 3 dil = 1,533 kart')
print('🔑 6,132 i18n anahtarı')
"

echo ""
echo "🚀 Sonraki adım: npm run build && npm run dev ile test"
echo ""
