#!/usr/bin/env python3
"""
JSON dosyalarını tr.json referansına göre düzenler.
Anahtar yapısını koruyarak sadece düzeni eşleştirir.
Orijinal dosyalara dokunmaz, yeni dosyalar oluşturur.
"""

import json
import sys
from pathlib import Path
from typing import Any, Dict, Set, List, Tuple
from datetime import datetime
from collections import defaultdict


def find_missing_keys(reference: Dict[str, Any], target: Dict[str, Any], prefix: str = "") -> List[str]:
    """Reference'ta olup target'ta olmayan anahtarları bulur"""
    missing = []
    
    for key, value in reference.items():
        current_path = f"{prefix}.{key}" if prefix else key
        
        if key not in target:
            missing.append(current_path)
        elif isinstance(value, dict) and isinstance(target.get(key), dict):
            missing.extend(find_missing_keys(value, target[key], current_path))
        elif isinstance(value, list) and isinstance(target.get(key), list):
            # List comparison - basit kontrol
            if len(value) != len(target[key]):
                missing.append(f"{current_path} (length mismatch)")
    
    return missing


def find_extra_keys(reference: Dict[str, Any], target: Dict[str, Any], prefix: str = "") -> List[str]:
    """Target'ta olup reference'ta olmayan anahtarları bulur"""
    extra = []
    
    for key, value in target.items():
        current_path = f"{prefix}.{key}" if prefix else key
        
        if key not in reference:
            extra.append(current_path)
        elif isinstance(value, dict) and isinstance(reference.get(key), dict):
            extra.extend(find_extra_keys(reference[key], value, current_path))
    
    return extra


def categorize_keys(keys: List[str]) -> Dict[str, List[str]]:
    """Anahtarları kategorilere ayırır (ilk seviye anahtara göre)"""
    categories = defaultdict(list)
    
    for key in keys:
        if '.' in key:
            category = key.split('.')[0]
        else:
            category = "root"
        categories[category].append(key)
    
    return dict(categories)


def get_all_keys_count(obj: Any) -> int:
    """Bir JSON objesindeki toplam anahtar sayısını sayar"""
    count = 0
    
    if isinstance(obj, dict):
        count += len(obj)
        for value in obj.values():
            count += get_all_keys_count(value)
    elif isinstance(obj, list):
        for item in obj:
            count += get_all_keys_count(item)
    
    return count


def reorder_json_by_reference(source_data: Dict[str, Any], reference_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Source JSON'u reference JSON'un düzenine göre yeniden düzenler.
    Anahtar yapısını korur, sadece sıralamayı değiştirir.
    """
    
    def reorder_dict(ref: Dict, src: Dict) -> Dict:
        """Recursive olarak dict'i yeniden düzenler"""
        result = {}
        
        # Önce reference'taki anahtarları sırasıyla ekle
        for key in ref.keys():
            if key in src:
                if isinstance(ref[key], dict) and isinstance(src[key], dict):
                    # Nested dict - recursive call
                    result[key] = reorder_dict(ref[key], src[key])
                elif isinstance(ref[key], list) and isinstance(src[key], list):
                    # List - aynı sırada tut
                    result[key] = src[key]
                else:
                    # Leaf value - değeri koru
                    result[key] = src[key]
            else:
                # Reference'ta var ama source'ta yok - boş değer ekle
                if isinstance(ref[key], dict):
                    result[key] = {}
                elif isinstance(ref[key], list):
                    result[key] = []
                else:
                    result[key] = None
        
        # Sonra source'taki fazla anahtarları ekle (reference'ta olmayan)
        for key in src.keys():
            if key not in result:
                result[key] = src[key]
        
        return result
    
    return reorder_dict(reference_data, source_data)


def main():
    base_path = Path("/Users/tugi/Desktop/TaraTarot/messages")
    
    tr_file = base_path / "tr.json"
    en_file = base_path / "en.json"
    sr_file = base_path / "sr.json"
    
    # Çıktı dosyaları (yeni dosyalar)
    en_output = base_path / "en_reordered.json"
    sr_output = base_path / "sr_reordered.json"
    
    # Analiz raporu dosyası
    report_file = base_path / "reorder_analysis.txt"
    
    # Dosyaları yükle
    print("📂 JSON dosyaları yükleniyor...")
    try:
        with open(tr_file, 'r', encoding='utf-8') as f:
            tr_data = json.load(f)
        print(f"  ✅ {tr_file.name} yüklendi")
    except Exception as e:
        print(f"  ❌ {tr_file.name} yüklenemedi: {e}")
        return
    
    try:
        with open(en_file, 'r', encoding='utf-8') as f:
            en_data = json.load(f)
        print(f"  ✅ {en_file.name} yüklendi")
    except Exception as e:
        print(f"  ❌ {en_file.name} yüklenemedi: {e}")
        return
    
    try:
        with open(sr_file, 'r', encoding='utf-8') as f:
            sr_data = json.load(f)
        print(f"  ✅ {sr_file.name} yüklendi")
    except Exception as e:
        print(f"  ❌ {sr_file.name} yüklenemedi: {e}")
        return
    
    print("\n✅ Tüm dosyalar yüklendi\n")
    
    # Eksik/fazla anahtarları bul
    print("🔍 Anahtar analizi yapılıyor...")
    en_missing = find_missing_keys(tr_data, en_data)
    en_extra = find_extra_keys(tr_data, en_data)
    
    sr_missing = find_missing_keys(tr_data, sr_data)
    sr_extra = find_extra_keys(tr_data, sr_data)
    
    # Anahtarları kategorilere ayır
    en_missing_cat = categorize_keys(en_missing)
    en_extra_cat = categorize_keys(en_extra)
    sr_missing_cat = categorize_keys(sr_missing)
    sr_extra_cat = categorize_keys(sr_extra)
    
    # Toplam anahtar sayılarını hesapla
    tr_total_keys = get_all_keys_count(tr_data)
    en_total_keys = get_all_keys_count(en_data)
    sr_total_keys = get_all_keys_count(sr_data)
    
    # Satır sayılarını hesapla
    tr_total_lines = sum(1 for _ in open(tr_file, 'r', encoding='utf-8'))
    en_total_lines = sum(1 for _ in open(en_file, 'r', encoding='utf-8'))
    sr_total_lines = sum(1 for _ in open(sr_file, 'r', encoding='utf-8'))
    
    # Analiz raporunu oluştur
    report_lines = []
    report_lines.append("=" * 100)
    report_lines.append(" " * 30 + "JSON DÜZENLEME DETAYLI ANALİZ RAPORU")
    report_lines.append("=" * 100)
    report_lines.append(f"\nReferans dosya: {tr_file.name}")
    report_lines.append(f"Analiz tarihi: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report_lines.append("\n" + "=" * 100)
    
    # Genel istatistikler
    report_lines.append("\n📈 GENEL İSTATİSTİKLER")
    report_lines.append("-" * 100)
    report_lines.append(f"\n📊 Anahtar Sayıları:")
    report_lines.append(f"  TR.json toplam anahtar sayısı: {tr_total_keys:,}")
    report_lines.append(f"  EN.json toplam anahtar sayısı: {en_total_keys:,} (Fark: {en_total_keys - tr_total_keys:+,})")
    report_lines.append(f"  SR.json toplam anahtar sayısı: {sr_total_keys:,} (Fark: {sr_total_keys - tr_total_keys:+,})")
    report_lines.append(f"\n📄 Satır Sayıları:")
    report_lines.append(f"  TR.json toplam satır sayısı: {tr_total_lines:,}")
    report_lines.append(f"  EN.json toplam satır sayısı: {en_total_lines:,} (Fark: {en_total_lines - tr_total_lines:+,})")
    report_lines.append(f"  SR.json toplam satır sayısı: {sr_total_lines:,} (Fark: {sr_total_lines - tr_total_lines:+,})")
    report_lines.append(f"\n📈 Ortalama Satır/Anahtar Oranı:")
    tr_ratio = tr_total_lines / tr_total_keys if tr_total_keys > 0 else 0
    en_ratio = en_total_lines / en_total_keys if en_total_keys > 0 else 0
    sr_ratio = sr_total_lines / sr_total_keys if sr_total_keys > 0 else 0
    report_lines.append(f"  TR.json: {tr_ratio:.2f} satır/anahtar")
    report_lines.append(f"  EN.json: {en_ratio:.2f} satır/anahtar")
    report_lines.append(f"  SR.json: {sr_ratio:.2f} satır/anahtar")
    
    # EN.json detaylı analiz
    report_lines.append("\n" + "=" * 100)
    report_lines.append("📊 EN.json DETAYLI ANALİZ")
    report_lines.append("=" * 100)
    report_lines.append(f"\n❌ EKSİK ANAHTARLAR: {len(en_missing)} adet")
    report_lines.append("-" * 100)
    
    if en_missing:
        # Kategorilere göre göster
        for category in sorted(en_missing_cat.keys()):
            keys = sorted(en_missing_cat[category])
            report_lines.append(f"\n📁 Kategori: {category} ({len(keys)} adet)")
            for key in keys:
                report_lines.append(f"    - {key}")
    else:
        report_lines.append("    ✅ Eksik anahtar yok!")
    
    report_lines.append(f"\n➕ FAZLA ANAHTARLAR: {len(en_extra)} adet")
    report_lines.append("-" * 100)
    
    if en_extra:
        # Kategorilere göre göster
        for category in sorted(en_extra_cat.keys()):
            keys = sorted(en_extra_cat[category])
            report_lines.append(f"\n📁 Kategori: {category} ({len(keys)} adet)")
            for key in keys:
                report_lines.append(f"    - {key}")
    else:
        report_lines.append("    ✅ Fazla anahtar yok!")
    
    # EN.json kategori özeti
    report_lines.append("\n📋 EN.json KATEGORİ ÖZETİ")
    report_lines.append("-" * 100)
    report_lines.append(f"{'Kategori':<30} {'Eksik':<15} {'Fazla':<15}")
    report_lines.append("-" * 100)
    all_categories_en = set(en_missing_cat.keys()) | set(en_extra_cat.keys())
    for cat in sorted(all_categories_en):
        missing_count = len(en_missing_cat.get(cat, []))
        extra_count = len(en_extra_cat.get(cat, []))
        report_lines.append(f"{cat:<30} {missing_count:<15} {extra_count:<15}")
    
    # SR.json detaylı analiz
    report_lines.append("\n" + "=" * 100)
    report_lines.append("📊 SR.json DETAYLI ANALİZ")
    report_lines.append("=" * 100)
    report_lines.append(f"\n❌ EKSİK ANAHTARLAR: {len(sr_missing)} adet")
    report_lines.append("-" * 100)
    
    if sr_missing:
        # Kategorilere göre göster
        for category in sorted(sr_missing_cat.keys()):
            keys = sorted(sr_missing_cat[category])
            report_lines.append(f"\n📁 Kategori: {category} ({len(keys)} adet)")
            for key in keys:
                report_lines.append(f"    - {key}")
    else:
        report_lines.append("    ✅ Eksik anahtar yok!")
    
    report_lines.append(f"\n➕ FAZLA ANAHTARLAR: {len(sr_extra)} adet")
    report_lines.append("-" * 100)
    
    if sr_extra:
        # Kategorilere göre göster
        for category in sorted(sr_extra_cat.keys()):
            keys = sorted(sr_extra_cat[category])
            report_lines.append(f"\n📁 Kategori: {category} ({len(keys)} adet)")
            for key in keys:
                report_lines.append(f"    - {key}")
    else:
        report_lines.append("    ✅ Fazla anahtar yok!")
    
    # SR.json kategori özeti
    report_lines.append("\n📋 SR.json KATEGORİ ÖZETİ")
    report_lines.append("-" * 100)
    report_lines.append(f"{'Kategori':<30} {'Eksik':<15} {'Fazla':<15}")
    report_lines.append("-" * 100)
    all_categories_sr = set(sr_missing_cat.keys()) | set(sr_extra_cat.keys())
    for cat in sorted(all_categories_sr):
        missing_count = len(sr_missing_cat.get(cat, []))
        extra_count = len(sr_extra_cat.get(cat, []))
        report_lines.append(f"{cat:<30} {missing_count:<15} {extra_count:<15}")
    
    # Özet
    report_lines.append("\n" + "=" * 100)
    report_lines.append("📝 ÖZET")
    report_lines.append("=" * 100)
    report_lines.append(f"\nEN.json:")
    report_lines.append(f"  - Eksik anahtarlar: {len(en_missing)}")
    report_lines.append(f"  - Fazla anahtarlar: {len(en_extra)}")
    report_lines.append(f"  - Toplam fark: {len(en_missing) - len(en_extra)}")
    report_lines.append(f"\nSR.json:")
    report_lines.append(f"  - Eksik anahtarlar: {len(sr_missing)}")
    report_lines.append(f"  - Fazla anahtarlar: {len(sr_extra)}")
    report_lines.append(f"  - Toplam fark: {len(sr_missing) - len(sr_extra)}")
    report_lines.append("\n" + "=" * 100)
    
    # Konsola özet bilgi yazdır
    print(f"\n📊 EN.json Analizi:")
    print(f"  ❌ Eksik anahtarlar: {len(en_missing)}")
    if en_missing[:10]:
        for key in en_missing[:10]:
            print(f"    - {key}")
        if len(en_missing) > 10:
            print(f"    ... ve {len(en_missing) - 10} tane daha")
    
    print(f"  ➕ Fazla anahtarlar: {len(en_extra)}")
    if en_extra[:10]:
        for key in en_extra[:10]:
            print(f"    - {key}")
        if len(en_extra) > 10:
            print(f"    ... ve {len(en_extra) - 10} tane daha")
    
    print(f"\n📊 SR.json Analizi:")
    print(f"  ❌ Eksik anahtarlar: {len(sr_missing)}")
    if sr_missing[:10]:
        for key in sr_missing[:10]:
            print(f"    - {key}")
        if len(sr_missing) > 10:
            print(f"    ... ve {len(sr_missing) - 10} tane daha")
    
    print(f"  ➕ Fazla anahtarlar: {len(sr_extra)}")
    if sr_extra[:10]:
        for key in sr_extra[:10]:
            print(f"    - {key}")
        if len(sr_extra) > 10:
            print(f"    ... ve {len(sr_extra) - 10} tane daha")
    
    # JSON'ları yeniden düzenle
    print("\n🔄 JSON dosyaları yeniden düzenleniyor...")
    en_reordered = reorder_json_by_reference(en_data, tr_data)
    sr_reordered = reorder_json_by_reference(sr_data, tr_data)
    
    # Yeniden düzenlenmiş dosyaları kaydet
    print("\n💾 Yeni dosyalar oluşturuluyor...")
    
    try:
        with open(en_output, 'w', encoding='utf-8') as f:
            json.dump(en_reordered, f, ensure_ascii=False, indent=2)
        print(f"  ✅ {en_output.name} oluşturuldu")
    except Exception as e:
        print(f"  ❌ {en_output.name} oluşturulamadı: {e}")
        return
    
    try:
        with open(sr_output, 'w', encoding='utf-8') as f:
            json.dump(sr_reordered, f, ensure_ascii=False, indent=2)
        print(f"  ✅ {sr_output.name} oluşturuldu")
    except Exception as e:
        print(f"  ❌ {sr_output.name} oluşturulamadı: {e}")
        return
    
    # Analiz raporunu kaydet
    try:
        with open(report_file, 'w', encoding='utf-8') as f:
            f.write('\n'.join(report_lines))
        print(f"  ✅ {report_file.name} oluşturuldu")
    except Exception as e:
        print(f"  ⚠️  Rapor dosyası oluşturulamadı: {e}")
    
    print("\n" + "=" * 80)
    print("✅ İşlem tamamlandı!")
    print("=" * 80)
    print(f"\n📝 Özet:")
    print(f"  - EN.json: {len(en_missing)} eksik, {len(en_extra)} fazla anahtar")
    print(f"  - SR.json: {len(sr_missing)} eksik, {len(sr_extra)} fazla anahtar")
    print(f"\n📁 Oluşturulan dosyalar:")
    print(f"  - {en_output.name}")
    print(f"  - {sr_output.name}")
    print(f"  - {report_file.name}")
    print(f"\n⚠️  Orijinal dosyalar değiştirilmedi:")
    print(f"  - {en_file.name}")
    print(f"  - {sr_file.name}")


if __name__ == "__main__":
    main()

