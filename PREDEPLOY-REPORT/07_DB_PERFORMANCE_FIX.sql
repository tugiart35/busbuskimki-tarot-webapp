-- ================================================================================
-- PERFORMANS OPTİMİZASYONLARI
-- ================================================================================
-- Tarih: 2025-10-13
-- Amaç: Database performansını artır
-- Süre: ~10 dakika
-- Risk: Düşük
-- ÖNCEKİ GEREKSINIM: 07_DB_CRITICAL_FIX.sql uygulanmış olmalı!
-- ================================================================================

-- ÖNEMLI: Bu script'i çalıştırmadan ÖNCE BACKUP ALIN!

-- ================================================================================
-- ADIM 1: DUPLİKAT INDEX TEMİZLİĞİ
-- ================================================================================

-- profiles tablosundaki duplicate index'leri kaldır
DROP INDEX IF EXISTS public.profiles_email_idx;
DROP INDEX IF EXISTS public.profiles_email_unique;

COMMENT ON TABLE public.profiles IS 'Duplicate indexes removed on 2025-10-13';

-- ================================================================================
-- ADIM 2: EKSİK INDEX EKLEME
-- ================================================================================

-- card_pages için foreign key index
CREATE INDEX IF NOT EXISTS idx_card_pages_card_id 
ON public.card_pages(card_id);

COMMENT ON INDEX public.idx_card_pages_card_id IS 
'Added for foreign key performance - 2025-10-13';

-- ================================================================================
-- ADIM 3: RLS POLİTİKA OPTİMİZASYONU
-- ================================================================================

-- profiles tablosu - auth.uid() optimizasyonu
-- Mevcut politikaları yeniden oluştur

-- Okuma politikası
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT
USING ((SELECT auth.uid()) = id);

-- Güncelleme politikası
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- Ekleme politikası
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT
WITH CHECK ((SELECT auth.uid()) = id);

-- Admin yönetim politikası
DROP POLICY IF EXISTS "profiles_admin_manage" ON public.profiles;
CREATE POLICY "profiles_admin_manage" ON public.profiles
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE user_id = (SELECT auth.uid())
  )
);

-- admins tablosu - auth.uid() optimizasyonu
DROP POLICY IF EXISTS "admins_select_self" ON public.admins;
CREATE POLICY "admins_select_self" ON public.admins
FOR SELECT
USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "admins_insert_admin" ON public.admins;
CREATE POLICY "admins_insert_admin" ON public.admins
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins a 
    WHERE a.user_id = (SELECT auth.uid())
  )
);

DROP POLICY IF EXISTS "admins_update_admin" ON public.admins;
CREATE POLICY "admins_update_admin" ON public.admins
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.admins a 
    WHERE a.user_id = (SELECT auth.uid())
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins a 
    WHERE a.user_id = (SELECT auth.uid())
  )
);

-- system_performance tablosu
DROP POLICY IF EXISTS "Admins can read system performance" ON public.system_performance;
CREATE POLICY "Admins can read system performance" ON public.system_performance
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = (SELECT auth.uid()) 
    AND profiles.is_admin = true
  )
);

DROP POLICY IF EXISTS "Admins can insert system performance" ON public.system_performance;
CREATE POLICY "Admins can insert system performance" ON public.system_performance
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = (SELECT auth.uid()) 
    AND profiles.is_admin = true
  )
);

-- system_settings tablosu
DROP POLICY IF EXISTS "Allow admin write access to system_settings" ON public.system_settings;
CREATE POLICY "Allow admin write access to system_settings" ON public.system_settings
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = (SELECT auth.uid()) 
    AND profiles.is_admin = true
  )
);

-- ================================================================================
-- ADIM 4: FUNCTION GÜVENLİK OPTİMİZASYONU
-- ================================================================================

-- update_transaction_status fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.update_transaction_status(
  transaction_id uuid,
  new_status text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.transactions
  SET status = new_status
  WHERE id = transaction_id;
END;
$$;

COMMENT ON FUNCTION public.update_transaction_status IS 
'Updated with secure search_path - 2025-10-13';

-- handle_new_user fonksiyonunu güvenli hale getir
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', 'Kullanıcı')
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$;

COMMENT ON FUNCTION public.handle_new_user IS 
'Updated with secure search_path - 2025-10-13';

-- ================================================================================
-- ADIM 5: SYSTEM_PERFORMANCE CLEANUP
-- ================================================================================

-- 30 günden eski performans loglarını sil
DELETE FROM public.system_performance 
WHERE created_at < NOW() - INTERVAL '30 days';

-- Cleanup sonucunu göster
SELECT 
  COUNT(*) as remaining_rows,
  MIN(created_at) as oldest_record,
  MAX(created_at) as newest_record
FROM public.system_performance;

-- ================================================================================
-- ADIM 6: VACUUM VE ANALYZE
-- ================================================================================

-- Silinen kayıtlar için disk alanını geri al ve istatistikleri güncelle
VACUUM ANALYZE public.system_performance;
VACUUM ANALYZE public.profiles;
VACUUM ANALYZE public.readings;
VACUUM ANALYZE public.transactions;

-- ================================================================================
-- ADIM 7: DOĞRULAMA
-- ================================================================================

-- Index durumunu kontrol et
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as usage_count
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND tablename IN ('profiles', 'card_pages')
ORDER BY tablename, indexname;

-- Politika sayısını kontrol et
SELECT 
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY tablename;

-- ================================================================================
-- ADIM 8: OPSİYONEL - KULLANILMAYAN INDEX TEMİZLİĞİ
-- ================================================================================

-- UYARI: Bu adım opsiyonel! Sadece index kullanımını analiz ettikten sonra uygula
-- Production'da bir süre çalıştır ve gerçekten kullanılmadığından emin ol

/*
-- Tarot card indexleri (kullanılmıyor olabilir)
DROP INDEX IF EXISTS public.idx_tarot_cards_arcana_type;
DROP INDEX IF EXISTS public.idx_tarot_cards_suit;
DROP INDEX IF EXISTS public.idx_card_content_locale;
DROP INDEX IF EXISTS public.idx_card_seo_card_id;
DROP INDEX IF EXISTS public.idx_card_seo_locale;
DROP INDEX IF EXISTS public.idx_card_pages_locale_slug;
DROP INDEX IF EXISTS public.idx_card_pages_path;
DROP INDEX IF EXISTS public.idx_card_pages_active;

-- Diğer kullanılmayan indexler
DROP INDEX IF EXISTS public.idx_packages_active;
DROP INDEX IF EXISTS public.idx_spreads_active;
DROP INDEX IF EXISTS public.idx_spreads_category;
DROP INDEX IF EXISTS public.idx_profiles_is_admin;
DROP INDEX IF EXISTS public.idx_readings_contact_method;
DROP INDEX IF EXISTS public.profiles_display_name_idx;
DROP INDEX IF EXISTS public.profiles_created_at_idx;
*/

-- ================================================================================
-- TAMAMLANDI!
-- ================================================================================

SELECT 'Performance Optimizations Applied Successfully! ⚡' as status;

-- Sonraki adımlar:
-- 1. Uygulama performansını izle
-- 2. Supabase Dashboard > Database > Performance sekmesini kontrol et
-- 3. Yavaş sorgular varsa Index Strategy'yi gözden geçir
-- 4. RLS policy performansını monitoring et
-- 5. Bir hafta sonra kullanılmayan index'leri tekrar kontrol et

-- Performans metriklerini kontrol et:
-- Dashboard: https://supabase.com/dashboard > Project > Database > Query Performance

