#!/bin/bash
# Career Spread Position 5-6-7'yi işler

echo "🔮 CAREER SPREAD: POSITION 5-6-7 YENİDEN İŞLENİYOR"
echo "========================================================================"
echo "⏱️  Tahmini süre: ~1.5 saat"
echo ""

START_TIME=$(date +%s)

for POS in 5 6 7; do
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
  echo "⏱️  Başlıyor..."
  python3 scripts/translate-career-position${POS}.py
  if [ $? -ne 0 ]; then
    echo "❌ Translation başarısız! Durduruluyor..."
    exit 1
  fi
  
  # 3. Cleanup pipeline
  echo ""
  echo "🔧 [3/6] Keywords format..."
  python3 -c "
import json
for lang in ['tr', 'en', 'sr']:
    data = json.load(open(f'messages/{lang}.json'))
    fixed = 0
    if 'career' in data and 'meanings' in data['career']:
        for card_key, card_data in data['career']['meanings'].items():
            if 'position${POS}' in card_data and 'keywords' in card_data['position${POS}']:
                if isinstance(card_data['position${POS}']['keywords'], list):
                    data['career']['meanings'][card_key]['position${POS}']['keywords'] = json.dumps(card_data['position${POS}']['keywords'], ensure_ascii=False)
                    fixed += 1
    with open(f'messages/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f'{lang}: {fixed} kart')
"
  
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
"
  
  CURRENT_TIME=$(date +%s)
  ELAPSED=$((CURRENT_TIME - START_TIME))
  MINUTES=$((ELAPSED / 60))
  SECONDS=$((ELAPSED % 60))
  
  echo "⏱️  Position-${POS} tamamlandı! Toplam geçen: ${MINUTES}dk ${SECONDS}sn"
  
  sleep 2
done

# Final
TOTAL_TIME=$(date +%s)
TOTAL_ELAPSED=$((TOTAL_TIME - START_TIME))
TOTAL_MINUTES=$((TOTAL_ELAPSED / 60))
TOTAL_SECONDS=$((TOTAL_ELAPSED % 60))

echo ""
echo "========================================================================"
echo "🎊 POSITION 5-6-7 TAMAMLANDI!"
echo "========================================================================"
echo "⏱️  Toplam süre: ${TOTAL_MINUTES}dk ${TOTAL_SECONDS}sn"
echo ""
echo "📊 Career Spread Durum:"
python3 -c "
import json
en = json.load(open('messages/en.json'))

total = 0
for pos in range(1, 8):
    count = len([k for k,v in en.get('career',{}).get('meanings',{}).items() if f'position{pos}' in v])
    total += count
    print(f'  Position-{pos}: {count}/73 ✅')

print()
print(f'🎉 Toplam: {total}/511 kart')
if total == 511:
    print('✅ Career Spread %100 TAMAMLANDI!')
"

echo ""

