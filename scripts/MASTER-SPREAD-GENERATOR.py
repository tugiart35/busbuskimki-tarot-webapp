#!/usr/bin/env python3
"""
🎯 MASTER SPREAD GENERATOR
Tüm spread'ler için otomatik script oluşturur ve çalıştırır
(Love ve Career hariç - bunlar zaten tamamlandı)
"""

import os
import subprocess
import json
from pathlib import Path

# ═══════════════════════════════════════════════════════════
# SPREAD TANIMLARI (Love ve Career hariç)
# ═══════════════════════════════════════════════════════════

SPREADS = {
    'marriage': {
        'name': 'Marriage',
        'positions': 10,
        'type_pattern': 'MarriagePosition{X}Meaning'
    },
    'money': {
        'name': 'Money',
        'positions': 8,
        'type_pattern': 'MoneyPositionMeaning'
    },
    'new-lover': {
        'name': 'NewLover',
        'positions': 6,
        'type_pattern': 'NewLoverPosition{X}Meaning'
    },
    'problem-solving': {
        'name': 'ProblemSolving',
        'positions': 10,
        'type_pattern': 'ProblemSolvingPositionMeaning'
    },
    'relationship-analysis': {
        'name': 'RelationshipAnalysis',
        'positions': 7,
        'type_pattern': 'RelationshipAnalysisPositionMeaning'
    },
    'relationship-problems': {
        'name': 'RelationshipProblems',
        'positions': 9,
        'type_pattern': 'RelationshipProblemsPositionMeaning'
    },
    'situation-analysis': {
        'name': 'SituationAnalysis',
        'positions': 7,
        'type_pattern': 'SituationAnalysisPositionMeaning'
    }
}

# ═══════════════════════════════════════════════════════════

def get_position_files(spread_key):
    """Spread klasöründeki position dosyalarını listele"""
    spread_dir = Path(f'src/features/tarot/lib/{spread_key}')
    if not spread_dir.exists():
        return []
    
    files = list(spread_dir.glob('position-*.ts'))
    # position-meanings-index.ts'yi hariç tut
    files = [f for f in files if 'index' not in f.name]
    return sorted(files)

def detect_type_name(file_path):
    """Dosyadaki type name'i otomatik tespit et"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # export const position{X}Meanings: {TypeName}[] = [
    import re
    match = re.search(r'export const position\d+Meanings:\s*(\w+)\[\]', content)
    if match:
        return match.group(1)
    return None

def create_extraction_script(spread_key, position_num, file_name, type_name):
    """Extraction script oluştur"""
    script_path = f'scripts/extract-{spread_key}-position{position_num}-tr.js'
    
    template = Path('scripts/TEMPLATE-extract-position-tr.js').read_text()
    
    # Özelleştir
    template = template.replace("const SPREAD_NAME = 'love'", f"const SPREAD_NAME = '{spread_key}'")
    template = template.replace("const POSITION_NUMBER = 2", f"const POSITION_NUMBER = {position_num}")
    template = template.replace("const FILE_NAME = 'position-2-fiziksel.ts'", f"const FILE_NAME = '{file_name}'")
    template = template.replace("const TYPE_NAME = `LovePositionMeaning`", f"const TYPE_NAME = `{type_name}`")
    
    Path(script_path).write_text(template)
    print(f"  ✅ {script_path}")
    return script_path

def create_translation_script(spread_key, position_num):
    """Translation script oluştur"""
    script_path = f'scripts/translate-{spread_key}-position{position_num}.py'
    
    template = Path('scripts/translate-love-position2.py').read_text()
    
    # Özelleştir
    template = template.replace("SPREAD_KEY = 'love'", f"SPREAD_KEY = '{spread_key}'")
    template = template.replace("POSITION_NUM = 2", f"POSITION_NUM = {position_num}")
    template = template.replace("Love Spread Position-2", f"{spread_key.title()} Position-{position_num}")
    
    Path(script_path).write_text(template)
    os.chmod(script_path, 0o755)
    print(f"  ✅ {script_path}")
    return script_path

def main():
    print("=" * 70)
    print("🎯 MASTER SPREAD SCRIPT GENERATOR")
    print("=" * 70)
    print()
    print("📊 Kalan Spread'ler (Love ve Career hariç):")
    print()
    
    total_positions = 0
    
    for spread_key, spread_info in SPREADS.items():
        print(f"📁 {spread_key}:")
        
        # Position dosyalarını bul
        position_files = get_position_files(spread_key)
        actual_count = len(position_files)
        
        print(f"   Beklenen: {spread_info['positions']} pozisyon")
        print(f"   Bulunan: {actual_count} dosya")
        
        if actual_count == 0:
            print(f"   ⚠️  Dosya bulunamadı, atlanıyor...")
            continue
        
        # Her pozisyon için script oluştur
        for i, pos_file in enumerate(position_files, 1):
            file_name = pos_file.name
            
            # Type name'i dosyadan tespit et
            type_name = detect_type_name(pos_file)
            if not type_name:
                print(f"   ⚠️  Position-{i}: Type name tespit edilemedi, {spread_info['type_pattern']} kullanılıyor")
                type_name = spread_info['type_pattern'].replace('{X}', str(i))
            
            # Script'leri oluştur
            create_extraction_script(spread_key, i, file_name, type_name)
            create_translation_script(spread_key, i)
            total_positions += 1
        
        print()
    
    print("=" * 70)
    print(f"✅ TOPLAM {total_positions} POZİSYON İÇİN SCRIPT OLUŞTURULDU!")
    print(f"📁 {total_positions * 2} script dosyası ({total_positions} extract + {total_positions} translate)")
    print("=" * 70)
    print()
    print("🚀 SONRAKI ADIM:")
    print("   Master batch script ile tümünü çalıştırabilirsiniz!")

if __name__ == '__main__':
    main()

