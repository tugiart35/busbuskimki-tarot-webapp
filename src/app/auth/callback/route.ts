/*
 * OAuth/Email Callback Route - Next.js 14 App Router
 *
 * Bağlı dosyalar:
 * - src/lib/supabase/server.ts (server client)
 * - src/middleware.ts (auth middleware)
 *
 * Dosya amacı:
 * OAuth ve email confirmation callback'lerini işler
 * Supabase auth flow'unu tamamlar
 *
 * Supabase değişkenleri ve tablolar:
 * - auth.users: Supabase auth tablosu
 * - profiles: kullanıcı profilleri (opsiyonel)
 *
 * Geliştirme önerileri:
 * - Error handling iyileştirilebilir
 * - Logging eklenebilir
 * - Rate limiting eklenebilir
 *
 * Tespit edilen hatalar:
 * - ✅ Callback route oluşturuldu
 * - ✅ Locale-aware redirect eklendi
 *
 * Kullanım durumu:
 * - ✅ Gerekli: OAuth ve email confirmation için
 * - ✅ Production-ready: Next.js 14 App Router uyumlu
 */

import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { RedirectUtils } from '@/lib/utils/redirect-utils';
import { extractLocaleFromRequest } from '@/lib/utils/locale-utils';
import { AdminDetectionService } from '@/lib/services/admin-detection-service';
import { AuthErrorService } from '@/lib/services/auth-error-service';
import { logger } from '@/lib/logger';

// Feature flag: Facebook login - aktif
const ENABLE_FACEBOOK_LOGIN = true;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const error = searchParams.get('error');
  const errorCode = searchParams.get('error_code');
  const errorDescription = searchParams.get('error_description');
  const locale = extractLocaleFromRequest(request);

  // OAuth error parametrelerini kontrol et (Supabase redirect'inden gelen hatalar)
  if (error) {
    logger.error('OAuth redirect error', new Error(errorDescription || error), {
      action: 'oauth_redirect_error',
      resource: 'auth',
      metadata: {
        error,
        errorCode,
        errorDescription,
        locale,
      },
    });

    // Database error saving new user hatası için özel işlem
    if (
      error === 'server_error' &&
      errorCode === 'unexpected_failure' &&
      errorDescription?.includes('Database error saving new user')
    ) {
      // Bu hata genellikle RLS politikaları veya trigger sorunlarından kaynaklanır
      // Kullanıcıyı auth sayfasına yönlendir ve açıklayıcı bir mesaj göster
      return AuthErrorService.handleCallbackError(
        new Error(
          'Kullanıcı kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin veya farklı bir giriş yöntemi kullanın.'
        ),
        locale
      );
    }

    // Diğer OAuth hataları için genel error handling
    return AuthErrorService.handleCallbackError(
      new Error(errorDescription || error || 'OAuth hatası oluştu'),
      locale
    );
  }

  if (code || token_hash) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Server Component'ten çağrıldığında ignore edilebilir
            }
          },
        },
      }
    );

    try {
      let error;
      let result;

      if (token_hash && type) {
        // PKCE flow - email confirmation için
        result = await supabase.auth.verifyOtp({
          type: type as any,
          token_hash,
        });
        error = result.error;
      } else if (code) {
        // OAuth flow
        result = await supabase.auth.exchangeCodeForSession(code);
        error = result.error;
      } else {
        // Code veya token_hash yoksa hata
        return AuthErrorService.handleCallbackError(
          new Error('No authorization code or token provided'),
          locale
        );
      }

      // Error kontrolü - KRİTİK DÜZELTME
      if (error) {
        logger.error('OAuth callback error', error, {
          action: 'oauth_callback_error',
          resource: 'auth',
        });
        return AuthErrorService.handleCallbackError(error, locale);
      }

      // OAuth locale ve referral code'u cookie'den oku (eğer varsa)
      let oauthLocale = locale;
      let referralCode: string | null = null;
      const cookieHeader = request.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce(
          (acc, cookie) => {
            const [key, value] = cookie.trim().split('=');
            if (key && value) {
              acc[key] = value;
            }
            return acc;
          },
          {} as Record<string, string>
        );

        if (cookies.oauth_locale) {
          oauthLocale = cookies.oauth_locale as typeof locale;
          // Cookie'yi temizle (tek kullanımlık)
          cookieStore.set('oauth_locale', '', {
            path: '/',
            maxAge: 0,
            sameSite: 'lax',
          });
        }

        if (cookies.oauth_referral_code) {
          referralCode = cookies.oauth_referral_code;
          // Cookie'yi temizle (tek kullanımlık)
          cookieStore.set('oauth_referral_code', '', {
            path: '/',
            maxAge: 0,
            sameSite: 'lax',
          });
        }
      }

      // Kullanıcı bilgilerini al
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // OAuth referral code'u user metadata'ya ekle (eğer yeni kullanıcıysa ve referral code varsa)
      // Bu, handle_new_user() trigger'ının referral bonus vermesini sağlar
      if (user && referralCode && user.created_at) {
        const userCreatedAt = new Date(user.created_at);
        const now = new Date();
        const timeDiff = now.getTime() - userCreatedAt.getTime();
        const minutesDiff = timeDiff / (1000 * 60);

        // Eğer kullanıcı son 5 dakika içinde oluşturulmuşsa ve metadata'da referral_code yoksa ekle
        if (minutesDiff < 5 && !user.user_metadata?.referral_code) {
          try {
            await supabase.auth.updateUser({
              data: {
                ...user.user_metadata,
                referral_code: referralCode,
              },
            });
            logger.info('Referral code added to user metadata', {
              action: 'referral_code_metadata_added',
              resource: 'auth',
              metadata: {
                userId: user.id,
                referralCode,
              },
            });
          } catch (updateError) {
            // Metadata güncelleme hatası kritik değil, callback route'da manuel işlenecek
            logger.warn('Failed to update user metadata with referral code', {
              action: 'referral_code_metadata_update_failed',
              resource: 'auth',
              metadata: {
                userId: user.id,
                referralCode,
                error: updateError,
              },
            });
          }
        }
      }

      if (user) {
        // Facebook login kontrolü - feature flag kapalıysa reddet
        if (
          user.app_metadata?.provider === 'facebook' &&
          !ENABLE_FACEBOOK_LOGIN
        ) {
          logger.warn('Facebook login attempt blocked', {
            action: 'facebook_login_blocked',
            resource: 'auth',
            metadata: {
              userId: user.id,
              email: user.email,
            },
          });
          return AuthErrorService.handleCallbackError(
            new Error('Facebook login şu anda kullanılamıyor.'),
            locale
          );
        }

        // Profile kontrolü ve oluşturma - Server-side client ile
        try {
          const { ensureProfileExists } = await import(
            '@/lib/utils/profile-utils'
          );

          // Google OAuth'dan gelen kullanıcı bilgilerini logla (debug için)
          logger.info('OAuth user metadata', {
            action: 'oauth_user_metadata',
            resource: 'auth',
            metadata: {
              id: user.id,
              email: user.email,
              metadata: user.user_metadata,
              provider: user.app_metadata?.provider,
            },
          });

          // Server-side supabase client'ı geç
          const profileResult = await ensureProfileExists(user, supabase);

          if (!profileResult.success) {
            logger.error(
              'Profile kontrolü başarısız',
              new Error(profileResult.error || 'Unknown profile error'),
              {
                action: 'profile_creation_failed',
                resource: 'profiles',
                metadata: {
                  userId: user.id,
                  email: user.email,
                  error: profileResult.error,
                },
              }
            );

            // Tüm profile hatalarını kritik olarak işle
            // Çünkü profile olmadan kullanıcı sistemi kullanamaz
            return AuthErrorService.handleCallbackError(
              new Error(
                profileResult.error ||
                  'Profil oluşturulamadı. Lütfen tekrar deneyin.'
              ),
              locale
            );
          }

          logger.info('Profile başarıyla oluşturuldu/güncellendi', {
            action: 'profile_created',
            resource: 'profiles',
            metadata: {
              userId: user.id,
              profileId: profileResult.profile?.id,
            },
          });

          // Handle referral code for OAuth users (fallback - trigger should handle it)
          // Check if user was just created (within last 5 minutes) and referral code exists
          // This is a fallback in case the trigger didn't process the referral
          if (referralCode && user.created_at) {
            const userCreatedAt = new Date(user.created_at);
            const now = new Date();
            const timeDiff = now.getTime() - userCreatedAt.getTime();
            const minutesDiff = timeDiff / (1000 * 60);

            // If user was created in last 5 minutes, check if referral bonus was given
            if (minutesDiff < 5) {
              try {
                // Get referrer's profile ID
                const { data: referrerProfile } = await supabase
                  .from('profiles')
                  .select('id')
                  .eq('referral_code', referralCode)
                  .single();

                if (referrerProfile) {
                  // Check if referral bonus already given (by trigger or previous callback)
                  const { data: existingTx } = await supabase
                    .from('transactions')
                    .select('id')
                    .eq('user_id', referrerProfile.id)
                    .eq('ref_type', 'referral_bonus')
                    .eq('ref_id', user.id)
                    .maybeSingle();

                  // Only grant bonus if it wasn't already given
                  if (!existingTx) {
                    // Get current balance and add 1 credit to referrer
                    const { data: currentProfile } = await supabase
                      .from('profiles')
                      .select('credit_balance')
                      .eq('id', referrerProfile.id)
                      .single();

                    if (currentProfile) {
                      await supabase
                        .from('profiles')
                        .update({ credit_balance: (currentProfile.credit_balance || 0) + 1 })
                        .eq('id', referrerProfile.id);

                      // Log referral bonus transaction
                      await supabase.from('transactions').insert({
                        user_id: referrerProfile.id,
                        type: 'bonus',
                        amount: 1,
                        delta_credits: 1,
                        description: 'Referral bonusu - Arkadaşınız kayıt oldu',
                        ref_type: 'referral_bonus',
                        ref_id: user.id,
                      });

                      logger.info('Referral bonus granted (fallback)', {
                        action: 'referral_bonus_granted_fallback',
                        resource: 'profiles',
                        metadata: {
                          referrerId: referrerProfile.id,
                          newUserId: user.id,
                          referralCode,
                        },
                      });
                    }
                  } else {
                    logger.info('Referral bonus already granted', {
                      action: 'referral_bonus_already_exists',
                      resource: 'profiles',
                      metadata: {
                        referrerId: referrerProfile.id,
                        newUserId: user.id,
                        referralCode,
                      },
                    });
                  }
                }
              } catch (referralError) {
                // Log error but don't fail the callback
                logger.error('Error handling referral bonus', referralError, {
                  action: 'referral_bonus_error',
                  resource: 'profiles',
                  metadata: {
                    userId: user.id,
                    referralCode,
                  },
                });
              }
            }
          }

          // Welcome email gönder (sadece yeni kullanıcılar için)
          if (profileResult.profile) {
            const profileCreatedAt = new Date(profileResult.profile.created_at);
            const now = new Date();
            const timeDiff = now.getTime() - profileCreatedAt.getTime();
            const minutesDiff = timeDiff / (1000 * 60);

            // Eğer profile son 5 dakika içinde oluşturulduysa welcome email gönder
            if (minutesDiff < 5) {
              try {
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
                const supabaseServiceKey =
                  process.env.SUPABASE_SERVICE_ROLE_KEY;
                const appUrl =
                  process.env.NEXT_PUBLIC_APP_URL ||
                  `${request.nextUrl.protocol}//${request.nextUrl.host}`;

                if (supabaseUrl && supabaseServiceKey) {
                  // Edge Function'ı çağır - locale bilgisini gönder
                  const response = await fetch(
                    `${supabaseUrl}/functions/v1/email-notifications`,
                    {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${supabaseServiceKey}`,
                      },
                      body: JSON.stringify({
                        type: 'welcome',
                        userId: user.id,
                        data: {
                          displayName:
                            profileResult.profile.display_name ||
                            user.user_metadata?.name ||
                            user.email?.split('@')[0] ||
                            'Kullanıcı',
                          initialCredits:
                            profileResult.profile.credit_balance || 0,
                          appUrl: appUrl,
                          locale: oauthLocale, // ÖNEMLİ: Locale bilgisini gönder
                        },
                      }),
                    }
                  );

                  if (response.ok) {
                    logger.info('Welcome email sent', {
                      action: 'welcome_email_sent',
                      resource: 'email',
                      metadata: {
                        userId: user.id,
                        email: user.email,
                        locale: oauthLocale,
                      },
                    });
                  } else {
                    logger.warn('Welcome email failed', {
                      action: 'welcome_email_failed',
                      resource: 'email',
                      metadata: {
                        userId: user.id,
                        status: response.status,
                        locale: oauthLocale,
                      },
                    });
                  }
                }
              } catch (emailError) {
                // Email hatası kritik değil, sadece logla
                logger.warn('Welcome email error', {
                  action: 'welcome_email_error',
                  resource: 'email',
                  metadata: {
                    userId: user.id,
                    error: emailError,
                    locale: oauthLocale,
                  },
                });
              }
            }
          }
        } catch (profileError) {
          logger.error(
            'Profile kontrol hatası',
            profileError instanceof Error
              ? profileError
              : new Error(String(profileError)),
            {
              action: 'profile_check_error',
              resource: 'profiles',
              metadata: {
                userId: user.id,
                email: user.email,
              },
            }
          );
          return AuthErrorService.handleCallbackError(profileError, locale);
        }

        // Admin kontrolü yap
        const isUserAdmin = await AdminDetectionService.isUserAdmin(user.id);
        AdminDetectionService.logAdminAccess(user.id, isUserAdmin);

        // Yönlendirme kararı - OAuth locale'i kullan
        const redirectPath = AdminDetectionService.getRedirectPath(
          isUserAdmin,
          oauthLocale
        );

        // Başarılı giriş - admin durumuna göre yönlendir
        return RedirectUtils.createRedirectResponse(request, redirectPath);
      } else {
        // User yoksa normal dashboard'a yönlendir
        return RedirectUtils.createDashboardRedirect(request, oauthLocale);
      }
    } catch (error) {
      return AuthErrorService.handleCallbackError(error, locale);
    }
  }

  // Hata durumunda auth sayfasına yönlendir
  return AuthErrorService.handleCallbackError(
    new Error('No code provided'),
    locale
  );
}
