#!/usr/bin/env python3
"""
🚀 HYBRID ÇEVIRICI - Love Spread Position-1
- Groq API (hızlı, öncelikli)
- Google Translate (fallback)
- Rate limit hatası → Google'a geç, 20dk sonra Groq'u tekrar dene
- Duplicate önleme (EN + SR JSON kontrol)
- Canlı progress bar
- SEO-friendly çeviriler
"""

import json
import time
import sys
import os
import fcntl
from datetime import datetime, timedelta
import requests
from googletrans import Translator

# ═══════════════════════════════════════════════════════════
SPREAD_KEY = 'love'
POSITION_NUM = 1
# ═══════════════════════════════════════════════════════════

# Groq API Configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY') or "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"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

LOCK_FILE = f'/tmp/tarot-i18n-{SPREAD_KEY}-pos{POSITION_NUM}.lock'
REQUEST_DELAY_GROQ = 2  # Groq için 2sn bekle
REQUEST_DELAY_GOOGLE = 0.5  # Google için 0.5sn bekle
GROQ_RETRY_AFTER = 1200  # 20 dakika (1200 saniye) sonra tekrar Groq dene

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

# Global state
google_translator = None
groq_blocked_until = None  # Groq ne zaman tekrar denenecek
stats = {
    'groq_success': 0,
    'groq_failed': 0,
    'google_success': 0,
    'google_failed': 0
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

def print_progress_bar(current, total, prefix='', status='', bar_length=40):
    """Canlı progress bar"""
    percent = 100 * (current / float(total))
    filled = int(bar_length * current // total)
    bar = '█' * filled + '░' * (bar_length - filled)
    print(f'\r{prefix} |{bar}| {percent:.1f}% {status}', end='', flush=True)
    if current == total:
        print()

def translate_with_groq(texts, target_lang='sr'):
    """Groq AI ile çeviri"""
    global groq_blocked_until, stats
    
    # Groq bloke mu kontrol et
    if groq_blocked_until and datetime.now() < groq_blocked_until:
        remaining = (groq_blocked_until - datetime.now()).total_seconds()
        return None, f"Groq blokeli ({int(remaining/60)}dk kaldı)"
    
    lang_name = "English" if target_lang == 'en' else "Serbian Latin"
    alphabet_rule = "" if target_lang == 'en' else "\n- CRITICAL: Use ONLY Latin alphabet (ljubav, sreća), NEVER Cyrillic (љубав, срећа)"
    
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
                        "content": f"You are an expert tarot translator. Translate Turkish mystical content to {lang_name}. IMPORTANT: Keep translations detailed and long for SEO purposes. Return only valid JSON."
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
            
            # JSON extract
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
            
            # Latin dönüşümü
            if target_lang == 'sr':
                translated = transliterate_recursive(translated)
            
            stats['groq_success'] += 1
            return translated, "Groq ✓"
            
        elif response.status_code in [429, 503]:
            # Rate limit - Groq'u 20 dakika blokla
            groq_blocked_until = datetime.now() + timedelta(seconds=GROQ_RETRY_AFTER)
            stats['groq_failed'] += 1
            return None, f"Groq rate limit (20dk bloke)"
        else:
            stats['groq_failed'] += 1
            return None, f"Groq hata {response.status_code}"
            
    except Exception as e:
        stats['groq_failed'] += 1
        return None, f"Groq exception: {str(e)[:50]}"

def translate_with_google(texts, target_lang='sr'):
    """Google Translate ile çeviri (fallback)"""
    global google_translator, stats
    
    if google_translator is None:
        google_translator = Translator()
    
    try:
        result = {}
        
        # Her field'ı ayrı çevir
        for key, value in texts.items():
            if isinstance(value, str) and value:
                translated = google_translator.translate(value, dest=target_lang, src='tr')
                result[key] = translated.text
                time.sleep(0.2)  # Rate limit
            elif isinstance(value, list):
                # Keywords array
                translated_list = []
                for item in value:
                    trans = google_translator.translate(item, dest=target_lang, src='tr')
                    translated_list.append(trans.text)
                    time.sleep(0.2)
                result[key] = translated_list
            else:
                result[key] = value
        
        # Latin dönüşümü
        if target_lang == 'sr':
            result = transliterate_recursive(result)
        
        stats['google_success'] += 1
        return result, "Google ✓"
        
    except Exception as e:
        stats['google_failed'] += 1
        return None, f"Google hata: {str(e)[:50]}"

def translate_hybrid(texts, target_lang='sr'):
    """
    Hybrid çeviri:
    1. Önce Groq dene
    2. Başarısız olursa Google kullan
    3. 20dk sonra tekrar Groq dene
    """
    # Önce Groq dene
    result, status = translate_with_groq(texts, target_lang)
    if result:
        return result, status
    
    # Groq başarısız, Google'a geç
    result, status = translate_with_google(texts, target_lang)
    if result:
        return result, f"{status} (Groq fallback)"
    
    # Her ikisi de başarısız
    return None, "Tüm metodlar başarısız"

def is_already_translated(existing_data, spread_key, position_num, card_key):
    """Kart zaten çevrilmiş mi kontrol et"""
    try:
        if spread_key not in existing_data:
            return False
        if 'meanings' not in existing_data[spread_key]:
            return False
        if card_key not in existing_data[spread_key]['meanings']:
            return False
        
        pos_key = f'position{position_num}'
        return pos_key in existing_data[spread_key]['meanings'][card_key]
    except:
        return False

def main():
    start_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("=" * 80)
    print(f"🚀 HYBRID ÇEVIRICI - {SPREAD_KEY.upper()} POSITION-{POSITION_NUM}")
    print("=" * 80)
    print(f"⏰ Başlangıç: {start_time_str}")
    print(f"🎯 Strateji: Groq (hızlı) → Google (fallback) → 20dk sonra tekrar Groq")
    print(f"🔒 Lock: AKTIF")
    print(f"🔄 Duplicate önleme: AKTIF (EN + SR JSON kontrol)")
    print(f"🔤 Latin alfabesi: OTOMATİK")
    
    # Türkçe dosyayı oku
    print("\n📖 Türkçe dosya okunuyor...")
    with open('messages/tr.json', 'r', encoding='utf-8') as f:
        tr_data = json.load(f)
    
    if SPREAD_KEY not in tr_data or 'meanings' not in tr_data[SPREAD_KEY]:
        print(f"❌ {SPREAD_KEY}.meanings bulunamadı!")
        sys.exit(1)
    
    # Mevcut çevirileri oku
    print("📖 Mevcut çeviriler kontrol ediliyor...")
    try:
        with open('messages/en.json', 'r', encoding='utf-8') as f:
            existing_en = json.load(f)
    except FileNotFoundError:
        existing_en = {}
    
    try:
        with open('messages/sr.json', 'r', encoding='utf-8') as f:
            existing_sr = json.load(f)
    except FileNotFoundError:
        existing_sr = {}
    
    # Position kartlarını filtrele (sadece çevrilmemiş olanlar)
    cards_to_translate = []
    skipped_count = 0
    
    for card_key, card_data in tr_data[SPREAD_KEY]['meanings'].items():
        if f'position{POSITION_NUM}' in card_data:
            # EN veya SR'de zaten var mı kontrol et
            en_exists = is_already_translated(existing_en, SPREAD_KEY, POSITION_NUM, card_key)
            sr_exists = is_already_translated(existing_sr, SPREAD_KEY, POSITION_NUM, card_key)
            
            if not sr_exists:  # SR yoksa çevir (EN zaten var diyorsun)
                cards_to_translate.append((card_key, card_data[f'position{POSITION_NUM}']))
            else:
                skipped_count += 1
    
    total_cards = len(cards_to_translate)
    print(f"✅ Çevrilecek: {total_cards} kart")
    print(f"⏭️  Atlandı (zaten çevrilmiş): {skipped_count} kart")
    
    if total_cards == 0:
        print(f"\n✅ Tüm kartlar zaten çevrilmiş!")
        sys.exit(0)
    
    sr_data = {SPREAD_KEY: {"meanings": {}}}
    
    print(f"\n🃏 Hybrid çeviriler başlıyor...")
    print(f"⏱️  Tahmini süre: ~{int(total_cards * 0.08)} - {int(total_cards * 0.15)} dakika")
    print("=" * 80)
    
    start_time = time.time()
    successful_sr = 0
    failed_cards = []
    
    for idx, (card_key, card_data) in enumerate(cards_to_translate):
        current = idx + 1
        elapsed = time.time() - start_time
        
        # ETA hesaplama
        if current > 1:
            avg_time = elapsed / current
            remaining_cards = total_cards - current
            remaining_time = avg_time * remaining_cards
            eta_str = f"ETA: {int(remaining_time/60)}:{int(remaining_time%60):02d}"
        else:
            eta_str = "ETA: hesaplanıyor..."
        
        # Çevrilecek veri
        to_translate = {
            "upright": card_data.get('upright', ''),
            "reversed": card_data.get('reversed', ''),
            "keywords": card_data.get('keywords', []),
            "context": card_data.get('context', '')
        }
        
        # Progress bar
        status = f"{card_key[:15]:<15} "
        print_progress_bar(current, total_cards, prefix=f'[{current}/{total_cards}]', status=status)
        
        # Sırpça çeviri (Hybrid)
        sr_translated, method = translate_hybrid(to_translate, 'sr')
        
        if sr_translated:
            if card_key not in sr_data[SPREAD_KEY]['meanings']:
                sr_data[SPREAD_KEY]['meanings'][card_key] = {}
            sr_data[SPREAD_KEY]['meanings'][card_key][f'position{POSITION_NUM}'] = sr_translated
            successful_sr += 1
            print(f" → {method} {eta_str}")
        else:
            failed_cards.append(card_key)
            print(f" → ❌ {method} {eta_str}")
        
        # Her 10 kartta özet
        if current % 10 == 0:
            elapsed_str = f"{int(elapsed/60)}:{int(elapsed%60):02d}"
            print(f"\n💾 Ara özet [{current}/{total_cards}]:")
            print(f"  ✅ Başarılı: {successful_sr}/{current}")
            print(f"  ⚡ Groq: {stats['groq_success']} başarı, {stats['groq_failed']} hata")
            print(f"  🌐 Google: {stats['google_success']} başarı, {stats['google_failed']} hata")
            print(f"  ❌ Başarısız: {len(failed_cards)}")
            print(f"  ⏱️  Geçen: {elapsed_str}")
            print()
        
        # Rate limit yönetimi
        if method.startswith("Groq"):
            time.sleep(REQUEST_DELAY_GROQ)
        else:
            time.sleep(REQUEST_DELAY_GOOGLE)
    
    # 🔒 FILE LOCK ile güvenli yazma
    print("\n📝 Dosya güvenli şekilde merge ediliyor...")
    
    lock = open(LOCK_FILE, 'w')
    try:
        fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
        
        # Sırpça merge
        if SPREAD_KEY not in existing_sr:
            existing_sr[SPREAD_KEY] = {}
        if 'meanings' not in existing_sr[SPREAD_KEY]:
            existing_sr[SPREAD_KEY]['meanings'] = {}
        
        pos_key = f'position{POSITION_NUM}'
        for card_key, card_data in sr_data[SPREAD_KEY]['meanings'].items():
            if card_key not in existing_sr[SPREAD_KEY]['meanings']:
                existing_sr[SPREAD_KEY]['meanings'][card_key] = {}
            
            # Son kontrol - duplicate önleme
            if pos_key not in existing_sr[SPREAD_KEY]['meanings'][card_key]:
                existing_sr[SPREAD_KEY]['meanings'][card_key][pos_key] = card_data[pos_key]
        
        # Kaydet
        with open('messages/sr.json', 'w', encoding='utf-8') as f:
            json.dump(existing_sr, f, ensure_ascii=False, indent=2)
        
    finally:
        fcntl.flock(lock.fileno(), fcntl.LOCK_UN)
        lock.close()
        if os.path.exists(LOCK_FILE):
            os.remove(LOCK_FILE)
    
    total_time = time.time() - start_time
    end_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    print("\n" + "=" * 80)
    print("✅ HYBRID ÇEVİRİLER TAMAMLANDI!")
    print("=" * 80)
    print(f"⏰ Başlangıç: {start_time_str}")
    print(f"⏰ Bitiş:     {end_time_str}")
    print(f"⏱️  Toplam süre: {int(total_time/60)} dakika {int(total_time%60)} saniye")
    print(f"\n📊 SONUÇLAR:")
    print(f"  ✅ Başarılı SR: {successful_sr}/{total_cards} ({int(successful_sr/total_cards*100) if total_cards > 0 else 0}%)")
    print(f"  ❌ Başarısız: {len(failed_cards)}")
    print(f"\n📊 METOD İSTATİSTİKLERİ:")
    print(f"  ⚡ Groq API:")
    print(f"     - Başarı: {stats['groq_success']}")
    print(f"     - Hata: {stats['groq_failed']}")
    print(f"  🌐 Google Translate:")
    print(f"     - Başarı: {stats['google_success']}")
    print(f"     - Hata: {stats['google_failed']}")
    
    if failed_cards:
        print(f"\n⚠️  Başarısız kartlar: {', '.join(failed_cards[:10])}")
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

