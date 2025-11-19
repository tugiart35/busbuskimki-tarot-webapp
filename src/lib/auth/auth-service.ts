/*
 * Auth Service Class
 *
 * Bu dosya authentication işlemleri için business logic'i içerir.
 * Supabase auth operasyonlarını merkezi olarak yönetir.
 */

import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';
import type { RegisterFormData } from './auth-validation';

// AuthError class tanımı
export class AuthError extends Error {
  constructor(
    message: string,
    public _originalError?: any,
    public _code?: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

// Rate limit error class - DEVRE DIŞI
// export class RateLimitError extends AuthError {
//   constructor(message: string, public retryAfter?: number) {
//     super(message);
//     this.name = 'RateLimitError';
//     this.code = 'RATE_LIMIT_EXCEEDED';
//   }
// }

export class AuthService {
  /**
   * Rate limit kontrolü ve yönetimi - DEVRE DIŞI
   */
  // private static isRateLimitError(error: any): boolean {
  //   return error.message?.includes('rate limit') ||
  //          error.message?.includes('rate limit exceeded') ||
  //          error.message?.includes('too many requests') ||
  //          error.status === 429 ||
  //          error.statusCode === 429;
  // }

  // /**
  //  * Rate limit hatası için kullanıcı dostu mesaj
  //  */
  // private static getRateLimitMessage(): string {
  //   return 'Çok fazla kayıt denemesi yapıldı. Lütfen 5-10 dakika bekleyip tekrar deneyin veya farklı bir email adresi kullanın.';
  // }

  /**
   * Email ve şifre ile giriş yapma
   */
  static async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new AuthError(error.message, error);
      }

      // Giriş başarılıysa profile kontrolü yap
      if (data.user) {
        try {
          const { ensureProfileExists } = await import(
            '@/lib/utils/profile-utils'
          );

          const profileResult = await ensureProfileExists(data.user);

          if (!profileResult.success) {
            // eslint-disable-next-line no-console
            console.warn('Profile kontrolü başarısız:', profileResult.error);
            // Profile sorunu giriş işlemini etkilemez
          }
        } catch (profileError) {
          // eslint-disable-next-line no-console
          console.warn('Profile kontrol hatası:', profileError);
          // Profile hatası giriş işlemini etkilemez
        }
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Yeni kullanıcı kaydı
   */
  static async signUp(userData: RegisterFormData) {
    try {
      // Check for referral code in URL
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');

      // Prepare user metadata
      const userMetadata: Record<string, any> = {
        first_name: userData.name,
        last_name: userData.surname,
        birth_date: userData.birthDate,
        gender: userData.gender,
      };

      // Add referral code if present
      if (referralCode) {
        userMetadata.referral_code = referralCode;
      }

      // Supabase auth signup işlemi
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: userMetadata,
          // Email confirmation için callback URL'i ayarla
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        // eslint-disable-next-line no-console
        console.error('SignUp error:', error);

        // Rate limit hatası kontrolü - DEVRE DIŞI
        // if (this.isRateLimitError(error)) {
        //   throw new RateLimitError(
        //     this.getRateLimitMessage(),
        //     300 // 5 dakika
        //   );
        // }

        // Diğer hatalar için normal işlem
        throw new AuthError(error.message, error, error.status?.toString());
      }

      // NOT: Profile oluşturma işlemi database trigger (handle_new_user) tarafından
      // otomatik olarak yapılıyor. Client-side'dan manuel deneme yapılmıyor çünkü:
      // 1. Kullanıcı henüz tam authenticate olmamış olabilir
      // 2. RLS politikaları bu durumda çalışmayabilir
      // 3. Trigger SECURITY DEFINER ile çalıştığı için RLS'i bypass ediyor
      // Profile bilgileri user_metadata'dan trigger tarafından otomatik alınıyor

      return data;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('SignUp genel hatası:', error);

      // Hata tipine göre işlem
      if (error instanceof AuthError) {
        throw error;
      }

      throw new AuthError(
        error instanceof Error ? error.message : 'Bilinmeyen hata oluştu',
        error
      );
    }
  }

  /**
   * Şifre sıfırlama e-postası gönderme
   */
  static async resetPassword(email: string, locale: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/${locale}/auth/reset-password`,
      });

      if (error) {
        throw new AuthError(error.message, error);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Google ile OAuth girişi
   */
  static async signInWithGoogle(locale: string, referralCode?: string) {
    try {
      // Store referral code in cookie if present (for OAuth callback)
      if (referralCode && typeof document !== 'undefined') {
        document.cookie = `oauth_referral_code=${referralCode}; path=/; max-age=600; SameSite=Lax`;
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?locale=${locale}`,
        },
      });

      if (error) {
        throw new AuthError(error.message, error);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Facebook ile OAuth girişi
   */
  static async signInWithFacebook(locale: string, referralCode?: string) {
    try {
      // Locale'i cookie'ye kaydet (callback route'da okumak için)
      if (typeof document !== 'undefined') {
        document.cookie = `oauth_locale=${locale}; path=/; max-age=600; SameSite=Lax`;
        // Store referral code in cookie if present
        if (referralCode) {
          document.cookie = `oauth_referral_code=${referralCode}; path=/; max-age=600; SameSite=Lax`;
        }
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?locale=${locale}`,
          scopes: 'email',
          // ❌ KALDIRILDI: access_type ve prompt Google OAuth parametreleri
          // queryParams: {
          //   access_type: 'offline',
          //   prompt: 'consent',
          // },
        },
      });

      if (error) {
        throw new AuthError(error.message, error);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Çıkış yapma
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new AuthError(error.message, error);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mevcut kullanıcı session'ını alma
   */
  static async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw new AuthError(error.message, error);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Auth state değişikliklerini dinleme
   */
  static onAuthStateChange(
    callback: (_event: string, _session: Session | null) => void
  ) {
    return supabase.auth.onAuthStateChange(callback);
  }

  /**
   * Session'ı yenileme
   */
  static async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();

      if (error) {
        throw new AuthError(error.message, error);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  /**
   * E-posta onaylama
   */
  static async resendConfirmation(email: string) {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        // eslint-disable-next-line no-console
        console.error('Resend error:', error);
        throw new AuthError(error.message, error);
      }

      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Resend confirmation catch block:', error);
      throw error;
    }
  }
}
