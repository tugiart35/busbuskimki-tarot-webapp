#!/bin/bash
# 5 dakikada bir ilerleme raporu

INTERVAL=300  # 5 dakika

while true; do
    clear
    ./scripts/monitor-translation-progress.sh
    
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⏰ Sonraki kontrol: 5 dakika sonra"
    echo "   Durdurmak için: Ctrl+C"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    sleep $INTERVAL
done
