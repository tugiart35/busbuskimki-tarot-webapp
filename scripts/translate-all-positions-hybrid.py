#!/usr/bin/env python3
"""
🚀 SMART HYBRID ÇEVIRICI - TÜM SPREAD'LER & TÜM POZISYONLAR
- lib/ klasöründeki tüm spread'leri otomatik tespit et
- TR.json'dan tüm position'ları otomatik bul
- SR.json'da eksik olanları çevir
- Groq API (hızlı) → Google Translate (fallback)
- Rate limit otomatik yönetimi
- Canlı progress tracking
- Duplicate önleme (zaten çevrilmiş atla)
"""

import json
import time
import sys
import os
import fcntl
from datetime import datetime, timedelta
import requests
from googletrans import Translator
import re

# Groq API Configuration
GROQ_API_KEY = os.getenv('GROQ_API_KEY') or "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"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "llama-3.3-70b-versatile"

REQUEST_DELAY_GROQ = 2
REQUEST_DELAY_GOOGLE = 0.5
GROQ_RETRY_AFTER = 1200  # 20 dakika

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
groq_blocked_until = None
stats = {
    'groq_success': 0,
    'groq_failed': 0,
    'google_success': 0,
    'google_failed': 0,
    'total_cards': 0,
    'successful_cards': 0,
    'failed_cards': 0,
    'skipped_cards': 0
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

def print_progress_bar(current, total, prefix='', status='', bar_length=50):
    """Canlı progress bar"""
    if total == 0:
        percent = 0
    else:
        percent = 100 * (current / float(total))
    filled = int(bar_length * current // total) if total > 0 else 0
    bar = '█' * filled + '░' * (bar_length - filled)
    print(f'\r{prefix} |{bar}| {percent:.1f}% {status}', end='', flush=True)
    if current == total:
        print()

def translate_with_groq(texts, target_lang='sr'):
    """Groq AI ile çeviri"""
    global groq_blocked_until, stats
    
    if groq_blocked_until and datetime.now() < groq_blocked_until:
        return None, f"Groq blokeli"
    
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

{lang_name} Output (same JSON structure):"""

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
                    {"role": "system", "content": f"You are an expert tarot translator. Translate Turkish to {lang_name}. Keep translations detailed for SEO. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.3,
                "max_tokens": 2500
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            translation_text = result['choices'][0]['message']['content']
            
            if '```json' in translation_text:
                translation_text = translation_text.split('```json')[1].split('```')[0].strip()
            elif '```' in translation_text:
                translation_text = translation_text.split('```')[1].split('```')[0].strip()
            
            translated = json.loads(translation_text)
            
            if 'upward' in translated and 'upright' not in translated:
                translated['upright'] = translated.pop('upward')
            if 'reverse' in translated and 'reversed' not in translated:
                translated['reversed'] = translated.pop('reverse')
            
            if target_lang == 'sr':
                translated = transliterate_recursive(translated)
            
            stats['groq_success'] += 1
            return translated, "Groq"
            
        elif response.status_code in [429, 503]:
            groq_blocked_until = datetime.now() + timedelta(seconds=GROQ_RETRY_AFTER)
            stats['groq_failed'] += 1
            return None, f"Groq rate limit"
        else:
            stats['groq_failed'] += 1
            return None, f"Groq error"
            
    except Exception as e:
        stats['groq_failed'] += 1
        return None, f"Groq exception"

def translate_with_google(texts, target_lang='sr'):
    """Google Translate ile çeviri"""
    global google_translator, stats
    
    if google_translator is None:
        google_translator = Translator()
    
    try:
        result = {}
        for key, value in texts.items():
            if isinstance(value, str) and value:
                translated = google_translator.translate(value, dest=target_lang, src='tr')
                result[key] = translated.text
                time.sleep(0.2)
            elif isinstance(value, list):
                translated_list = []
                for item in value:
                    trans = google_translator.translate(item, dest=target_lang, src='tr')
                    translated_list.append(trans.text)
                    time.sleep(0.2)
                result[key] = translated_list
            else:
                result[key] = value
        
        if target_lang == 'sr':
            result = transliterate_recursive(result)
        
        stats['google_success'] += 1
        return result, "Google"
        
    except Exception as e:
        stats['google_failed'] += 1
        return None, f"Google error"

def translate_hybrid(texts, target_lang='sr'):
    """Hybrid: Groq önce, başarısız olursa Google"""
    result, status = translate_with_groq(texts, target_lang)
    if result:
        return result, status
    
    result, status = translate_with_google(texts, target_lang)
    if result:
        return result, status
    
    return None, "Failed"

def discover_spreads_and_positions():
    """TR.json'dan tüm spread'leri ve position'ları otomatik bul"""
    print("🔍 Spread'ler ve position'lar tespit ediliyor...")
    
    with open('messages/tr.json', 'r', encoding='utf-8') as f:
        tr_data = json.load(f)
    
    try:
        with open('messages/en.json', 'r', encoding='utf-8') as f:
            en_data = json.load(f)
    except FileNotFoundError:
        en_data = {}
    
    try:
        with open('messages/sr.json', 'r', encoding='utf-8') as f:
            sr_data = json.load(f)
    except FileNotFoundError:
        sr_data = {}
    
    spreads_positions = {}
    
    # TR.json'da meanings içeren tüm spread'leri bul
    for spread_key in tr_data.keys():
        if isinstance(tr_data[spread_key], dict) and 'meanings' in tr_data[spread_key]:
            meanings = tr_data[spread_key]['meanings']
            if not meanings:
                continue
            
            # İlk karttan position'ları öğren
            first_card = list(meanings.values())[0]
            positions = [key for key in first_card.keys() if key.startswith('position')]
            
            if positions:
                # SR'de eksik olan position'ları bul
                missing_positions = []
            for pos in positions:
                # Kaç kart bu position'da?
                tr_count = sum(1 for card in meanings.values() if pos in card)
                
                # EN'de kaç kart var?
                en_count = 0
                if spread_key in en_data and 'meanings' in en_data[spread_key]:
                    en_count = sum(1 for card in en_data[spread_key]['meanings'].values() if pos in card)
                
                # SR'de kaç kart var?
                sr_count = 0
                if spread_key in sr_data and 'meanings' in sr_data[spread_key]:
                    sr_count = sum(1 for card in sr_data[spread_key]['meanings'].values() if pos in card)
                
                if en_count < tr_count or sr_count < tr_count:
                    missing_positions.append({
                        'position': pos,
                        'tr_cards': tr_count,
                        'en_cards': en_count,
                        'sr_cards': sr_count,
                        'missing_en': tr_count - en_count,
                        'missing_sr': tr_count - sr_count
                    })
            
            if missing_positions:
                spreads_positions[spread_key] = {
                    'positions': positions,
                    'missing': missing_positions,
                    'total_cards': len(meanings)
                }
    
    return spreads_positions, tr_data, en_data, sr_data

def translate_spread_position(spread_key, position, tr_data, en_data, sr_data, lock_file):
    """Bir spread'in bir position'ını çevir (EN + SR)"""
    pos_num = int(position.replace('position', ''))
    
    print(f"\n{'='*80}")
    print(f"📍 {spread_key.upper()} - {position.upper()}")
    print(f"{'='*80}")
    
    # Çevrilecek kartları filtrele
    cards_to_translate = []
    
    for card_key, card_data in tr_data[spread_key]['meanings'].items():
        if position in card_data:
            # EN veya SR'de eksik mi kontrol et
            en_exists = False
            sr_exists = False
            
            if spread_key in en_data and 'meanings' in en_data[spread_key]:
                if card_key in en_data[spread_key]['meanings']:
                    if position in en_data[spread_key]['meanings'][card_key]:
                        en_exists = True
            
            if spread_key in sr_data and 'meanings' in sr_data[spread_key]:
                if card_key in sr_data[spread_key]['meanings']:
                    if position in sr_data[spread_key]['meanings'][card_key]:
                        sr_exists = True
            
            if not en_exists or not sr_exists:
                cards_to_translate.append((card_key, card_data[position], en_exists, sr_exists))
            else:
                stats['skipped_cards'] += 1
    
    total = len(cards_to_translate)
    if total == 0:
        print(f"✅ Zaten tamamlanmış (0 eksik kart)")
        return 0
    
    print(f"📦 Çevrilecek: {total} kart")
    
    # Çeviri yap
    en_translated_data = {spread_key: {"meanings": {}}}
    sr_translated_data = {spread_key: {"meanings": {}}}
    successful_en = 0
    successful_sr = 0
    
    for idx, (card_key, card_data, en_exists, sr_exists) in enumerate(cards_to_translate):
        current = idx + 1
        
        to_translate = {
            "upright": card_data.get('upright', ''),
            "reversed": card_data.get('reversed', ''),
            "keywords": card_data.get('keywords', []),
            "context": card_data.get('context', '')
        }
        
        # Progress
        status = f"{card_key[:12]:<12}"
        print_progress_bar(current, total, prefix=f'[{current}/{total}]', status=status)
        
        # EN çevirisi (eğer yoksa)
        en_status = "✓"
        if not en_exists:
            result_en, method_en = translate_hybrid(to_translate, 'en')
            if result_en:
                if card_key not in en_translated_data[spread_key]['meanings']:
                    en_translated_data[spread_key]['meanings'][card_key] = {}
                en_translated_data[spread_key]['meanings'][card_key][position] = result_en
                successful_en += 1
                en_status = f"EN:{method_en}"
            else:
                en_status = "EN:❌"
            
            time.sleep(REQUEST_DELAY_GROQ if method_en == "Groq" else REQUEST_DELAY_GOOGLE)
        
        # SR çevirisi (eğer yoksa)
        sr_status = "✓"
        if not sr_exists:
            result_sr, method_sr = translate_hybrid(to_translate, 'sr')
            if result_sr:
                if card_key not in sr_translated_data[spread_key]['meanings']:
                    sr_translated_data[spread_key]['meanings'][card_key] = {}
                sr_translated_data[spread_key]['meanings'][card_key][position] = result_sr
                successful_sr += 1
                sr_status = f"SR:{method_sr}"
            else:
                sr_status = "SR:❌"
            
            time.sleep(REQUEST_DELAY_GROQ if method_sr == "Groq" else REQUEST_DELAY_GOOGLE)
        
        stats['successful_cards'] += 1 if (not en_exists or successful_en > 0) and (not sr_exists or successful_sr > 0) else 0
        if (en_exists or successful_en > 0) and (sr_exists or successful_sr > 0):
            print(f" → {en_status} {sr_status}")
        else:
            print(f" → ❌ {en_status} {sr_status}")
            stats['failed_cards'] += 1
    
    # Merge ve kaydet
    print(f"\n💾 Dosyalara yazılıyor...")
    
    lock = open(lock_file, 'w')
    try:
        fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
        
        # EN.json'u oku ve merge et
        try:
            with open('messages/en.json', 'r', encoding='utf-8') as f:
                existing_en = json.load(f)
        except FileNotFoundError:
            existing_en = {}
        
        if spread_key not in existing_en:
            existing_en[spread_key] = {}
        if 'meanings' not in existing_en[spread_key]:
            existing_en[spread_key]['meanings'] = {}
        
        for card_key, card_data in en_translated_data[spread_key]['meanings'].items():
            if card_key not in existing_en[spread_key]['meanings']:
                existing_en[spread_key]['meanings'][card_key] = {}
            
            if position not in existing_en[spread_key]['meanings'][card_key]:
                existing_en[spread_key]['meanings'][card_key][position] = card_data[position]
        
        # SR.json'u oku ve merge et
        try:
            with open('messages/sr.json', 'r', encoding='utf-8') as f:
                existing_sr = json.load(f)
        except FileNotFoundError:
            existing_sr = {}
        
        if spread_key not in existing_sr:
            existing_sr[spread_key] = {}
        if 'meanings' not in existing_sr[spread_key]:
            existing_sr[spread_key]['meanings'] = {}
        
        for card_key, card_data in sr_translated_data[spread_key]['meanings'].items():
            if card_key not in existing_sr[spread_key]['meanings']:
                existing_sr[spread_key]['meanings'][card_key] = {}
            
            if position not in existing_sr[spread_key]['meanings'][card_key]:
                existing_sr[spread_key]['meanings'][card_key][position] = card_data[position]
        
        # Kaydet
        with open('messages/en.json', 'w', encoding='utf-8') as f:
            json.dump(existing_en, f, ensure_ascii=False, indent=2)
        
        with open('messages/sr.json', 'w', encoding='utf-8') as f:
            json.dump(existing_sr, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Kaydedildi: EN={successful_en}, SR={successful_sr} / {total} kart")
        
    finally:
        fcntl.flock(lock.fileno(), fcntl.LOCK_UN)
        lock.close()
    
    return successful_en + successful_sr

def main():
    start_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print("=" * 80)
    print("🚀 SMART HYBRID ÇEVIRICI - TÜM SPREAD'LER & POZİSYONLAR")
    print("=" * 80)
    print(f"⏰ Başlangıç: {start_time_str}")
    print(f"🎯 Strateji: Groq (hızlı) → Google (fallback)")
    print(f"🔒 Lock: AKTIF")
    print(f"🔄 Duplicate: Otomatik atla")
    print(f"🔤 Latin: OTOMATİK")
    
    # Discover
    spreads_positions, tr_data, en_data, sr_data = discover_spreads_and_positions()
    
    if not spreads_positions:
        print("\n✅ TÜM ÇEVIRILER TAMAMLANMIŞ!")
        sys.exit(0)
    
    # Özet göster
    print(f"\n📊 EKSIK ÇEVİRİLER TESPİT EDİLDİ:")
    print(f"{'='*80}")
    
    total_missing_cards = 0
    for spread_key, info in spreads_positions.items():
        print(f"\n📖 {spread_key.upper()}:")
        for pos_info in info['missing']:
            pos = pos_info['position']
            missing_en = pos_info['missing_en']
            missing_sr = pos_info['missing_sr']
            print(f"  • {pos}: EN:{pos_info['en_cards']}/{pos_info['tr_cards']} (eksik:{missing_en}), SR:{pos_info['sr_cards']}/{pos_info['tr_cards']} (eksik:{missing_sr})")
            total_missing_cards += missing_en + missing_sr
    
    print(f"\n{'='*80}")
    print(f"📊 TOPLAM: {total_missing_cards} kart çevrilecek")
    print(f"📖 Spread sayısı: {len(spreads_positions)}")
    
    # Kullanıcı onayı
    print(f"\n⚠️  Tahmini süre: ~{int(total_missing_cards * 0.1)} - {int(total_missing_cards * 0.15)} dakika")
    response = input("\n🚀 Başlayalım mı? (y/N): ")
    
    if response.lower() != 'y':
        print("❌ İptal edildi")
        sys.exit(0)
    
    # Çeviri işlemi
    print(f"\n{'='*80}")
    print("🃏 ÇEVİRİLER BAŞLIYOR...")
    print(f"{'='*80}")
    
    start_time = time.time()
    lock_file = '/tmp/tarot-i18n-all.lock'
    
    processed_spreads = 0
    for spread_key, info in spreads_positions.items():
        for pos_info in info['missing']:
            position = pos_info['position']
            translate_spread_position(spread_key, position, tr_data, en_data, sr_data, lock_file)
            processed_spreads += 1
        
        # Her spread sonrası özet
        print(f"\n📊 İlerleme Özeti:")
        print(f"  ✅ Başarılı: {stats['successful_cards']}")
        print(f"  ❌ Başarısız: {stats['failed_cards']}")
        print(f"  ⏭️  Atlandı: {stats['skipped_cards']}")
        print(f"  ⚡ Groq: {stats['groq_success']} başarı, {stats['groq_failed']} hata")
        print(f"  🌐 Google: {stats['google_success']} başarı, {stats['google_failed']} hata")
    
    # Cleanup
    if os.path.exists(lock_file):
        os.remove(lock_file)
    
    total_time = time.time() - start_time
    end_time_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    print("\n" + "=" * 80)
    print("✅ TÜM ÇEVİRİLER TAMAMLANDI!")
    print("=" * 80)
    print(f"⏰ Başlangıç: {start_time_str}")
    print(f"⏰ Bitiş:     {end_time_str}")
    print(f"⏱️  Toplam süre: {int(total_time/60)} dakika {int(total_time%60)} saniye")
    print(f"\n📊 FİNAL İSTATİSTİKLER:")
    print(f"  ✅ Başarılı: {stats['successful_cards']}")
    print(f"  ❌ Başarısız: {stats['failed_cards']}")
    print(f"  ⏭️  Atlandı: {stats['skipped_cards']}")
    print(f"  📊 Groq: {stats['groq_success']} başarı, {stats['groq_failed']} hata")
    print(f"  📊 Google: {stats['google_success']} başarı, {stats['google_failed']} hata")
    print(f"\n⚡ Performans:")
    if stats['successful_cards'] > 0:
        print(f"  Ortalama: {total_time/stats['successful_cards']:.1f} sn/kart")
    print(f"\n📁 Dosya: messages/sr.json (Latin ✓)")
    print("=" * 80)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n⚠️  Kullanıcı tarafından durduruldu!")
        sys.exit(1)
    except Exception as e:
        print(f"\n\n❌ Hata: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

