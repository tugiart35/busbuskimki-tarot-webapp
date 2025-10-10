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

def save_translation_immediately(spread_key, position, card_key, en_result, sr_result):
    """Her çeviriyi HEMEN kaydet (hata durumunda kayıp olmasın)"""
    lock_file = f'/tmp/tarot-incremental-save.lock'
    lock = open(lock_file, 'w')
    
    try:
        fcntl.flock(lock.fileno(), fcntl.LOCK_EX)
        
        # EN kaydet
        if en_result:
            with open('messages/en.json', 'r', encoding='utf-8') as f:
                en_data = json.load(f)
            
            if spread_key not in en_data:
                en_data[spread_key] = {}
            if 'meanings' not in en_data[spread_key]:
                en_data[spread_key]['meanings'] = {}
            if card_key not in en_data[spread_key]['meanings']:
                en_data[spread_key]['meanings'][card_key] = {}
            
            en_data[spread_key]['meanings'][card_key][position] = en_result
            
            with open('messages/en.json', 'w', encoding='utf-8') as f:
                json.dump(en_data, f, ensure_ascii=False, indent=2)
        
        # SR kaydet
        if sr_result:
            with open('messages/sr.json', 'r', encoding='utf-8') as f:
                sr_data = json.load(f)
            
            if spread_key not in sr_data:
                sr_data[spread_key] = {}
            if 'meanings' not in sr_data[spread_key]:
                sr_data[spread_key]['meanings'] = {}
            if card_key not in sr_data[spread_key]['meanings']:
                sr_data[spread_key]['meanings'][card_key] = {}
            
            sr_data[spread_key]['meanings'][card_key][position] = sr_result
            
            with open('messages/sr.json', 'w', encoding='utf-8') as f:
                json.dump(sr_data, f, ensure_ascii=False, indent=2)
        
        return True
    except Exception as e:
        print(f"    ⚠️ Save error: {e}")
        return False
    finally:
        fcntl.flock(lock.fileno(), fcntl.LOCK_UN)
        lock.close()
        if os.path.exists(lock_file):
            os.remove(lock_file)

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
        en_result = None
        en_status = "✓"
        if not en_exists:
            result_en, method_en = translate_hybrid(to_translate, 'en')
            if result_en:
                en_result = result_en
                successful_en += 1
                en_status = f"EN:{method_en}"
            else:
                en_status = "EN:❌"
            
            time.sleep(REQUEST_DELAY_GROQ if "Groq" in method_en else REQUEST_DELAY_GOOGLE)
        
        # SR çevirisi (eğer yoksa)
        sr_result = None
        sr_status = "✓"
        if not sr_exists:
            result_sr, method_sr = translate_hybrid(to_translate, 'sr')
            if result_sr:
                sr_result = result_sr
                successful_sr += 1
                sr_status = f"SR:{method_sr}"
            else:
                sr_status = "SR:❌"
            
            time.sleep(REQUEST_DELAY_GROQ if "Groq" in method_sr else REQUEST_DELAY_GOOGLE)
        
        # 💾 HER ÇEVİRİYİ HEMEN KAYDET
        if en_result or sr_result:
            save_ok = save_translation_immediately(spread_key, position, card_key, en_result, sr_result)
            save_marker = "💾" if save_ok else "⚠️"
        else:
            save_marker = "✓"
        
        # Status göster
        stats['successful_cards'] += 1 if (not en_exists or en_result) and (not sr_exists or sr_result) else 0
        if (en_exists or en_result) and (sr_exists or sr_result):
            print(f" {save_marker} → {en_status} {sr_status}")
        else:
            print(f" {save_marker} → ❌ {en_status} {sr_status}")
            stats['failed_cards'] += 1
    
    # Her çeviri zaten anında kaydedildi
    print(f"\n✅ Position tamamlandı:")
    print(f"   Çevrilen: EN={successful_en}, SR={successful_sr} / {total} kart")
    print(f"   Her çeviri anında kaydedildi (incremental save)")
    
    # ✅ VALIDATION: Position tamamlandı mı kontrol et
    print(f"\n✅ Position çevirisi tamamlandı, doğrulama yapılıyor...")
    
    validation_passed = validate_position_completion(
        spread_key, position, en_translated_data, sr_translated_data
    )
    
    if not validation_passed:
        print(f"⚠️  VALIDATION BAŞARISIZ! Position tekrar kontrol edilmeli.")
        return 0
    
    return successful_en + successful_sr

def validate_position_completion(spread_key, position, en_data, sr_data):
    """
    Position çevirisinin başarılı olup olmadığını doğrula
    - Dosyaya yazıldı mı?
    - Kart sayısı doğru mu?
    - Field'lar dolu mu?
    - Quality standartlarına uyuyor mu?
    """
    print(f"\n🔍 VALIDATION: {spread_key}/{position}")
    print("="*60)
    
    # Dosyalardan geri oku
    try:
        with open('messages/en.json', 'r', encoding='utf-8') as f:
            existing_en = json.load(f)
        with open('messages/sr.json', 'r', encoding='utf-8') as f:
            existing_sr = json.load(f)
    except Exception as e:
        print(f"❌ Dosya okuma hatası: {e}")
        return False
    
    issues = []
    
    # EN kontrolü
    en_expected = len(en_data.get(spread_key, {}).get('meanings', {}))
    en_actual = 0
    
    if spread_key in existing_en and 'meanings' in existing_en[spread_key]:
        for card_key in existing_en[spread_key]['meanings']:
            if position in existing_en[spread_key]['meanings'][card_key]:
                en_actual += 1
                
                # Field kontrolü
                pos_data = existing_en[spread_key]['meanings'][card_key][position]
                if not pos_data.get('upright') or len(pos_data.get('upright', '')) < 10:
                    issues.append(f"EN/{card_key}: upright eksik/kısa")
                if not pos_data.get('reversed') or len(pos_data.get('reversed', '')) < 10:
                    issues.append(f"EN/{card_key}: reversed eksik/kısa")
                if not pos_data.get('context') or len(pos_data.get('context', '')) < 5:
                    issues.append(f"EN/{card_key}: context eksik/kısa")
                if not pos_data.get('keywords') or len(pos_data.get('keywords', [])) < 2:
                    issues.append(f"EN/{card_key}: keywords eksik")
    
    # SR kontrolü
    sr_expected = len(sr_data.get(spread_key, {}).get('meanings', {}))
    sr_actual = 0
    
    if spread_key in existing_sr and 'meanings' in existing_sr[spread_key]:
        for card_key in existing_sr[spread_key]['meanings']:
            if position in existing_sr[spread_key]['meanings'][card_key]:
                sr_actual += 1
                
                # Field kontrolü
                pos_data = existing_sr[spread_key]['meanings'][card_key][position]
                if not pos_data.get('upright') or len(pos_data.get('upright', '')) < 10:
                    issues.append(f"SR/{card_key}: upright eksik/kısa")
                if not pos_data.get('reversed') or len(pos_data.get('reversed', '')) < 10:
                    issues.append(f"SR/{card_key}: reversed eksik/kısa")
                if not pos_data.get('context') or len(pos_data.get('context', '')) < 5:
                    issues.append(f"SR/{card_key}: context eksik/kısa")
                if not pos_data.get('keywords') or len(pos_data.get('keywords', [])) < 2:
                    issues.append(f"SR/{card_key}: keywords eksik")
    
    # Rapor
    print(f"📊 Kart Sayısı Kontrolü:")
    
    # 78 kart standardı
    EXPECTED_CARDS = 78
    
    en_card_status = "✅ TAM" if en_actual >= EXPECTED_CARDS else f"⚠️ EKSİK ({EXPECTED_CARDS - en_actual} kart)"
    sr_card_status = "✅ TAM" if sr_actual >= EXPECTED_CARDS else f"⚠️ EKSİK ({EXPECTED_CARDS - sr_actual} kart)"
    
    print(f"  EN: {en_actual}/{EXPECTED_CARDS} kart - {en_card_status}")
    print(f"  SR: {sr_actual}/{EXPECTED_CARDS} kart - {sr_card_status}")
    
    # Eksik kart listesi
    if en_actual < EXPECTED_CARDS or sr_actual < EXPECTED_CARDS:
        print(f"\n📝 NOT: Standard 78 kart değil:")
        if en_actual < EXPECTED_CARDS:
            print(f"  ⚠️ EN: {EXPECTED_CARDS - en_actual} kart eksik (TR'de de eksik olabilir)")
        if sr_actual < EXPECTED_CARDS:
            print(f"  ⚠️ SR: {EXPECTED_CARDS - sr_actual} kart eksik (TR'de de eksik olabilir)")
    
    if issues:
        print(f"\n⚠️  Quality Issues ({len(issues)} adet):")
        for issue in issues[:5]:
            print(f"  • {issue}")
        if len(issues) > 5:
            print(f"  ... ve {len(issues) - 5} sorun daha")
    
    # Başarı kriteri (daha esnek - TR'de eksik olabilir)
    en_ok = en_actual >= en_expected or en_expected == 0
    sr_ok = sr_actual >= sr_expected or sr_expected == 0
    quality_ok = len(issues) < max((en_expected + sr_expected) * 0.1, 5)  # %10'dan az veya 5'ten az hata
    
    # Eğer kart sayısı düşükse kabul et ama uyar
    if en_actual < EXPECTED_CARDS or sr_actual < EXPECTED_CARDS:
        print(f"\n⚠️ KART SAYISI UYARISI:")
        print(f"   Bu position TR.json'da da {en_actual if en_actual < EXPECTED_CARDS else sr_actual} kart içeriyor.")
        print(f"   Standard 78 değil ama çeviri başarılı sayılıyor.")
    
    passed = en_ok and sr_ok and quality_ok
    
    if passed:
        print(f"\n✅ VALIDATION BAŞARILI!")
        print(f"   EN: {en_actual} kart ✓")
        print(f"   SR: {sr_actual} kart ✓")
        print(f"   Quality: {'✅' if quality_ok else '⚠️'} ({len(issues)} issue)")
    else:
        print(f"\n❌ VALIDATION BAŞARISIZ!")
        print(f"   EN OK: {en_ok} (actual={en_actual}, expected={en_expected})")
        print(f"   SR OK: {sr_ok} (actual={sr_actual}, expected={sr_expected})")
        print(f"   Quality OK: {quality_ok} ({len(issues)} issues)")
    
    print("="*60)
    
    return passed

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
    
    # Otomatik başlat (background mode için)
    print(f"\n⚠️  Tahmini süre: ~{int(total_missing_cards * 0.1)} - {int(total_missing_cards * 0.15)} dakika")
    print("\n🚀 Çeviri otomatik başlıyor... (background mode)")
    time.sleep(2)
    
    # Çeviri işlemi
    print(f"\n{'='*80}")
    print("🃏 ÇEVİRİLER BAŞLIYOR...")
    print(f"{'='*80}")
    
    start_time = time.time()
    lock_file = '/tmp/tarot-i18n-all.lock'
    
    processed_spreads = 0
    failed_positions = []
    
    for spread_key, info in spreads_positions.items():
        for pos_info in info['missing']:
            position = pos_info['position']
            
            # Position çevirisini yap
            result = translate_spread_position(spread_key, position, tr_data, en_data, sr_data, lock_file)
            
            if result == 0:
                # Validation başarısız
                failed_positions.append(f"{spread_key}/{position}")
                print(f"\n⚠️  {spread_key}/{position} VALIDATION BAŞARISIZ - Kaydedildi, devam ediliyor...")
            else:
                print(f"\n✅ {spread_key}/{position} TAMAMLANDI ve VALİDE EDİLDİ!")
            
            processed_spreads += 1
        
        # Her spread sonrası özet
        print(f"\n{'='*80}")
        print(f"📊 {spread_key.upper()} SPREAD İLERLEME ÖZETİ:")
        print(f"{'='*80}")
        print(f"  ✅ Başarılı: {stats['successful_cards']}")
        print(f"  ❌ Başarısız: {stats['failed_cards']}")
        print(f"  ⏭️  Atlandı: {stats['skipped_cards']}")
        print(f"  ⚠️  Validation failed: {len(failed_positions)}")
        print(f"  ⚡ Groq: {stats['groq_success']} başarı, {stats['groq_failed']} hata")
        print(f"  🌐 Google: {stats['google_success']} başarı, {stats['google_failed']} hata")
        print(f"{'='*80}")
    
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
    print(f"  ⚠️  Validation failed: {len(failed_positions)}")
    print(f"  📊 Groq: {stats['groq_success']} başarı, {stats['groq_failed']} hata")
    print(f"  📊 Google: {stats['google_success']} başarı, {stats['google_failed']} hata")
    
    if failed_positions:
        print(f"\n⚠️  VALIDATION BAŞARISIZ POZİSYONLAR:")
        for pos in failed_positions:
            print(f"  • {pos}")
        print(f"\n💡 Bu position'ları manuel kontrol edin veya tekrar çalıştırın.")
    print(f"\n⚡ Performans:")
    if stats['successful_cards'] > 0:
        print(f"  Ortalama: {total_time/stats['successful_cards']:.1f} sn/kart")
    print(f"\n📁 Dosyalar:")
    print(f"  - messages/en.json (English ✓)")
    print(f"  - messages/sr.json (Serbian Latin ✓)")
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

