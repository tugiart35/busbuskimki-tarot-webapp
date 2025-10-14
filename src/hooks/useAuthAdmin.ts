'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuthBase, type AuthUser } from '@/hooks/shared/useAuthBase';

interface AdminUser extends AuthUser {
  id: string;
  email: string;
  is_admin: boolean;
  display_name: string;
}

export function useAuthAdmin() {
  const { loading } = useAuthBase<AdminUser>();
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  // Admin session'ını temizle
  const clearAdminSession = useCallback(async () => {
    setAdmin(null);
    await supabase.auth.signOut();
  }, []);

  // Admin girişi yap
  const loginAdmin = useCallback(async (email: string, password: string) => {
    try {
      // Production için tüm geliştirme modu kodları kaldırıldı

      // Supabase admin kontrolü - güvenli authentication

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Supabase giriş hatası
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Supabase giriş başarılı, admin kontrolü yapılıyor

        // Admin kontrolü yap - önce admins tablosundan kontrol et
        const { data: adminRecord, error: adminError } = await supabase
          .from('admins')
          .select('user_id')
          .eq('user_id', data.user.id)
          .single();

        if (adminError || !adminRecord) {
          // Admin yetkisi yok, çıkış yapılıyor
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Bu hesap admin yetkisine sahip değil.',
          };
        }

        // Admin ise profile bilgilerini çek
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('id, email, display_name')
          .eq('id', data.user.id)
          .single();

        if (profileError || !profile) {
          await supabase.auth.signOut();
          return {
            success: false,
            error: 'Profil bilgileri alınamadı.',
          };
        }

        // Supabase admin girişi başarılı

        // Başarılı admin girişi
        const adminUser: AdminUser = {
          id: profile.id,
          email: profile.email,
          is_admin: true,
          display_name: profile.display_name,
        };

        setAdmin(adminUser);
        return { success: true, error: null };
      }

      return { success: false, error: 'Kullanıcı bulunamadı.' };
    } catch (error) {
      console.error('Admin login error:', error);
      return { success: false, error: 'Giriş sırasında bir hata oluştu.' };
    }
  }, []);

  // Admin çıkışı yap
  const logoutAdmin = useCallback(async () => {
    try {
      await clearAdminSession();
      return { success: true };
    } catch (error) {
      console.error('Admin logout error:', error);
      return { success: false, error: 'Çıkış sırasında bir hata oluştu.' };
    }
  }, [clearAdminSession]);

  // İlk yükleme kontrolü - Supabase session'ını kontrol et
  useEffect(() => {
    const initializeAdmin = async () => {
      try {
        // Mevcut Supabase session'ını kontrol et
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {

          // Admin kontrolü yap - önce admins tablosundan kontrol et
          const { data: adminRecord } = await supabase
            .from('admins')
            .select('user_id')
            .eq('user_id', session.user.id)
            .single();

          // Admin değilse hiçbir şey yapma
          if (!adminRecord) {
            return;
          }

          // Admin ise profile bilgilerini çek
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('id, email, display_name')
            .eq('id', session.user.id)
            .single();

          if (!profileError && profile) {
            const adminUser: AdminUser = {
              id: profile.id,
              email: profile.email,
              is_admin: true,
              display_name: profile.display_name,
            };
            setAdmin(adminUser);
          }
        }
      } catch (error) {
        console.error('Session initialize error:', error);
      }
    };

    initializeAdmin();
  }, []);

  return {
    admin,
    loading,
    isAuthenticated: !!admin, // Admin varsa authenticated kabul et
    loginAdmin,
    logoutAdmin,
    clearAdminSession,
  };
}
