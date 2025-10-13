-- ================================================================================
-- KRİTİK GÜVENLİK DÜZELTMELERİ - ACİL UYGULANMALI!
-- ================================================================================
-- Tarih: 2025-10-13
-- Amaç: RLS güvenlik sorunlarını düzelt
-- Süre: ~5 dakika
-- Risk: Düşük (sadece güvenliği arttırıyor)
-- ================================================================================

-- ÖNEMLI: Bu script'i çalıştırmadan ÖNCE BACKUP ALIN!
-- Komut: supabase db dump -f backup-before-rls-fix.sql

-- ================================================================================
-- ADIM 1: RLS AKTİFLEŞTİRME (5 TABLO)
-- ================================================================================

-- readings tablosu - Kullanıcı okumaları
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.readings IS 'RLS enabled on 2025-10-13 - Critical security fix';

-- transactions tablosu - Kredi işlemleri
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.transactions IS 'RLS enabled on 2025-10-13 - Critical security fix';

-- packages tablosu - Kredi paketleri
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.packages IS 'RLS enabled on 2025-10-13 - Critical security fix';

-- spreads tablosu - Tarot açılımları
ALTER TABLE public.spreads ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.spreads IS 'RLS enabled on 2025-10-13 - Critical security fix';

-- admin_logs tablosu - Admin logları
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.admin_logs IS 'RLS enabled on 2025-10-13 - Critical security fix';

-- ================================================================================
-- ADIM 2: admin_logs İÇİN POLİTİKA EKLEME
-- ================================================================================

-- Admin_logs için sadece adminler erişebilir politikası
DROP POLICY IF EXISTS "admin_logs_admin_only" ON public.admin_logs;

CREATE POLICY "admin_logs_admin_only" ON public.admin_logs
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

COMMENT ON POLICY "admin_logs_admin_only" ON public.admin_logs IS 
'Only admins can access admin logs - Created 2025-10-13';

-- ================================================================================
-- ADIM 3: DOĞRULAMA SORGUSU
-- ================================================================================

-- RLS durumunu kontrol et
SELECT 
  tablename, 
  rowsecurity as rls_enabled,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as status
FROM pg_tables 
WHERE schemaname = 'public'
  AND tablename IN ('readings', 'transactions', 'packages', 'spreads', 'admin_logs')
ORDER BY tablename;

-- Beklenen sonuç: Tüm 5 tablo için rls_enabled = true

-- ================================================================================
-- ADIM 4: POLİTİKA KONTROLÜ
-- ================================================================================

-- Her tablonun kaç politikası olduğunu kontrol et
SELECT 
  schemaname,
  tablename,
  COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('readings', 'transactions', 'packages', 'spreads', 'admin_logs')
GROUP BY schemaname, tablename
ORDER BY tablename;

-- Beklenen minimum politika sayıları:
-- readings: 2+
-- transactions: 2+
-- packages: 1+
-- spreads: 1+
-- admin_logs: 1

-- ================================================================================
-- YEDEK: GERI ALMA (Sadece sorun olursa kullan!)
-- ================================================================================

-- NOT: Normal şartlarda bu komutları ÇALIŞTIRMAYIN!
-- Sadece ciddi bir sorun olursa ve geri almak gerekirse kullanın.

/*
-- RLS'i geri kapat (TEHLİKELİ - kullanma!)
ALTER TABLE public.readings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.spreads DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs DISABLE ROW LEVEL SECURITY;

-- admin_logs politikasını sil
DROP POLICY IF EXISTS "admin_logs_admin_only" ON public.admin_logs;
*/

-- ================================================================================
-- TAMAMLANDI!
-- ================================================================================

-- Sonraki adımlar:
-- 1. Bu script'i Supabase SQL Editor'de çalıştır
-- 2. Doğrulama sorgularını kontrol et (tüm tablolar ✅ olmalı)
-- 3. Test kullanıcısı ile giriş yap ve erişimi test et
-- 4. Admin panelinden admin_logs erişimini test et
-- 5. 07_DB_PERFORMANCE_FIX.sql scriptini çalıştır (opsiyonel)

SELECT 'RLS Critical Fix Applied Successfully! ✅' as status;

