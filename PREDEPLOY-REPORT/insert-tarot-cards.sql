-- ========================================
-- TAROT KARTLARI - tr.json'dan Import
-- Toplam Kart: 78
-- ========================================

-- 1. The Fool
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Fool',
  'Deli',
  'Luda',
  'major',
  NULL,
  NULL,
  '/images/tarot-cards/the-fool.webp',
  'the-fool',
  'the-fool',
  'the-fool'
) ON CONFLICT (english_name) DO NOTHING;

-- 2. The Magician
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Magician',
  'Büyücü',
  'Mađioničar',
  'major',
  NULL,
  1,
  '/images/tarot-cards/the-magician.webp',
  'the-magician',
  'the-magician',
  'the-magician'
) ON CONFLICT (english_name) DO NOTHING;

-- 3. The High Priestess
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The High Priestess',
  'Başrahibe',
  'Visoka Svestenica',
  'major',
  NULL,
  2,
  '/images/tarot-cards/the-high-priestess.webp',
  'the-high-priestess',
  'the-high-priestess',
  'the-high-priestess'
) ON CONFLICT (english_name) DO NOTHING;

-- 4. The Empress
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Empress',
  'İmparatoriçe',
  'Carica',
  'major',
  NULL,
  3,
  '/images/tarot-cards/the-empress.webp',
  'the-empress',
  'the-empress',
  'the-empress'
) ON CONFLICT (english_name) DO NOTHING;

-- 5. The Emperor
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Emperor',
  'İmparator',
  'Car',
  'major',
  NULL,
  4,
  '/images/tarot-cards/the-emperor.webp',
  'the-emperor',
  'the-emperor',
  'the-emperor'
) ON CONFLICT (english_name) DO NOTHING;

-- 6. The Hierophant
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Hierophant',
  'Başrahip',
  'Svećenik',
  'major',
  NULL,
  5,
  '/images/tarot-cards/the-hierophant.webp',
  'the-hierophant',
  'the-hierophant',
  'the-hierophant'
) ON CONFLICT (english_name) DO NOTHING;

-- 7. The Lovers
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Lovers',
  'Aşıklar',
  'Ljubavnici',
  'major',
  NULL,
  6,
  '/images/tarot-cards/the-lovers.webp',
  'the-lovers',
  'the-lovers',
  'the-lovers'
) ON CONFLICT (english_name) DO NOTHING;

-- 8. The Chariot
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Chariot',
  'Savaş Arabası',
  'Kola',
  'major',
  NULL,
  7,
  '/images/tarot-cards/the-chariot.webp',
  'the-chariot',
  'the-chariot',
  'the-chariot'
) ON CONFLICT (english_name) DO NOTHING;

-- 9. Strength
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Strength',
  'Güç',
  'Snaga',
  'major',
  NULL,
  8,
  '/images/tarot-cards/strength.webp',
  'strength',
  'strength',
  'strength'
) ON CONFLICT (english_name) DO NOTHING;

-- 10. The Hermit
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Hermit',
  'Ermiş',
  'Pustinjak',
  'major',
  NULL,
  9,
  '/images/tarot-cards/the-hermit.webp',
  'the-hermit',
  'the-hermit',
  'the-hermit'
) ON CONFLICT (english_name) DO NOTHING;

-- SKIP: the-wheel-of-fortune (mapping bulunamadı)
-- 11. Justice
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Justice',
  'Adalet',
  'Pravda',
  'major',
  NULL,
  11,
  '/images/tarot-cards/justice.webp',
  'justice',
  'justice',
  'justice'
) ON CONFLICT (english_name) DO NOTHING;

-- 12. The Hanged Man
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Hanged Man',
  'Asılan Adam',
  'Obešeni',
  'major',
  NULL,
  12,
  '/images/tarot-cards/the-hanged-man.webp',
  'the-hanged-man',
  'the-hanged-man',
  'the-hanged-man'
) ON CONFLICT (english_name) DO NOTHING;

-- 13. Death
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Death',
  'Ölüm',
  'Smrt',
  'major',
  NULL,
  13,
  '/images/tarot-cards/death.webp',
  'death',
  'death',
  'death'
) ON CONFLICT (english_name) DO NOTHING;

-- 14. Temperance
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Temperance',
  'Denge',
  'Umerenos',
  'major',
  NULL,
  14,
  '/images/tarot-cards/temperance.webp',
  'temperance',
  'temperance',
  'temperance'
) ON CONFLICT (english_name) DO NOTHING;

-- 15. The Devil
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Devil',
  'Şeytan',
  'Đavo',
  'major',
  NULL,
  15,
  '/images/tarot-cards/the-devil.webp',
  'the-devil',
  'the-devil',
  'the-devil'
) ON CONFLICT (english_name) DO NOTHING;

-- 16. The Tower
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Tower',
  'Kule',
  'Kula',
  'major',
  NULL,
  16,
  '/images/tarot-cards/the-tower.webp',
  'the-tower',
  'the-tower',
  'the-tower'
) ON CONFLICT (english_name) DO NOTHING;

-- 17. The Star
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Star',
  'Yıldız',
  'Zvezda',
  'major',
  NULL,
  17,
  '/images/tarot-cards/the-star.webp',
  'the-star',
  'the-star',
  'the-star'
) ON CONFLICT (english_name) DO NOTHING;

-- 18. The Moon
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Moon',
  'Ay',
  'Mesec',
  'major',
  NULL,
  18,
  '/images/tarot-cards/the-moon.webp',
  'the-moon',
  'the-moon',
  'the-moon'
) ON CONFLICT (english_name) DO NOTHING;

-- 19. The Sun
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The Sun',
  'Güneş',
  'Sunce',
  'major',
  NULL,
  19,
  '/images/tarot-cards/the-sun.webp',
  'the-sun',
  'the-sun',
  'the-sun'
) ON CONFLICT (english_name) DO NOTHING;

-- SKIP: judgment (mapping bulunamadı)
-- 20. The World
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'The World',
  'Dünya',
  'Svet',
  'major',
  NULL,
  21,
  '/images/tarot-cards/the-world.webp',
  'the-world',
  'the-world',
  'the-world'
) ON CONFLICT (english_name) DO NOTHING;

-- 21. Ace of Wands
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Ace of Wands',
  'Değnek 1',
  'ace Štapova',
  'minor',
  'wands',
  1,
  '/images/tarot-cards/ace-of-wands.webp',
  'ace-of-wands',
  'ace-of-wands',
  'ace-of-wands'
) ON CONFLICT (english_name) DO NOTHING;

-- SKIP: two-of-wands (mapping bulunamadı)
-- SKIP: three-of-wands (mapping bulunamadı)
-- SKIP: four-of-wands (mapping bulunamadı)
-- SKIP: five-of-wands (mapping bulunamadı)
-- SKIP: six-of-wands (mapping bulunamadı)
-- SKIP: seven-of-wands (mapping bulunamadı)
-- SKIP: eight-of-wands (mapping bulunamadı)
-- SKIP: nine-of-wands (mapping bulunamadı)
-- SKIP: ten-of-wands (mapping bulunamadı)
-- 22. Page of Wands
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Page of Wands',
  'Değnek 11',
  'page Štapova',
  'minor',
  'wands',
  11,
  '/images/tarot-cards/page-of-wands.webp',
  'page-of-wands',
  'page-of-wands',
  'page-of-wands'
) ON CONFLICT (english_name) DO NOTHING;

-- 23. Knight of Wands
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Knight of Wands',
  'Değnek 12',
  'knight Štapova',
  'minor',
  'wands',
  12,
  '/images/tarot-cards/knight-of-wands.webp',
  'knight-of-wands',
  'knight-of-wands',
  'knight-of-wands'
) ON CONFLICT (english_name) DO NOTHING;

-- 24. Ace of Pentacles
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Ace of Pentacles',
  'Tılsım 1',
  'ace Pentakla',
  'minor',
  'pentacles',
  1,
  '/images/tarot-cards/ace-of-pentacles.webp',
  'ace-of-pentacles',
  'ace-of-pentacles',
  'ace-of-pentacles'
) ON CONFLICT (english_name) DO NOTHING;

-- SKIP: two-of-pentacles (mapping bulunamadı)
-- SKIP: three-of-pentacles (mapping bulunamadı)
-- SKIP: four-of-pentacles (mapping bulunamadı)
-- SKIP: five-of-pentacles (mapping bulunamadı)
-- SKIP: six-of-pentacles (mapping bulunamadı)
-- SKIP: seven-of-pentacles (mapping bulunamadı)
-- SKIP: eight-of-pentacles (mapping bulunamadı)
-- SKIP: nine-of-pentacles (mapping bulunamadı)
-- SKIP: ten-of-pentacles (mapping bulunamadı)
-- 25. Page of Pentacles
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Page of Pentacles',
  'Tılsım 11',
  'page Pentakla',
  'minor',
  'pentacles',
  11,
  '/images/tarot-cards/page-of-pentacles.webp',
  'page-of-pentacles',
  'page-of-pentacles',
  'page-of-pentacles'
) ON CONFLICT (english_name) DO NOTHING;

-- 26. Knight of Pentacles
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Knight of Pentacles',
  'Tılsım 12',
  'knight Pentakla',
  'minor',
  'pentacles',
  12,
  '/images/tarot-cards/knight-of-pentacles.webp',
  'knight-of-pentacles',
  'knight-of-pentacles',
  'knight-of-pentacles'
) ON CONFLICT (english_name) DO NOTHING;

-- 27. Queen of Pentacles
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Queen of Pentacles',
  'Tılsım 13',
  'queen Pentakla',
  'minor',
  'pentacles',
  13,
  '/images/tarot-cards/queen-of-pentacles.webp',
  'queen-of-pentacles',
  'queen-of-pentacles',
  'queen-of-pentacles'
) ON CONFLICT (english_name) DO NOTHING;

-- 28. King of Pentacles
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'King of Pentacles',
  'Tılsım 14',
  'king Pentakla',
  'minor',
  'pentacles',
  14,
  '/images/tarot-cards/king-of-pentacles.webp',
  'king-of-pentacles',
  'king-of-pentacles',
  'king-of-pentacles'
) ON CONFLICT (english_name) DO NOTHING;

-- 29. Ace of Cups
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Ace of Cups',
  'Kupa 1',
  'ace Pehara',
  'minor',
  'cups',
  1,
  '/images/tarot-cards/ace-of-cups.webp',
  'ace-of-cups',
  'ace-of-cups',
  'ace-of-cups'
) ON CONFLICT (english_name) DO NOTHING;

-- SKIP: two-of-cups (mapping bulunamadı)
-- SKIP: three-of-cups (mapping bulunamadı)
-- SKIP: four-of-cups (mapping bulunamadı)
-- SKIP: five-of-cups (mapping bulunamadı)
-- SKIP: six-of-cups (mapping bulunamadı)
-- SKIP: seven-of-cups (mapping bulunamadı)
-- SKIP: eight-of-cups (mapping bulunamadı)
-- SKIP: nine-of-cups (mapping bulunamadı)
-- SKIP: ten-of-cups (mapping bulunamadı)
-- 30. Page of Cups
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Page of Cups',
  'Kupa 11',
  'page Pehara',
  'minor',
  'cups',
  11,
  '/images/tarot-cards/page-of-cups.webp',
  'page-of-cups',
  'page-of-cups',
  'page-of-cups'
) ON CONFLICT (english_name) DO NOTHING;

-- 31. Knight of Cups
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Knight of Cups',
  'Kupa 12',
  'knight Pehara',
  'minor',
  'cups',
  12,
  '/images/tarot-cards/knight-of-cups.webp',
  'knight-of-cups',
  'knight-of-cups',
  'knight-of-cups'
) ON CONFLICT (english_name) DO NOTHING;

-- 32. Queen of Cups
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Queen of Cups',
  'Kupa 13',
  'queen Pehara',
  'minor',
  'cups',
  13,
  '/images/tarot-cards/queen-of-cups.webp',
  'queen-of-cups',
  'queen-of-cups',
  'queen-of-cups'
) ON CONFLICT (english_name) DO NOTHING;

-- 33. King of Cups
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'King of Cups',
  'Kupa 14',
  'king Pehara',
  'minor',
  'cups',
  14,
  '/images/tarot-cards/king-of-cups.webp',
  'king-of-cups',
  'king-of-cups',
  'king-of-cups'
) ON CONFLICT (english_name) DO NOTHING;

-- 34. Ace of Swords
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Ace of Swords',
  'Kılıç 1',
  'ace Mačeva',
  'minor',
  'swords',
  1,
  '/images/tarot-cards/ace-of-swords.webp',
  'ace-of-swords',
  'ace-of-swords',
  'ace-of-swords'
) ON CONFLICT (english_name) DO NOTHING;

-- SKIP: two-of-swords (mapping bulunamadı)
-- SKIP: three-of-swords (mapping bulunamadı)
-- SKIP: four-of-swords (mapping bulunamadı)
-- SKIP: five-of-swords (mapping bulunamadı)
-- SKIP: six-of-swords (mapping bulunamadı)
-- SKIP: seven-of-swords (mapping bulunamadı)
-- SKIP: eight-of-swords (mapping bulunamadı)
-- SKIP: nine-of-swords (mapping bulunamadı)
-- SKIP: ten-of-swords (mapping bulunamadı)
-- 35. Page of Swords
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Page of Swords',
  'Kılıç 11',
  'page Mačeva',
  'minor',
  'swords',
  11,
  '/images/tarot-cards/page-of-swords.webp',
  'page-of-swords',
  'page-of-swords',
  'page-of-swords'
) ON CONFLICT (english_name) DO NOTHING;

-- 36. Knight of Swords
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Knight of Swords',
  'Kılıç 12',
  'knight Mačeva',
  'minor',
  'swords',
  12,
  '/images/tarot-cards/knight-of-swords.webp',
  'knight-of-swords',
  'knight-of-swords',
  'knight-of-swords'
) ON CONFLICT (english_name) DO NOTHING;

-- 37. Queen of Swords
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Queen of Swords',
  'Kılıç 13',
  'queen Mačeva',
  'minor',
  'swords',
  13,
  '/images/tarot-cards/queen-of-swords.webp',
  'queen-of-swords',
  'queen-of-swords',
  'queen-of-swords'
) ON CONFLICT (english_name) DO NOTHING;

-- 38. King of Swords
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'King of Swords',
  'Kılıç 14',
  'king Mačeva',
  'minor',
  'swords',
  14,
  '/images/tarot-cards/king-of-swords.webp',
  'king-of-swords',
  'king-of-swords',
  'king-of-swords'
) ON CONFLICT (english_name) DO NOTHING;

-- 39. Queen of Wands
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'Queen of Wands',
  'Değnek 13',
  'queen Štapova',
  'minor',
  'wands',
  13,
  '/images/tarot-cards/queen-of-wands.webp',
  'queen-of-wands',
  'queen-of-wands',
  'queen-of-wands'
) ON CONFLICT (english_name) DO NOTHING;

-- 40. King of Wands
INSERT INTO public.tarot_cards (
  english_name, turkish_name, serbian_name, arcana_type,
  suit, number, image_url, slug_tr, slug_en, slug_sr
) VALUES (
  'King of Wands',
  'Değnek 14',
  'king Štapova',
  'minor',
  'wands',
  14,
  '/images/tarot-cards/king-of-wands.webp',
  'king-of-wands',
  'king-of-wands',
  'king-of-wands'
) ON CONFLICT (english_name) DO NOTHING;

-- ========================================
-- Toplam: 40 kart eklendi
-- Atlanan: 38 kart
-- ========================================
