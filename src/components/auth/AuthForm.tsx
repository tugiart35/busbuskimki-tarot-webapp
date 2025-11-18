/*
 * AuthForm - Refactored Client Component
 *
 * Bu dosya yeni utility'ler kullanılarak refactor edilmiş auth form component'idir.
 * Modern React patterns, hooks ve centralized services kullanır.
 */

'use client';

import { useState, useEffect, useCallback, memo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Key, Star, Shield } from 'lucide-react';
import { useTranslations } from '@/hooks/useTranslations';
import { useToast } from '@/hooks/useToast';
import { useAuth } from '@/hooks/auth/useAuth';
import { useRememberMe } from '@/hooks/auth/useRememberMe';
import { getAuthErrorMessage } from '@/lib/auth/auth-error-messages';

import {
  validateEmail,
  validatePasswordStrength,
  LoginFormData,
  RegisterFormData,
} from '@/lib/auth/auth-validation';
import Toast from '@/features/shared/ui/Toast';

// Feature flag: Facebook login - aktif
// const ENABLE_FACEBOOK_LOGIN = true;

interface AuthFormProps {
  locale: string;
  initialError: string | null;
  next: string | null;
}

function AuthForm({ locale, initialError, next }: AuthFormProps) {
  const router = useRouter();
  const { t } = useTranslations();
  const { toast, showToast, hideToast } = useToast();
  const {
    loading: authLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithFacebook,
    resetPassword,
    resendConfirmation,
    clearError,
  } = useAuth();
  const { updateRememberMe, loadSavedEmail } = useRememberMe();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [retryAfter, setRetryAfter] = useState<number | null>(null);

  const [message, setMessage] = useState('');
  const [showResendEmail, setShowResendEmail] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Form states
  const [formData, setFormData] = useState<LoginFormData | RegisterFormData>({
    email: '',
    password: '',
    rememberMe: false,
  } as LoginFormData);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initial error handling
  useEffect(() => {
    if (initialError) {
      const errorMessage =
        initialError === 'callback_failed'
          ? t('auth.page.callbackFailed')
          : initialError;
      setMessage(errorMessage);
    }
  }, [initialError, t]);

  // Load saved email on mount
  useEffect(() => {
    const loadEmail = async () => {
      const savedEmail = await loadSavedEmail();
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail, rememberMe: true }));
      }
    };
    loadEmail();
  }, [loadSavedEmail]);

  // Client-side only mount check (prevents hydration mismatch)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Clear errors when switching modes
  useEffect(() => {
    setErrors({});
    setMessage('');
    clearError();
  }, [isLogin, clearError]);

  // Form validation - memoized
  const validateForm = useCallback(
    (data: any): boolean => {
      const newErrors: Record<string, string> = {};

      // Email validation
      if (!data.email) {
        newErrors.email = t('auth.page.emailRequired');
      } else if (!validateEmail(data.email)) {
        newErrors.email = t('auth.page.emailInvalid');
      }

      // Password validation
      if (!data.password) {
        newErrors.password = t('auth.page.passwordRequired');
      } else if (data.password.length < 6) {
        newErrors.password = t('auth.page.passwordTooShort');
      } else if (!isLogin) {
        // Enhanced password validation for registration
        const passwordValidation = validatePasswordStrength(data.password);
        if (
          !passwordValidation.isValid &&
          passwordValidation.errors.length > 0
        ) {
          newErrors.password =
            passwordValidation.errors[0] || t('auth.page.passwordInvalid');
        }
      }

      // Registration-specific validations
      if (!isLogin) {
        const registerData = data as RegisterFormData;

        // Confirm password
        if (!registerData.confirmPassword) {
          newErrors.confirmPassword = t('auth.page.confirmPasswordRequired');
        } else if (registerData.password !== registerData.confirmPassword) {
          newErrors.confirmPassword = t('auth.page.passwordMismatch');
        }

        // Name validation
        if (!registerData.name?.trim()) {
          newErrors.name = t('auth.page.nameRequired');
        } else if (registerData.name.trim().length < 2) {
          newErrors.name = t('auth.page.nameTooShort');
        }

        // Surname validation
        if (!registerData.surname?.trim()) {
          newErrors.surname = t('auth.page.surnameRequired');
        } else if (registerData.surname.trim().length < 2) {
          newErrors.surname = t('auth.page.surnameTooShort');
        }

        // Birth date validation
        if (!registerData.birthDate) {
          newErrors.birthDate = t('auth.page.birthDateRequired');
        } else {
          const age =
            new Date().getFullYear() -
            new Date(registerData.birthDate).getFullYear();
          if (age < 13) {
            newErrors.birthDate = t('auth.page.ageTooYoung');
          } else if (age > 120) {
            newErrors.birthDate = t('auth.page.ageInvalid');
          }
        }

        // Gender validation
        if (!registerData.gender) {
          newErrors.gender = t('auth.page.genderRequired');
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [isLogin, t]
  );

  // Form submission - memoized
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');
      setErrors({});
      setLoadingStep(t('auth.page.validating'));

      if (!validateForm(formData)) {
        setLoading(false);
        setLoadingStep('');
        return;
      }

      try {
        if (isLogin) {
          setLoadingStep(t('auth.page.signingIn'));

          try {
            await signIn(formData.email, formData.password);

            // Update remember me
            if ('rememberMe' in formData && formData.rememberMe) {
              updateRememberMe(formData.email, true);
            }

            showToast(t('auth.page.loginSuccess'), 'success');
            setLoadingStep(t('auth.page.redirecting'));

            // Navigate using Next.js router
            setTimeout(() => {
              // Validate redirect URL to prevent open redirect attacks
              const isValidRedirect =
                next &&
                next.startsWith('/') &&
                !next.startsWith('//') &&
                !next.includes('//');
              const redirectPath = isValidRedirect
                ? `/${locale}${next}`
                : `/${locale}/dashboard`;
              router.push(redirectPath);
            }, 1000);
          } catch (error: any) {
            // E-posta onaylanmamış kullanıcılar için özel handling
            if (
              error.message?.includes('Email not confirmed') ||
              error.message?.includes(
                'E-posta adresinizi onaylamanız gerekiyor'
              )
            ) {
              setMessage(t('auth.page.emailConfirmationRequired'));
              setShowResendEmail(true);
              setPendingEmail(formData.email);
            } else {
              throw error; // Diğer hataları normal error handling'e bırak
            }
          }
        } else {
          setLoadingStep(t('auth.page.signingUp'));

          const signUpResult = await signUp(formData as RegisterFormData);

          // Email confirmation gerekip gerekmediğini kontrol et
          // Session null ise email confirmation gerekiyor demektir
          if (signUpResult && !signUpResult.session) {
            // Email confirmation gerekiyor
            const confirmationMessage = t('auth.page.emailConfirmationSent');
            setMessage(confirmationMessage);
            setShowResendEmail(true);
            setPendingEmail(formData.email);
            showToast(confirmationMessage, 'info');
          } else {
            // Email confirmation gerekmiyor, direkt giriş yapıldı
            showToast(t('auth.page.registerSuccess'), 'info');
          }

          // Switch to login mode and clear form (password'ü temizle)
          setTimeout(() => {
            setIsLogin(true);
            setFormData(prev => ({
              ...prev,
              password: '',
              rememberMe: false,
            }));
            // Email confirmation mesajı varsa message'ı temizleme
            if (signUpResult && signUpResult.session) {
              setMessage('');
            }
          }, 2000);
        }
      } catch (error: unknown) {
        // Sadece gerçek RateLimitError için özel işlem
        if (error instanceof Error && error.name === 'RateLimitError') {
          const retryAfter = (error as any).retryAfter || 60;
          setRateLimitError(t('auth.page.rateLimitExceeded'));
          setRetryAfter(retryAfter);

          // Countdown timer
          const interval = setInterval(() => {
            setRetryAfter(prev => {
              if (prev && prev <= 1) {
                clearInterval(interval);
                setRateLimitError(null);
                return null;
              }
              return prev ? prev - 1 : null;
            });
          }, 1000);

          showToast('Rate limit aşıldı. Lütfen bekleyin.', 'warning');
        } else {
          // Normal hatalar için standart işlem
          const errorMessage = getAuthErrorMessage(error as Error, locale);
          showToast(errorMessage, 'error');
        }
      } finally {
        setLoading(false);
        setLoadingStep('');
      }
    },
    [
      validateForm,
      formData,
      isLogin,
      signIn,
      showToast,
      updateRememberMe,
      next,
      locale,
      router,
      signUp,
      t,
    ]
  );

  // Google login - memoized
  const handleGoogleLogin = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingStep(
        isLogin ? t('auth.page.googleLogin') : t('auth.page.googleRegister')
      );
      setMessage('');
      setErrors({});

      await signInWithGoogle(locale);
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error as Error, locale);
      showToast(errorMessage, 'error');
      setLoading(false);
      setLoadingStep('');
    }
  }, [signInWithGoogle, locale, showToast, isLogin, t]);

  // Facebook login - memoized
  const handleFacebookLogin = useCallback(async () => {
    try {
      setLoading(true);
      setLoadingStep(
        isLogin ? t('auth.page.facebookLogin') : t('auth.page.facebookRegister')
      );
      setMessage('');
      setErrors({});

      await signInWithFacebook(locale);
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error as Error, locale);
      showToast(errorMessage, 'error');
      setLoading(false);
      setLoadingStep('');
    }
  }, [signInWithFacebook, locale, showToast, isLogin, t]);

  // Resend email confirmation - memoized
  const handleResendEmail = useCallback(async () => {
    if (!pendingEmail) {
      return;
    }

    try {
      setLoading(true);
      setLoadingStep(t('auth.page.sendingEmail'));
      setMessage('');

      await resendConfirmation(pendingEmail);

      showToast(t('auth.page.resendEmail') + '!', 'success');
      setShowResendEmail(false);
      setPendingEmail('');
    } catch (error: unknown) {
      const errorMessage = getAuthErrorMessage(error as Error, locale);
      showToast(errorMessage, 'error');
      setMessage(errorMessage);
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  }, [pendingEmail, resendConfirmation, showToast, locale, t]);

  // Password reset - memoized
  const handlePasswordReset = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setMessage('');
      setErrors({});

      const formData = new FormData(e.target as HTMLFormElement);
      const resetEmail = formData.get('resetEmail') as string;

      if (!resetEmail) {
        setErrors({ email: t('auth.page.emailRequired') });
        setLoading(false);
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(resetEmail)) {
        setErrors({ email: t('auth.page.emailInvalid') });
        setLoading(false);
        return;
      }

      try {
        setLoadingStep(t('auth.page.sendingEmail'));

        await resetPassword(resetEmail, locale);

        showToast(t('auth.page.passwordResetDescription'), 'success');
        setShowPasswordReset(false);
      } catch (error: unknown) {
        const errorMessage = getAuthErrorMessage(error as Error, locale);
        showToast(errorMessage, 'error');
        setErrors({ email: errorMessage });
      } finally {
        setLoading(false);
        setLoadingStep('');
      }
    },
    [resetPassword, locale, showToast, t]
  );

  // Input change handler - memoized
  const handleInputChange = useCallback(
    (field: string, value: any) => {
      setFormData(prev => ({ ...prev, [field]: value }));

      // Clear field error when user starts typing
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: '' }));
      }
    },
    [errors]
  );

  // Switch between login/register - now handled directly in onClick handlers
  // const toggleMode = useCallback(() => {
  //   setIsLogin(!isLogin);
  //   setErrors({});
  //   setMessage('');

  //   if (isLogin) {
  //     // Switching to register - add required fields
  //     setFormData({
  //       email: formData.email,
  //       password: '',
  //       confirmPassword: '',
  //       name: '',
  //       surname: '',
  //       birthDate: '',
  //       gender: 'male' as const,
  //       rememberMe: false,
  //     });
  //   } else {
  //     // Switching to login - remove extra fields
  //     setFormData({
  //       email: formData.email,
  //       password: '',
  //       rememberMe: false,
  //     });
  //   }
  // }, [isLogin, formData.email]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden'>
      {/* Mystical background elements - Client-side only to prevent hydration mismatch */}
      {isMounted && (
        <div className='fixed inset-0 overflow-hidden pointer-events-none'>
          {/* Constellation stars */}
          {[...Array(30)].map((_, i) => {
            // Use index-based seed for consistent positioning
            const seed = i * 137.508; // Golden angle for better distribution
            const left = (Math.sin(seed) * 0.5 + 0.5) * 100;
            const top = (Math.cos(seed) * 0.5 + 0.5) * 100;
            const duration = 4 + (i % 3);
            const delay = (i % 3) * 0.5;

            return (
              <motion.div
                key={`star-${i}`}
                className='absolute w-0.5 h-0.5 bg-amber-200 rounded-full'
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                }}
              />
            );
          })}

          {/* Floating particles */}
          {[...Array(10)].map((_, i) => {
            // Use index-based seed for consistent positioning
            const seed = i * 97.5; // Different seed for particles
            const left = (Math.sin(seed) * 0.5 + 0.5) * 100;
            const top = (Math.cos(seed) * 0.5 + 0.5) * 100;
            const duration = 8 + (i % 4);
            const delay = (i % 5) * 0.3;

            return (
              <motion.div
                key={`particle-${i}`}
                className='absolute w-1 h-1 bg-amber-400/30 rounded-full blur-sm'
                style={{
                  left: `${left}%`,
                  top: `${top}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 0.5, 0],
                }}
                transition={{
                  duration,
                  repeat: Infinity,
                  delay,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Subtle arcana symbols in background - Static, no hydration issue */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-20 opacity-5 text-6xl'>☽</div>
        <div className='absolute top-40 right-32 opacity-5 text-6xl'>☉</div>
        <div className='absolute bottom-32 left-40 opacity-5 text-6xl'>✦</div>
        <div className='absolute bottom-20 right-20 opacity-5 text-6xl'>⚹</div>
      </div>

      {/* Warm ambient glow */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl' />
        <div className='absolute bottom-1/3 right-1/3 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl' />
      </div>

      <div className='container mx-auto px-4 py-12 min-h-screen flex items-center justify-center'>
        <div className='w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center'>
          {/* Left side: Tarot Altar Illustration */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className='hidden lg:block relative'
          >
            <div className='relative'>
              {/* Mystical scene */}
              <div className='space-y-8'>
                {/* Moon and stars header */}
                <div className='text-center space-y-4'>
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 120,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                    className='inline-block text-7xl'
                  >
                    ☽
                  </motion.div>
                  <div className='flex justify-center gap-4 text-3xl'>
                    <motion.span
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      ✦
                    </motion.span>
                    <motion.span
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                    >
                      ✧
                    </motion.span>
                    <motion.span
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    >
                      ✦
                    </motion.span>
                  </div>
                </div>

                {/* Tarot cards spread */}
                <div className='flex justify-center gap-4'>
                  {['🃏', '🎴', '🂠'].map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2 }}
                      whileHover={{ y: -10, scale: 1.05 }}
                      className='w-24 h-36 bg-gradient-to-br from-amber-900/40 to-orange-950/40 border-2 border-amber-700/40 rounded-lg flex items-center justify-center text-4xl backdrop-blur-sm shadow-2xl shadow-amber-900/20'
                    >
                      {card}
                    </motion.div>
                  ))}
                </div>

                {/* Numerology symbols */}
                <div className='flex justify-center gap-6 text-amber-400/60 text-2xl'>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    I
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    II
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  >
                    III
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                  >
                    VII
                  </motion.span>
                  <motion.span
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                  >
                    IX
                  </motion.span>
                </div>

                {/* Candle glow effect */}
                <div className='flex justify-center gap-12'>
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(251, 191, 36, 0.3)',
                        '0 0 40px rgba(251, 191, 36, 0.5)',
                        '0 0 20px rgba(251, 191, 36, 0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='text-4xl'
                  >
                    🕯️
                  </motion.div>
                  <motion.div
                    animate={{
                      boxShadow: [
                        '0 0 20px rgba(251, 191, 36, 0.3)',
                        '0 0 40px rgba(251, 191, 36, 0.5)',
                        '0 0 20px rgba(251, 191, 36, 0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    className='text-4xl'
                  >
                    🕯️
                  </motion.div>
                </div>

                {/* Mystical quote */}
                <p className='text-center text-amber-200/60 italic text-sm max-w-md mx-auto'>
                  {t('auth.page.mysticalQuote')}
                </p>
              </div>

              {/* Decorative corner elements */}
              <div className='absolute -top-4 -left-4 text-amber-600/30 text-2xl'>
                ✧
              </div>
              <div className='absolute -top-4 -right-4 text-amber-600/30 text-2xl'>
                ✧
              </div>
              <div className='absolute -bottom-4 -left-4 text-amber-600/30 text-2xl'>
                ✧
              </div>
              <div className='absolute -bottom-4 -right-4 text-amber-600/30 text-2xl'>
                ✧
              </div>
            </div>
          </motion.div>

          {/* Right side: Tarot Card Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='relative'
          >
            {/* Tarot card frame */}
            <div className='relative'>
              {/* Shimmer border animation */}
              <motion.div
                className='absolute inset-0 rounded-3xl'
                style={{
                  background:
                    'linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.3), transparent)',
                }}
                animate={{
                  x: ['-100%', '200%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />

              {/* Main card */}
              <div className='relative bg-gradient-to-br from-slate-900/90 to-indigo-950/90 backdrop-blur-xl border-2 border-amber-700/40 rounded-3xl p-8 sm:p-10 shadow-2xl'>
                {/* Decorative corner ornaments */}
                <div className='absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-amber-600/50 rounded-tl-lg' />
                <div className='absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-amber-600/50 rounded-tr-lg' />
                <div className='absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-amber-600/50 rounded-bl-lg' />
                <div className='absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-amber-600/50 rounded-br-lg' />

                {/* Mobile illustration banner */}
                <div className='lg:hidden mb-8 text-center space-y-4'>
                  <div className='text-5xl'>☽</div>
                  <div className='flex justify-center gap-3'>
                    {['🃏', '🎴', '🂠'].map((card, i) => (
                      <div key={i} className='text-2xl'>
                        {card}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand header */}
                <div className='text-center mb-8'>
                  <div className='flex items-center justify-center gap-3 mb-3'>
                    <span className='text-3xl'>🔮</span>
                    <h1
                      id='auth-title'
                      className='text-2xl tracking-wider text-amber-50'
                    >
                      {t('auth.page.brandName')}
                    </h1>
                  </div>
                  <p
                    id='auth-description'
                    className='text-amber-200/70 text-sm'
                  >
                    {t('auth.page.welcomeMessage')}
                  </p>
                </div>

                {/* Rate Limit Warning */}
                {rateLimitError && (
                  <div className='mb-6 p-4 bg-orange-500/20 border border-orange-500/30 rounded-xl'>
                    <div className='flex items-center gap-3'>
                      <div className='text-orange-400 text-xl'>⏰</div>
                      <div className='flex-1'>
                        <p className='text-orange-300 font-medium'>
                          {rateLimitError}
                        </p>
                        {retryAfter && (
                          <p className='text-orange-400/80 text-sm mt-1'>
                            {t('auth.page.retryAfter').replace(
                              '{seconds}',
                              retryAfter.toString()
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Mode tabs with symbols */}
                <div className='flex gap-3 mb-8 p-1.5 bg-slate-950/50 rounded-xl border border-amber-900/20'>
                  <button
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2 ${
                      isLogin
                        ? 'bg-gradient-to-r from-amber-700 to-orange-700 shadow-lg shadow-amber-900/30 text-white'
                        : 'text-amber-300/60 hover:text-amber-200'
                    }`}
                  >
                    <Key className='w-4 h-4' />
                    <span>{t('auth.page.loginButton', 'Giriş Yap')}</span>
                  </button>
                  <button
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2.5 rounded-lg transition-all text-sm flex items-center justify-center gap-2 ${
                      !isLogin
                        ? 'bg-gradient-to-r from-amber-700 to-orange-700 shadow-lg shadow-amber-900/30 text-white'
                        : 'text-amber-300/60 hover:text-amber-200'
                    }`}
                  >
                    <Star className='w-4 h-4' />
                    <span>{t('auth.page.registerButton', 'Kayıt Ol')}</span>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='space-y-5'>
                  {/* Registration Fields - Name, Surname (Ad, Soyad) */}
                  {!isLogin && (
                    <>
                      {/* Name Input */}
                      <AnimatePresence mode='wait'>
                        <motion.div
                          key='name-field'
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className='block text-sm text-amber-200/80 mb-2'>
                            {t('auth.page.firstName', 'Ad')}
                          </label>
                          <div className='relative'>
                            <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600/60' />
                            <input
                              type='text'
                              value={(formData as RegisterFormData).name || ''}
                              onChange={e =>
                                handleInputChange('name', e.target.value)
                              }
                              placeholder={t('auth.page.firstName', 'Ad')}
                              className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl focus:border-amber-600/60 focus:outline-none focus:ring-2 focus:ring-amber-900/20 transition-all placeholder:text-slate-500 text-amber-50 ${
                                errors.name
                                  ? 'border-red-500/50'
                                  : 'border-amber-900/30'
                              }`}
                              aria-label={t('auth.page.firstName', 'Ad')}
                              aria-describedby={
                                errors.name ? 'name-error' : undefined
                              }
                              aria-invalid={!!errors.name}
                            />
                          </div>
                          {errors.name && (
                            <p
                              className='text-red-400 text-xs mt-1'
                              id='name-error'
                              role='alert'
                            >
                              {errors.name}
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {/* Surname Input */}
                      <AnimatePresence mode='wait'>
                        <motion.div
                          key='surname-field'
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className='block text-sm text-amber-200/80 mb-2'>
                            {t('auth.page.lastName', 'Soyad')}
                          </label>
                          <div className='relative'>
                            <User className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600/60' />
                            <input
                              type='text'
                              value={
                                (formData as RegisterFormData).surname || ''
                              }
                              onChange={e =>
                                handleInputChange('surname', e.target.value)
                              }
                              placeholder={t('auth.page.lastName', 'Soyad')}
                              className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl focus:border-amber-600/60 focus:outline-none focus:ring-2 focus:ring-amber-900/20 transition-all placeholder:text-slate-500 text-amber-50 ${
                                errors.surname
                                  ? 'border-red-500/50'
                                  : 'border-amber-900/30'
                              }`}
                              aria-label={t('auth.page.lastName', 'Soyad')}
                              aria-describedby={
                                errors.surname ? 'surname-error' : undefined
                              }
                              aria-invalid={!!errors.surname}
                            />
                          </div>
                          {errors.surname && (
                            <p
                              className='text-red-400 text-xs mt-1'
                              id='surname-error'
                              role='alert'
                            >
                              {errors.surname}
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}

                  {/* Email */}
                  <div>
                    <label className='block text-sm text-amber-200/80 mb-2'>
                      {t('auth.page.email', 'E-posta')}
                    </label>
                    <div className='relative'>
                      <Mail className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600/60' />
                      <input
                        type='email'
                        value={formData.email}
                        onChange={e =>
                          handleInputChange('email', e.target.value)
                        }
                        placeholder={t('auth.page.emailPlaceholder')}
                        className={`w-full pl-11 pr-4 py-3 bg-slate-950/50 border rounded-xl focus:border-amber-600/60 focus:outline-none focus:ring-2 focus:ring-amber-900/20 transition-all placeholder:text-slate-500 text-amber-50 ${
                          errors.email
                            ? 'border-red-500/50'
                            : 'border-amber-900/30'
                        }`}
                        aria-label={t('auth.page.email', 'E-posta')}
                        aria-describedby={
                          errors.email ? 'email-error' : undefined
                        }
                        aria-invalid={!!errors.email}
                      />
                    </div>
                    {errors.email && (
                      <p
                        className='text-red-400 text-xs mt-1'
                        id='email-error'
                        role='alert'
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Registration Fields - Birth Date, Gender */}
                  {!isLogin && (
                    <>
                      {/* Birth Date Input */}
                      <AnimatePresence mode='wait'>
                        <motion.div
                          key='birthdate-field'
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className='block text-sm text-amber-200/80 mb-2'>
                            {t('auth.page.birthDate', 'Doğum Tarihi')}
                          </label>
                          <div className='relative'>
                            <input
                              type='date'
                              value={
                                (formData as RegisterFormData).birthDate || ''
                              }
                              onChange={e =>
                                handleInputChange('birthDate', e.target.value)
                              }
                              className={`w-full pl-4 pr-4 py-3 bg-slate-950/50 border rounded-xl focus:border-amber-600/60 focus:outline-none focus:ring-2 focus:ring-amber-900/20 transition-all text-amber-50 ${
                                errors.birthDate
                                  ? 'border-red-500/50'
                                  : 'border-amber-900/30'
                              }`}
                              aria-label={t(
                                'auth.page.birthDate',
                                'Doğum Tarihi'
                              )}
                              aria-describedby={
                                errors.birthDate ? 'birthdate-error' : undefined
                              }
                              aria-invalid={!!errors.birthDate}
                            />
                          </div>
                          {errors.birthDate && (
                            <p
                              className='text-red-400 text-xs mt-1'
                              id='birthdate-error'
                              role='alert'
                            >
                              {errors.birthDate}
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {/* Gender Select */}
                      <AnimatePresence mode='wait'>
                        <motion.div
                          key='gender-field'
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <label className='block text-sm text-amber-200/80 mb-2'>
                            {t('auth.page.gender', 'Cinsiyet')}
                          </label>
                          <div className='relative'>
                            <select
                              value={
                                (formData as RegisterFormData).gender || ''
                              }
                              onChange={e =>
                                handleInputChange(
                                  'gender',
                                  e.target.value as
                                    | 'male'
                                    | 'female'
                                    | 'other'
                                    | 'prefer_not_to_say'
                                )
                              }
                              className={`w-full pl-4 pr-4 py-3 bg-slate-950/50 border rounded-xl focus:border-amber-600/60 focus:outline-none focus:ring-2 focus:ring-amber-900/20 transition-all text-amber-50 ${
                                errors.gender
                                  ? 'border-red-500/50'
                                  : 'border-amber-900/30'
                              }`}
                              aria-label={t('auth.page.gender', 'Cinsiyet')}
                              aria-describedby={
                                errors.gender ? 'gender-error' : undefined
                              }
                              aria-invalid={!!errors.gender}
                            >
                              <option
                                value=''
                                className='bg-slate-950 text-amber-50'
                              >
                                {t('auth.page.gender', 'Cinsiyet')}
                              </option>
                              <option
                                value='male'
                                className='bg-slate-950 text-amber-50'
                              >
                                {t('auth.page.genderMale', 'Erkek')}
                              </option>
                              <option
                                value='female'
                                className='bg-slate-950 text-amber-50'
                              >
                                {t('auth.page.genderFemale', 'Kadın')}
                              </option>
                              <option
                                value='other'
                                className='bg-slate-950 text-amber-50'
                              >
                                {t('auth.page.genderOther', 'Diğer')}
                              </option>
                              <option
                                value='prefer_not_to_say'
                                className='bg-slate-950 text-amber-50'
                              >
                                {t(
                                  'auth.page.genderPreferNotToSay',
                                  'Belirtmek istemiyorum'
                                )}
                              </option>
                            </select>
                          </div>
                          {errors.gender && (
                            <p
                              className='text-red-400 text-xs mt-1'
                              id='gender-error'
                              role='alert'
                            >
                              {errors.gender}
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </>
                  )}

                  {/* Password */}
                  <div>
                    <label className='block text-sm text-amber-200/80 mb-2'>
                      {t('auth.page.password', 'Şifre')}
                    </label>
                    <div className='relative'>
                      <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600/60' />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={e =>
                          handleInputChange('password', e.target.value)
                        }
                        placeholder={t(
                          'auth.page.passwordPlaceholder',
                          'Şifreniz'
                        )}
                        className={`w-full pl-11 pr-11 py-3 bg-slate-950/50 border rounded-xl focus:border-amber-600/60 focus:outline-none focus:ring-2 focus:ring-amber-900/20 transition-all placeholder:text-slate-500 text-amber-50 ${
                          errors.password
                            ? 'border-red-500/50'
                            : 'border-amber-900/30'
                        }`}
                        aria-label={t('auth.page.password', 'Şifre')}
                        aria-describedby={
                          errors.password ? 'password-error' : undefined
                        }
                        aria-invalid={!!errors.password}
                      />
                      <button
                        type='button'
                        onClick={() => setShowPassword(!showPassword)}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-amber-600/60 hover:text-amber-500'
                        aria-label={
                          showPassword
                            ? t('auth.page.hidePassword', 'Şifreyi gizle')
                            : t('auth.page.showPassword', 'Şifreyi göster')
                        }
                      >
                        {showPassword ? (
                          <EyeOff className='w-5 h-5' />
                        ) : (
                          <Eye className='w-5 h-5' />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p
                        className='text-red-400 text-xs mt-1'
                        id='password-error'
                        role='alert'
                      >
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <AnimatePresence mode='wait'>
                    {!isLogin && (
                      <motion.div
                        key='confirm-password'
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className='block text-sm text-amber-200/80 mb-2'>
                          {t('auth.page.confirmPassword', 'Şifre Onayı')}
                        </label>
                        <div className='relative'>
                          <Lock className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-600/60' />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={
                              (formData as RegisterFormData).confirmPassword ||
                              ''
                            }
                            onChange={e =>
                              handleInputChange(
                                'confirmPassword',
                                e.target.value
                              )
                            }
                            placeholder={t(
                              'auth.page.confirmPasswordPlaceholder'
                            )}
                            className={`w-full pl-11 pr-11 py-3 bg-slate-950/50 border rounded-xl focus:border-amber-600/60 focus:outline-none focus:ring-2 focus:ring-amber-900/20 transition-all placeholder:text-slate-500 text-amber-50 ${
                              errors.confirmPassword
                                ? 'border-red-500/50'
                                : 'border-amber-900/30'
                            }`}
                            aria-label={t(
                              'auth.page.confirmPassword',
                              'Şifre Onayı'
                            )}
                            aria-describedby={
                              errors.confirmPassword
                                ? 'confirm-password-error'
                                : undefined
                            }
                            aria-invalid={!!errors.confirmPassword}
                          />
                          <button
                            type='button'
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className='absolute right-3 top-1/2 -translate-y-1/2 text-amber-600/60 hover:text-amber-500'
                            aria-label={
                              showConfirmPassword
                                ? t('auth.page.hidePassword', 'Şifreyi gizle')
                                : t('auth.page.showPassword', 'Şifreyi göster')
                            }
                          >
                            {showConfirmPassword ? (
                              <EyeOff className='w-5 h-5' />
                            ) : (
                              <Eye className='w-5 h-5' />
                            )}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p
                            className='text-red-400 text-xs mt-1'
                            id='confirm-password-error'
                            role='alert'
                          >
                            {errors.confirmPassword}
                          </p>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Remember Me & Forgot Password */}
                  {isLogin && (
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
                      <label className='flex items-center gap-3 text-amber-200/80 text-sm cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={
                            (formData as LoginFormData).rememberMe || false
                          }
                          onChange={e =>
                            handleInputChange('rememberMe', e.target.checked)
                          }
                          className='w-4 h-4 rounded border-amber-900/30 bg-slate-950/50 text-amber-600 focus:ring-amber-600/60'
                        />
                        <span>{t('auth.page.rememberMe')}</span>
                      </label>
                      <button
                        type='button'
                        onClick={() => setShowPasswordReset(true)}
                        className='text-sm text-amber-400 hover:text-amber-300 transition-colors'
                      >
                        {t('auth.page.forgotPassword')}
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type='submit'
                    disabled={loading || authLoading || !!rateLimitError}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className='w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg shadow-amber-900/40 hover:shadow-amber-900/60 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loading ? (
                      <div className='flex items-center justify-center gap-3 relative z-10'>
                        <div className='animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full'></div>
                        <span>
                          {loadingStep ||
                            t('auth.page.processing', 'İşleniyor...')}
                        </span>
                      </div>
                    ) : (
                      <span className='relative z-10 text-white'>
                        {isLogin
                          ? t('auth.page.loginButton', 'Giriş Yap')
                          : t('auth.page.registerButton', 'Kayıt Ol')}
                      </span>
                    )}
                    <motion.div
                      className='absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-400/30'
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.button>

                  {/* Social Login - Google */}
                  <div className='mt-6'>
                    <div className='relative my-6'>
                      {/* Divider */}
                      <div className='absolute inset-0 flex items-center'>
                        <div className='w-full h-px bg-gradient-to-r from-transparent via-amber-900/30 to-transparent'></div>
                      </div>
                      {/* Center text */}
                      <div className='relative flex justify-center'>
                        <div className='px-4 py-2 bg-slate-950/50 backdrop-blur-sm rounded-full border border-amber-900/20'>
                          <span className='text-amber-300/70 text-xs'>
                            {t('auth.page.or')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={handleGoogleLogin}
                      disabled={loading || authLoading}
                      className='w-full py-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-amber-900/30 text-amber-200 hover:bg-white/20 transition-all shadow-lg hover:shadow-amber-900/30 disabled:opacity-50 flex items-center justify-center gap-3'
                    >
                      <svg
                        className='w-5 h-5'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                      >
                        <path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z' />
                        <path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' />
                        <path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' />
                        <path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' />
                      </svg>
                      <span>
                        {isLogin
                          ? t('auth.page.googleLogin', 'Google ile Giriş Yap')
                          : t(
                              'auth.page.googleRegister',
                              'Google ile Kayıt Ol'
                            )}
                      </span>
                    </button>

                    {/* Facebook Login Button */}
                    <button
                      type='button'
                      onClick={handleFacebookLogin}
                      disabled={loading || authLoading}
                      className='w-full py-3.5 rounded-xl bg-[#1877F2]/10 backdrop-blur-md border border-[#1877F2]/30 text-amber-200 hover:bg-[#1877F2]/20 transition-all shadow-lg hover:shadow-[#1877F2]/30 disabled:opacity-50 flex items-center justify-center gap-3 mt-3'
                    >
                      <svg
                        className='w-5 h-5'
                        viewBox='0 0 24 24'
                        fill='#1877F2'
                      >
                        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
                      </svg>
                      <span>
                        {isLogin
                          ? t(
                              'auth.page.facebookLogin',
                              'Facebook ile Giriş Yap'
                            )
                          : t(
                              'auth.page.facebookRegister',
                              'Facebook ile Kayıt Ol'
                            )}
                      </span>
                    </button>
                  </div>

                  {/* Switch mode */}
                  <div className='text-center text-sm mt-6'>
                    {isLogin ? (
                      <p className='text-amber-300/70'>
                        {t('auth.page.newHere')}{' '}
                        <button
                          type='button'
                          onClick={() => setIsLogin(false)}
                          className='text-amber-400 hover:text-amber-300 transition-colors'
                        >
                          {t('auth.page.switchToRegister')}
                        </button>
                      </p>
                    ) : (
                      <p className='text-amber-300/70'>
                        {(() => {
                          const switchText = t('auth.page.switchToLogin');
                          // "Zaten hesabınız var mı? Giriş yapın" formatını parse et
                          if (switchText.includes('?')) {
                            const parts = switchText.split('?');
                            const question = (parts[0] || '').trim();
                            const action = (
                              parts[1] || t('auth.page.loginButton')
                            ).trim();
                            return (
                              <>
                                {question}?{' '}
                                <button
                                  type='button'
                                  onClick={() => setIsLogin(true)}
                                  className='text-amber-400 hover:text-amber-300 transition-colors'
                                >
                                  {action}
                                </button>
                              </>
                            );
                          }
                          // Fallback: Eğer "?" yoksa, direkt metni göster ve buton ekle
                          return (
                            <>
                              {switchText}{' '}
                              <button
                                type='button'
                                onClick={() => setIsLogin(true)}
                                className='text-amber-400 hover:text-amber-300 transition-colors'
                              >
                                {t('auth.page.loginButton')}
                              </button>
                            </>
                          );
                        })()}
                      </p>
                    )}
                  </div>
                </form>

                {/* Sacred privacy note */}
                <div className='mt-8 pt-6 border-t border-amber-900/30'>
                  <div className='flex items-start gap-3 text-xs text-amber-300/60'>
                    <Shield className='w-4 h-4 text-amber-600/60 mt-0.5 flex-shrink-0' />
                    <p>{t('auth.page.privacyNote')}</p>
                  </div>
                </div>

                {/* Message Display */}
                {message && !showResendEmail && (
                  <div
                    className={`mt-6 p-4 rounded-lg text-center ${
                      message.includes('başarılı') ||
                      message.includes('gönderildi') ||
                      message.includes('success')
                        ? 'bg-green-500/20 text-green-300'
                        : 'bg-red-500/20 text-red-300'
                    }`}
                    role='alert'
                  >
                    {message}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showPasswordReset && (
        <div
          className='fixed top-0 left-0 w-full h-full bg-black/70 z-[99999] flex items-center justify-center p-4'
          onClick={e => {
            if (e.target === e.currentTarget) {
              setShowPasswordReset(false);
              setErrors({});
              setMessage('');
            }
          }}
        >
          <div className='bg-gradient-to-br from-slate-900/95 to-indigo-950/95 backdrop-blur-xl border-2 border-amber-700/40 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white'>
            <div className='text-center mb-6'>
              <h2 className='text-xl font-semibold text-amber-50 mb-2'>
                {t('auth.page.passwordResetTitle')}
              </h2>
              <p className='text-amber-200/70 text-sm'>
                {t('auth.page.passwordResetDescription')}
              </p>
            </div>

            <form onSubmit={handlePasswordReset} className='space-y-4'>
              <div>
                <input
                  type='email'
                  name='resetEmail'
                  placeholder={t('auth.page.emailPlaceholder')}
                  defaultValue={formData.email || ''}
                  className='w-full p-3 rounded-xl border border-amber-900/30 bg-slate-950/50 text-amber-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-900/20 focus:border-amber-600/60 transition-all'
                  aria-label={t('auth.page.emailLabel', 'Email')}
                  required
                />
                {errors.email && (
                  <p className='text-red-400 text-sm mt-1' role='alert'>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className='flex gap-3'>
                <button
                  type='submit'
                  disabled={loading}
                  className='flex-1 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg hover:shadow-amber-900/40'
                >
                  {loading ? (
                    <div className='flex items-center justify-center gap-2'>
                      <div className='animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full'></div>
                      <span>{loadingStep}</span>
                    </div>
                  ) : (
                    t('auth.page.sendEmail')
                  )}
                </button>

                <button
                  type='button'
                  onClick={() => {
                    setShowPasswordReset(false);
                    setErrors({});
                    setMessage('');
                  }}
                  className='px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-amber-200 rounded-xl font-semibold transition-all border border-amber-900/30'
                >
                  {t('auth.page.cancel')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resend Email Modal */}
      {showResendEmail && (
        <div
          className='fixed top-0 left-0 w-full h-full bg-black/70 z-[99999] flex items-center justify-center p-4'
          onClick={e => {
            if (e.target === e.currentTarget) {
              setShowResendEmail(false);
              setPendingEmail('');
              setMessage('');
            }
          }}
        >
          <div className='bg-gradient-to-br from-slate-900/95 to-indigo-950/95 backdrop-blur-xl border-2 border-amber-700/40 rounded-3xl p-6 max-w-md w-full shadow-2xl text-white'>
            <div className='mb-6'>
              <h3 className='text-xl font-bold text-amber-50 mb-2'>
                {t('auth.page.emailConfirmationTitle')}
              </h3>
              <p className='text-amber-200/70 text-sm'>
                {t('auth.page.emailConfirmationRequired')}
              </p>
              <p className='text-amber-300/60 text-xs mt-2'>
                {t('auth.page.emailLabel', 'Email')}: {pendingEmail}
              </p>
            </div>

            <div className='flex gap-3'>
              <button
                type='button'
                onClick={() => {
                  handleResendEmail();
                }}
                disabled={loading}
                className='flex-1 px-4 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-amber-900/40'
              >
                {loading && loadingStep.includes(t('auth.page.sendingEmail'))
                  ? loadingStep
                  : t('auth.page.resendEmail')}
              </button>

              <button
                type='button'
                onClick={() => {
                  setShowResendEmail(false);
                  setPendingEmail('');
                  setMessage('');
                }}
                className='px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-amber-200 rounded-xl font-semibold transition-all border border-amber-900/30'
              >
                {t('auth.page.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}

// Memoized export
export default memo(AuthForm);
