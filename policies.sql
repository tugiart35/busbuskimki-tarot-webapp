-- ============================================================================
-- DÜZELTİLMİŞ RLS POLİTİKALARI - SONSUZ DÖNGÜ SORUNU ÇÖZÜLDÜ
-- ============================================================================
-- Sorun: Admin politikaları profiles tablosunu sorgulayarak sonsuz döngü yaratıyordu
-- Çözüm: admins tablosunu kullanarak döngüsel bağımlılığı kırdık
-- Tarih: 2025-01-11
-- ============================================================================

-- Row-Level Security (RLS) policies
-- Note: Supabase service role bypasses RLS; client roles `anon` and `authenticated` are enforced.

-- Helper notes
-- auth.uid() returns current user id (uuid) for authenticated role
-- auth.role() returns token role: 'anon' | 'authenticated' | 'service_role'

-- ============================================================================
-- ÖNCE TÜM POLİTİKALARI TEMİZLE
-- ============================================================================

-- PROFILES policies cleanup
DROP POLICY IF EXISTS profiles_select_self ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_self ON public.profiles;
DROP POLICY IF EXISTS profiles_update_self ON public.profiles;
DROP POLICY IF EXISTS profiles_admin_read ON public.profiles;
DROP POLICY IF EXISTS profiles_admin_manage ON public.profiles;

-- ADMINS policies cleanup
DROP POLICY IF EXISTS admins_read_self ON public.admins;
DROP POLICY IF EXISTS admins_select_self ON public.admins;
DROP POLICY IF EXISTS admins_insert_admin ON public.admins;
DROP POLICY IF EXISTS admins_update_admin ON public.admins;

-- READINGS policies cleanup
DROP POLICY IF EXISTS readings_owner_all ON public.readings;
DROP POLICY IF EXISTS readings_admin_all ON public.readings;

-- ============================================================================
-- PROFILES POLİTİKALARI (DÜZELTİLDİ)
-- ============================================================================

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Read own profile
CREATE POLICY profiles_select_self
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Insert own profile (upsert on sign-up)
CREATE POLICY profiles_insert_self
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Update own profile
CREATE POLICY profiles_update_self
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admins can read all profiles (admins tablosunu kullanarak döngü kırıldı)
CREATE POLICY profiles_admin_read
ON public.profiles FOR SELECT
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- Admins can manage all profiles
CREATE POLICY profiles_admin_manage
ON public.profiles FOR ALL
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- ============================================================================
-- ADMINS POLİTİKALARI (DÜZELTİLDİ - SONSUZ DÖNGÜ KIRILDI)
-- ============================================================================

-- ADMINS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Adminler kendi admin kayıtlarını görebilir (DÖNGÜ KIRILDI)
CREATE POLICY admins_select_self
ON public.admins FOR SELECT
USING (user_id = auth.uid());

-- Adminler yeni admin ekleyebilir (sadece mevcut adminler)
CREATE POLICY admins_insert_admin
ON public.admins FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- Adminler admin kayıtlarını güncelleyebilir
CREATE POLICY admins_update_admin
ON public.admins FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));

-- ============================================================================
-- READINGS POLİTİKALARI
-- ============================================================================

-- READINGS
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;

-- Owner can CRUD own readings
CREATE POLICY readings_owner_all
ON public.readings FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Admins can manage all readings
CREATE POLICY readings_admin_all
ON public.readings FOR ALL
USING (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()));