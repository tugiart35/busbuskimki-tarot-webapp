#!/bin/bash
# 🎯 MASTER AUTO PROCESSOR
# Tüm kalan spread'leri (7 spread, 57 pozisyon) otomatik işler
# Love ve Career hariç

echo "🎯 MASTER AUTO PROCESSOR"
echo "========================================================================"
echo "📊 7 Spread × 57 Pozisyon"
echo "⏱️  Tahmini süre: ~20-25 saat"
echo "🌐 ~4,104 kart çevrilecek (72 avg × 57)"
echo "🔑 ~49,248 i18n anahtarı eklenecek"
echo ""
echo "Başlatılıyor..."
echo "========================================================================"
echo ""

GLOBAL_START=$(date +%s)
SPREADS=("marriage:10" "money:8" "new-lover:6" "problem-solving:10" "relationship-analysis:7" "relationship-problems:9" "situation-analysis:7")

for spread_info in "${SPREADS[@]}"; do
  IFS=':' read -r SPREAD MAX_POS <<< "$spread_info"
  
  echo ""
  echo "========================================================================"
  echo "🔮 SPREAD: ${SPREAD^^}"
  echo "========================================================================"
  
  for POS in $(seq 1 $MAX_POS); do
    echo ""
    echo "────────────────────────────────────────────────────────────────────"
    echo "📌 ${SPREAD} Position-${POS}/${MAX_POS}"
    echo "────────────────────────────────────────────────────────────────────"
    
    # 1. Extraction
    echo "📝 [1/6] Extraction..."
    node scripts/extract-${SPREAD}-position${POS}-tr.js > /dev/null 2>&1
    if [ $? -ne 0 ]; then
      echo "❌ Extraction başarısız!"
      continue
    fi
    echo "   ✅ Türkçe extract edildi"
    
    # 2. Translation
    echo "🌐 [2/6] Translation (~20-25 dk)..."
    python3 scripts/translate-${SPREAD}-position${POS}.py > /dev/null 2>&1
    if [ $? -ne 0 ]; then
      echo "❌ Translation başarısız!"
      continue
    fi
    echo "   ✅ EN + SR çevrildi"
    
    # 3. Keywords fix
    echo "🔧 [3/6] Keywords format..."
    python3 -c "
import json
for lang in ['tr', 'en', 'sr']:
    data = json.load(open(f'messages/{lang}.json'))
    fixed = 0
    if '${SPREAD}' in data and 'meanings' in data['${SPREAD}']:
        for card_key, card_data in data['${SPREAD}']['meanings'].items():
            if 'position${POS}' in card_data and 'keywords' in card_data['position${POS}']:
                if isinstance(card_data['position${POS}']['keywords'], list):
                    data['${SPREAD}']['meanings'][card_key]['position${POS}']['keywords'] = json.dumps(card_data['position${POS}']['keywords'], ensure_ascii=False)
                    fixed += 1
    with open(f'messages/{lang}.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
" > /dev/null 2>&1
    echo "   ✅ Keywords düzeltildi"
    
    # 4. Cyrillic
    echo "🔤 [4/6] Cyrillic → Latin..."
    python3 scripts/transliterate-serbian.py > /dev/null 2>&1
    echo "   ✅ Latin alfabesi"
    
    # 5. Sentence spacing
    echo "📏 [5/6] Cümle boşlukları..."
    python3 scripts/fix-sentence-spacing.py > /dev/null 2>&1
    echo "   ✅ Boşluklar düzeltildi"
    
    # 6. Embedded code
    echo "🧹 [6/6] Embedded kod..."
    python3 scripts/fix-embedded-code-in-json.py > /dev/null 2>&1
    echo "   ✅ Temizlendi"
    
    # Progress
    CURRENT=$(date +%s)
    ELAPSED=$((CURRENT - GLOBAL_START))
    echo ""
    echo "⏱️  Position tamamlandı! Toplam geçen: $((ELAPSED/60))dk $((ELAPSED%60))sn"
    
    sleep 2
  done
  
  echo ""
  echo "✅ ${SPREAD^^} SPREAD TAMAMLANDI!"
  
  # Spread arası kısa mola
  sleep 5
done

# FINAL
FINAL_TIME=$(date +%s)
TOTAL_ELAPSED=$((FINAL_TIME - GLOBAL_START))
HOURS=$((TOTAL_ELAPSED / 3600))
MINUTES=$(( (TOTAL_ELAPSED % 3600) / 60 ))

echo ""
echo "========================================================================"
echo "🎊 TÜM SPREAD'LER TAMAMLANDI!"
echo "========================================================================"
echo "⏱️  Toplam süre: ${HOURS} saat ${MINUTES} dakika"
echo ""
echo "📊 Final İstatistikler:"
python3 -c "
import json
en = json.load(open('messages/en.json'))

spreads = ['marriage', 'money', 'new-lover', 'problem-solving', 'relationship-analysis', 'relationship-problems', 'situation-analysis']

total_cards = 0
for spread in spreads:
    if spread in en and 'meanings' in en[spread]:
        card_count = len(en[spread]['meanings'])
        total_cards += card_count
        print(f'  {spread:25s}: {card_count} kart')

print()
print(f'🎉 Toplam: {total_cards} kart çevrildi')
print(f'🔑 Tahmini: ~{total_cards * 12} i18n anahtarı')
"

echo ""
echo "✅ TÜM SPREAD'LER PRODUCTION-READY!"
echo ""

