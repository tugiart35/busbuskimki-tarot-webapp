#!/bin/bash

# Ollama Test ve Kurulum Scripti

echo "🔍 Ollama Kontrolü Başlatılıyor..."
echo ""

# Ollama kurulu mu?
if ! command -v ollama &> /dev/null; then
    echo "❌ Ollama kurulu değil!"
    echo ""
    echo "Kurulum için:"
    echo "  macOS: brew install ollama"
    echo "  Linux: curl -fsSL https://ollama.com/install.sh | sh"
    echo "  Windows: https://ollama.com/download"
    exit 1
fi

echo "✅ Ollama kurulu"

# Ollama çalışıyor mu?
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "✅ Ollama servisi çalışıyor"
else
    echo "⚠️  Ollama servisi çalışmıyor!"
    echo ""
    echo "Başlatmak için:"
    echo "  ollama serve"
    echo ""
    echo "Yeni bir terminal açıp yukarıdaki komutu çalıştırın."
    exit 1
fi

echo ""
echo "📦 Mevcut Modeller:"
echo ""

ollama list

echo ""
echo "💡 Önerilen Modeller:"
echo ""
echo "  Hızlı ve kaliteli:  ollama pull mistral"
echo "  Çok dilli (TR/EN/SR): ollama pull qwen2.5:7b"
echo "  Klasik:             ollama pull llama2:7b"
echo ""

# Önerilen modeller kurulu mu?
MODELS=$(ollama list)

if echo "$MODELS" | grep -q "mistral"; then
    echo "✅ mistral kurulu"
elif echo "$MODELS" | grep -q "qwen2.5"; then
    echo "✅ qwen2.5 kurulu"
elif echo "$MODELS" | grep -q "llama2"; then
    echo "✅ llama2 kurulu"
else
    echo "⚠️  Önerilen modellerden hiçbiri kurulu değil!"
    echo ""
    echo "Hızlı kurulum için:"
    echo "  ollama pull mistral"
fi

echo ""
echo "🚀 Hazırsınız! İçerik zenginleştirmeyi başlatabilirsiniz."
echo ""
echo "Örnek komut:"
echo "  npx ts-node scripts/content-enhancer-ollama.ts mistral tr data/kartlarfinal.json kartlarfinal-tr-seo-report.json data/test.json 1"
echo ""








