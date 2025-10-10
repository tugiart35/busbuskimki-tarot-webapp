#!/usr/bin/env python3
"""
🚀 GROQ AI ile Love Spread Position-1 Çevirisi
- Sadece SR (Sırpça Latin) çevirisi (EN zaten var)
- Rate limit güvenli (5sn delay)
- Otomatik Latin alfabesi
- Progress bar + ETA
"""

import json
import time
import sys
import os
import fcntl
from datetime import datetime
import requests

# ═══════════════════════════════════════════════════════════
SPREAD_KEY = 'love'
POSITION_NUM = 1
# ═══════════════════════════════════════════════════════════

# Groq API Configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY') or "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"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

LOCK_FILE = f'/tmp/tarot-i18n-{SPREAD_KEY}-pos{POSITION_NUM}.lock'
BATCH_SIZE = 1  # Tek tek çeviri (rate limit güvenli)
RETRY_MAX = 3
RETRY_DELAY = 60  # Rate limit hatası alınca 60sn bekle
REQUEST_DELAY = 5  # Her istek arasında 5sn bekle

# Cyrillic → Latin mapping
CYRILLIC_TO_LATIN = {
    'А': 'A', 'Б': 'B', 'В': 'V', 'Г': 'G', 'Д': 'D',
    'Ђ': 'Đ', 'Е': 'E', 'Ж': 'Ž', 'З': 'Z', 'И': 'I',
    'Ј': 'J', 'К': 'K', 'Л': 'L', 'Љ': 'Lj', 'М': 'M',
    'Н': 'N', 'Њ': 'Nj', 'О': 'O', 'П': 'P', 'Р': 'R',
    'С': 'S', 'Т': 'T', 'Ћ': 'Ć', 'У': 'U', 'Ф': 'F',
    'Х': 'H', 'Ц': 'C', 'Ч': 'Č', 'Џ': 'Dž', 'Ш': 'Š',
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
    'ђ': 'đ', 'е': 'e', 'ж': 'ž', 'з': 'z', 'и': 'i',
    'ј': 'j', 'к': 'k', 'л': 'l', 'љ': 'lj', 'м': 'm',
    'н': 'n', 'њ': 'nj', 'о': 'o', 'п': 'p', 'р': 'r',
    'с': 's', 'т': 't', 'ћ': 'ć', 'у': 'u', 'ф': 'f',
    'х': 'h', 'ц': 'c', 'ч': 'č', 'џ': 'dž', 'ш': 'š',
}

def transliterate_to_latin(text):
    """Cyrillic → Latin"""
    if not text:
        return text
    result = text
    for cyr, lat in CYRILLIC_TO_LATIN.items():
        result = result.replace(cyr, lat)
    return result

def transliterate_recursive(obj):
    """Recursive Cyrillic → Latin"""
    if isinstance(obj, str):
        return transliterate_to_latin(obj)
    elif isinstance(obj, list):
        return [transliterate_recursive(item) for item in obj]
    elif isinstance(obj, dict):
        return {k: transliterate_recursive(v) for k, v in obj.items()}
    return obj

def translate_with_groq(texts, target_lang='sr', retry_count=0):
    """
    Groq AI ile SEO-friendly çeviri + Retry mekanizması
    texts: dict {"upright": "metin1", "reversed": "metin2", ...}
    target_lang: 'sr' (Serbian Latin)
    """
    
    lang_name = "Serbian Latin"
    alphabet_rule = "\n- CRITICAL: Use ONLY Latin alphabet (ljubav, sreća), NEVER Cyrillic (љубав, срећа)"
    
    # SEO-friendly prompt
    prompt = f"""Translate these Turkish tarot card meanings to {lang_name}.

TRANSLATION RULES:
- Keep the same meaning and depth as Turkish original
- Maintain mystical and spiritual tone
- KEEP THE LENGTH: Translations should be AS LONG or LONGER than Turkish
- SEO-friendly: Use natural, descriptive language
- DO NOT shorten or summarize{alphabet_rule}
- Return ONLY valid JSON, no explanations

Turkish Input:
{json.dumps(texts, ensure_ascii=False, indent=2)}

{lang_name} Output (same JSON structure, same length):"""

    try:
        response = requests.post(
            GROQ_API_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": GROQ_MODEL,
                "messages": [
                    {
                        "role": "system",
                        "content": f"You are an expert tarot translator. Translate Turkish mystical content to {lang_name}. IMPORTANT: Keep translations detailed and long for SEO purposes. Maintain the same depth and length as the Turkish original. Return only valid JSON."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                "temperature": 0.3,
                "max_tokens": 2500
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            translation_text = result['choices'][0]['message']['content']
            
            # JSON extract et
            if '```json' in translation_text:
                translation_text = translation_text.split('```json')[1].split('```')[0].strip()
            elif '```' in translation_text:
                translation_text = translation_text.split('```')[1].split('```')[0].strip()
            
            translated = json.loads(translation_text)
            
            # Key düzeltmeleri
            if 'upward' in translated and 'upright' not in translated:
                translated['upright'] = translated.pop('upward')
            if 'reverse' in translated and 'reversed' not in translated:
                translated['reversed'] = translated.pop('reverse')
            
            # Latin dönüşümü (güvenlik)
            translated = transliterate_recursive(translated)
            
            return translated
        else:
            # Rate limit hatası (429) veya over capacity (503)
            if response.status_code in [429, 503]:
                if retry_count < RETRY_MAX:
                    print(f"\n    ⚠️ Rate limit/Capacity hatası! {RETRY_DELAY}sn bekleniyor...")
                    time.sleep(RETRY_DELAY)
                    print(f"    🔄 Tekrar deneniyor ({retry_count + 1}/{RETRY_MAX})...")
                    return translate_with_groq(texts, target_lang, retry_count + 1)
                else:
                    print(f"\n    ❌ Max retry aşıldı ({RETRY_MAX})")
                    return None
            else:
                error_detail = response.text if response.text else "No details"
                print(f"\n    ❌ Groq API hatası: {response.status_code}")
                print(f"    Detay: {error_detail[:200]}")
                return None
            
    except Exception as e:
        print(f"\n    ❌ Çeviri hatası: {e}")
        if retry_count < RETRY_MAX:
            time.sleep(5)
            return translate_with_groq(texts, target_lang, retry_count + 1)
        return None

def check_if_already_translated(filepath, spread_key, position_num):
    """Zaten çevrilmiş mi kontrol et"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if spread_key not in data or 'meanings' not in data[spread_key]:
            return False, 0
        
        cards = data[spread_key]['meanings']
        pos_key = f'position{position_num}'
        count = sum(1 for c in cards.values() if pos_key in c)
        
        return count == 78, count
    except:
        return False, 0

def main():
    start_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("=" * 80)
    print(f"🚀 GROQ AI - {SPREAD_KEY.upper()} POSITION-{POSITION_NUM} SІРPÇA ÇEVİRİ")
    print("=" * 80)
    print(f"⏰ Başlangıç: {start_time_str}")
    print(f"🔒 Lock: AKTIF")
    print(f"🔄 Duplicate önleme: AKTIF")
    print(f"🔤 Latin alfabesi: OTOMATİK")
    print(f"⚡ Model: {GROQ_MODEL}")
    print(f"⏱️  Request delay: {REQUEST_DELAY} saniye (rate limit önleme)")
    
    # Duplicate kontrolü
    print(f"\n🔍 Duplicate kontrolü...")
    
    sr_exists, sr_count = check_if_already_translated('messages/sr.json', SPREAD_KEY, POSITION_NUM)
    
    if sr_exists:
        print(f"⚠️  Position {POSITION_NUM} zaten çevrilmiş!")
        print(f"   SR: {sr_count}/78 kart ✅")
        print(f"\n✅ Script sonlandırılıyor (duplicate önlendi)")
        sys.exit(0)
    
    # Türkçe dosyayı oku
    print("\n📖 Türkçe dosya okunuyor...")
    with open('messages/tr.json', 'r', encoding='utf-8') as f:
        tr_data = json.load(f)
    
    if SPREAD_KEY not in tr_data or 'meanings' not in tr_data[SPREAD_KEY]:
        print(f"❌ {SPREAD_KEY}.meanings bulunamadı!")
        sys.exit(1)
    
    # Position kartlarını filtrele
    cards_to_translate = {}
    for card_key, card_data in tr_data[SPREAD_KEY]['meanings'].items():
        if f'position{POSITION_NUM}' in card_data:
            cards_to_translate[card_key] = card_data[f'position{POSITION_NUM}']
    
    total_cards = len(cards_to_translate)
    print(f"✅ {total_cards} kart bulundu")
    
    if total_cards == 0:
        print(f"⚠️  Position{POSITION_NUM} verisi bulunamadı!")
        sys.exit(1)
    
    sr_data = {SPREAD_KEY: {"meanings": {}}}
    
    print(f"\n🃏 Groq AI Sırpça çevirileri başlıyor...")
    print(f"⏱️  Tahmini süre: ~{int(total_cards * 0.15)} - {int(total_cards * 0.2)} dakika")
    print("=" * 80)
    print(f"\n{'Kart':<20} {'SR (Latin)':<15} {'Süre':<10} {'ETA'}")
    print("-" * 65)
    
    start_time = time.time()
    
    successful_sr = 0
    failed_cards = []
    
    card_list = list(cards_to_translate.items())
    
    for idx, (card_key, card_data) in enumerate(card_list):
        current = idx + 1
        elapsed = time.time() - start_time
        
        # ETA hesaplama
        if current > 1:
            avg_time = elapsed / current
            remaining_cards = total_cards - current
            remaining_time = avg_time * remaining_cards
            eta = f"{int(remaining_time/60)}:{int(remaining_time%60):02d}"
        else:
            eta = "hesaplanıyor..."
        
        # Çevrilecek veri
        pos_data = card_data
        to_translate = {
            "upright": pos_data.get('upright', ''),
            "reversed": pos_data.get('reversed', ''),
            "keywords": pos_data.get('keywords', []),
            "context": pos_data.get('context', '')
        }
        
        card_start = time.time()
        
        # Sırpça çeviri (Latin)
        sr_translated = translate_with_groq(to_translate, 'sr')
        if sr_translated:
            if card_key not in sr_data[SPREAD_KEY]['meanings']:
                sr_data[SPREAD_KEY]['meanings'][card_key] = {}
            sr_data[SPREAD_KEY]['meanings'][card_key][f'position{POSITION_NUM}'] = sr_translated
            sr_status = "✅ Latin"
            successful_sr += 1
        else:
            sr_status = "❌"
            failed_cards.append(card_key)
        
        card_time = time.time() - card_start
        
        print(f"{card_key:<20} {sr_status:<15} {int(card_time)}s{'':<6} ETA: {eta}")
        
        # Her 10 kartta özet
        if current % 10 == 0:
            elapsed_str = f"{int(elapsed/60)}:{int(elapsed%60):02d}"
            print(f"\n💾 Ara özet [{current}/{total_cards}]:")
            print(f"  ✅ Başarılı SR: {successful_sr}/{current}")
            print(f"  ❌ Başarısız: {len(failed_cards)}")
            print(f"  ⏱️  Geçen: {elapsed_str}, Kalan: {eta}")
            print("-" * 65)
        
        time.sleep(REQUEST_DELAY)  # Rate limit için bekle
    
    # 🔒 FILE LOCK ile güvenli yazma
    print("\n📝 Dosya güvenli şekilde merge ediliyor...")
    print(f"🔒 Lock alınıyor: {LOCK_FILE}")
    
    lock = open(LOCK_FILE, 'w')
    try:
        fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
        print("✅ Lock alındı")
        
        # Sırpça
        try:
            with open('messages/sr.json', 'r', encoding='utf-8') as f:
                existing_sr = json.load(f)
        except FileNotFoundError:
            existing_sr = {}
        
        if SPREAD_KEY not in existing_sr:
            existing_sr[SPREAD_KEY] = {}
        if 'meanings' not in existing_sr[SPREAD_KEY]:
            existing_sr[SPREAD_KEY]['meanings'] = {}
        
        pos_key = f'position{POSITION_NUM}'
        for card_key, card_data in sr_data[SPREAD_KEY]['meanings'].items():
            if card_key not in existing_sr[SPREAD_KEY]['meanings']:
                existing_sr[SPREAD_KEY]['meanings'][card_key] = {}
            
            # Duplicate önleme
            if pos_key in existing_sr[SPREAD_KEY]['meanings'][card_key]:
                print(f"  ⚠️ SR {card_key} position{POSITION_NUM} zaten var, atlanıyor")
            else:
                existing_sr[SPREAD_KEY]['meanings'][card_key][pos_key] = card_data[pos_key]
        
        # Kaydet
        print("\n💾 Dosya kaydediliyor...")
        with open('messages/sr.json', 'w', encoding='utf-8') as f:
            json.dump(existing_sr, f, ensure_ascii=False, indent=2)
        print("  ✅ messages/sr.json (Latin ✓)")
        
    finally:
        fcntl.flock(lock.fileno(), fcntl.LOCK_UN)
        lock.close()
        if os.path.exists(LOCK_FILE):
            os.remove(LOCK_FILE)
        print("🔓 Lock serbest bırakıldı")
    
    total_time = time.time() - start_time
    end_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    print("\n" + "=" * 80)
    print("✅ GROQ AI ÇEVİRİLERİ TAMAMLANDI!")
    print("=" * 80)
    print(f"⏰ Başlangıç: {start_time_str}")
    print(f"⏰ Bitiş:     {end_time_str}")
    print(f"⏱️  Toplam süre: {int(total_time/60)} dakika {int(total_time%60)} saniye")
    print(f"\n📊 SONUÇLAR:")
    print(f"  ✅ Başarılı SR: {successful_sr}/{total_cards} ({int(successful_sr/total_cards*100) if total_cards > 0 else 0}%)")
    print(f"  ❌ Başarısız: {len(failed_cards)}")
    if failed_cards:
        print(f"\n  Başarısız kartlar: {', '.join(failed_cards[:10])}")
        if len(failed_cards) > 10:
            print(f"  ... ve {len(failed_cards) - 10} kart daha")
    print(f"\n⚡ Performans:")
    print(f"  Ortalama: {total_time/total_cards:.1f} sn/kart")
    print(f"\n📁 Dosya:")
    print(f"  - messages/sr.json ({successful_sr} kart, Latin ✓)")
    print("=" * 80)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Kullanıcı tarafından durduruldu!")
        if os.path.exists(LOCK_FILE):
            os.remove(LOCK_FILE)
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Hata: {e}")
        if os.path.exists(LOCK_FILE):
            os.remove(LOCK_FILE)
        import traceback
        traceback.print_exc()
        sys.exit(1)

