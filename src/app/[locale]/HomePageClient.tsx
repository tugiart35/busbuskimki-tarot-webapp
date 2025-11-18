/*
info:
Bağlantılı dosyalar:
- @/features/shared/layout/BottomNavigation: Alt navigasyon bileşeni (gerekli)
- @/hooks/useTranslations: Çoklu dil desteği için (gerekli)
- @/hooks/useAuth: Kullanıcı kimlik doğrulama için (gerekli)
- next/link: Sayfa yönlendirmeleri için (gerekli)

Dosyanın amacı:
- Modern ve mistik anasayfa tasarımı
- Tarot ve Numeroloji hizmetlerini eşit şekilde öne çıkarma
- Kullanıcı deneyimini geliştirme ve dönüşüm oranlarını artırma
- Mobil-first responsive tasarım

Supabase değişkenleri ve tabloları:
- useAuth hook'u üzerinden kullanıcı durumu kontrol edilir
- Burada backend'e bağlanılacak - kullanıcı profil bilgileri

Geliştirme önerileri:
- Animasyonlar ve etkileşimli öğeler eklendi
- Hizmet karşılaştırması ve özellik vurguları
- Sosyal kanıt ve güven unsurları
- Modern UI/UX prensipleri uygulandı

Tespit edilen hatalar:
- Yok

Kullanım durumu:
- Ana sayfa bileşeni olarak aktif kullanımda
- Tüm cihazlarda responsive tasarım
- i18n desteği ile çoklu dil
*/

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BottomNavigation } from '@/features/shared/layout';
import { useTranslations } from '@/hooks/useTranslations';
import FastDeliveryInfoCard from '@/features/tarot/components/FastDeliveryInfoCard';
import { READING_TYPES } from '@/types/tarot';
import { GlassCard } from '@/components/GlassCard';
import { TarotCardDrawing } from '@/components/TarotCardDrawing';
import { TrendingCardsWidget } from '@/components/shared/ClientWidgets';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, Brain, Star } from 'lucide-react';

interface HomePageClientProps {
  locale: string;
  initialReadings?: number;
}

export function HomePageClient({
  locale,
  initialReadings = 0,
}: HomePageClientProps) {
  const { t } = useTranslations();
  const [mounted, setMounted] = useState(false);

  // Component mount olduğunda sadece mounted state'i set et
  useEffect(() => {
    setMounted(true);
  }, []);

  // Structured Data for SEO - moved to layout.tsx for better SEO

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 text-white overflow-x-hidden'>
      {/* Decorative background elements - Figma design */}
      <div className='fixed inset-0 overflow-hidden pointer-events-none'>
        <div
          className='absolute top-20 left-10 w-1 h-1 bg-purple-300 rounded-full opacity-60 animate-pulse'
          aria-hidden='true'
        />
        <div
          className='absolute top-40 right-20 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-pulse'
          style={{ animationDelay: '1s' }}
          aria-hidden='true'
        />
        <div
          className='absolute top-60 left-1/4 w-1 h-1 bg-pink-300 rounded-full opacity-60 animate-pulse'
          style={{ animationDelay: '2s' }}
          aria-hidden='true'
        />
        <div
          className='absolute bottom-40 right-1/3 w-1 h-1 bg-purple-300 rounded-full opacity-60 animate-pulse'
          style={{ animationDelay: '0.5s' }}
          aria-hidden='true'
        />
        <div
          className='absolute bottom-60 left-1/2 w-1 h-1 bg-blue-300 rounded-full opacity-60 animate-pulse'
          style={{ animationDelay: '1.5s' }}
          aria-hidden='true'
        />
      </div>

      <main>
        {/* Hero Section - Figma design */}
        <section className='relative px-4 sm:px-6 lg:px-8 pt-8 pb-2 sm:pt-12 sm:pb-4'>
          <div className='max-w-4xl mx-auto text-center'>
            {/* Decorative elements */}
            <div
              className='absolute top-10 left-10 opacity-20'
              aria-hidden='true'
            >
              <span className='text-4xl'>✨</span>
            </div>
            <div
              className='absolute top-20 right-10 opacity-20'
              aria-hidden='true'
            >
              <span className='text-4xl'>✨</span>
            </div>
            <div
              className='absolute bottom-10 left-1/4 opacity-20'
              aria-hidden='true'
            >
              <span className='text-3xl'>🌙</span>
            </div>

            {/* Main content */}
            <div className='relative'>
              <h1 className='text-3xl sm:text-4xl lg:text-5xl mb-4 sm:mb-5 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 bg-clip-text text-transparent font-bold'>
                {t('homepage.hero.title')}
              </h1>

              <p className='text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-4 sm:mb-5 leading-relaxed'>
                {t('homepage.hero.description')}
              </p>

              {/* Fast Delivery Info Card - Figma design */}
              <FastDeliveryInfoCard
                selectedReadingType={null}
                readingTypes={READING_TYPES}
                locale={locale as 'tr' | 'en' | 'sr'}
                className='mb-2 sm:mb-3'
              />
            </div>
          </div>
        </section>

        {/* Tarot Card Drawing Section */}
        <section className='px-4 sm:px-6 lg:px-8 py-2 sm:py-4'>
          <div className='max-w-4xl mx-auto'>
            <TarotCardDrawing locale={locale} />
          </div>
        </section>

        {/* Services Section - Figma design */}
        <section className='relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
          {/* Background decorative element */}
          <div className='absolute inset-0 overflow-hidden pointer-events-none'>
            <div className='absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl' />
            <div className='absolute top-1/2 right-0 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl' />
          </div>

          <div className='max-w-7xl mx-auto relative'>
            {/* Services grid */}
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[
                {
                  icon: '🃏',
                  lucideIcon: Sparkles,
                  title: t('homepage.services.tarot.title'),
                  description: t('homepage.services.tarot.description'),
                  gradient: 'from-purple-500/20 to-pink-500/20',
                  glowColor: 'purple',
                  link: t('homepage.services.tarot.button'),
                  href: `/${locale}/tarotokumasi`,
                },
                {
                  icon: '🔢',
                  lucideIcon: TrendingUp,
                  title: t('homepage.services.numerology.title'),
                  description: t('homepage.services.numerology.description'),
                  gradient: 'from-blue-500/20 to-cyan-500/20',
                  glowColor: 'blue',
                  link: t('homepage.services.numerology.button'),
                  href: `/${locale}/numeroloji`,
                },
                {
                  icon: '🧠',
                  lucideIcon: Brain,
                  title: t('homepage.services.tests.title'),
                  description: t('homepage.services.tests.description'),
                  gradient: 'from-pink-500/20 to-rose-500/20',
                  glowColor: 'pink',
                  link: t('homepage.services.tests.button'),
                  href: `/${locale}/testler`,
                },
                {
                  icon: '🔮',
                  lucideIcon: Star,
                  title: t('psychTests.tests.nameTarot.title'),
                  description: t('psychTests.tests.nameTarot.description'),
                  gradient: 'from-indigo-500/20 to-purple-500/20',
                  glowColor: 'indigo',
                  link: t(
                    'homepage.services.nameTarot.button',
                    'Discover Your Card'
                  ),
                  href: `/${locale}/testler?test=name-tarot`,
                },
              ].map((service, index) => {
                const LucideIcon = service.lucideIcon;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    whileHover={{ y: -8 }}
                    className='group relative'
                  >
                    {/* Glow effect on hover */}
                    <div
                      className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300`}
                    />

                    {/* Card */}
                    <Link href={service.href}>
                      <div
                        className={`relative backdrop-blur-lg bg-gradient-to-br ${service.gradient} border border-white/10 rounded-2xl p-6 h-full flex flex-col shadow-xl group-hover:border-white/30 transition-all duration-300 cursor-pointer`}
                      >
                        {/* Icon container */}
                        <div className='relative mb-4'>
                          <div className='text-5xl mb-2'>{service.icon}</div>
                          <div className='absolute top-0 right-0 opacity-20 group-hover:opacity-40 transition-opacity'>
                            <LucideIcon className='w-12 h-12' />
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className='text-lg sm:text-xl mb-3 group-hover:text-white transition-colors'>
                          {service.title}
                        </h3>

                        {/* Description */}
                        <p className='text-gray-300 text-xs sm:text-sm leading-relaxed mb-4 flex-grow'>
                          {service.description}
                        </p>

                        {/* Link */}
                        <div className='pt-2 border-t border-white/10'>
                          <div
                            className={`${
                              service.glowColor === 'purple'
                                ? 'text-purple-300 hover:text-purple-200'
                                : service.glowColor === 'blue'
                                  ? 'text-blue-300 hover:text-blue-200'
                                  : service.glowColor === 'pink'
                                    ? 'text-pink-300 hover:text-pink-200'
                                    : 'text-indigo-300 hover:text-indigo-200'
                            } text-sm inline-flex items-center gap-2 group-hover:gap-3 transition-all`}
                          >
                            <span>{service.link}</span>
                            <span className='group-hover:translate-x-1 transition-transform'>
                              →
                            </span>
                          </div>
                        </div>

                        {/* Decorative corner elements */}
                        <div className='absolute top-3 right-3 w-2 h-2 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity' />
                        <div className='absolute bottom-3 left-3 w-2 h-2 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity' />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Trending Cards Section - Haftanın Kartları */}
        <section className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
          <div className='max-w-7xl mx-auto'>
            <TrendingCardsWidget locale={locale as 'tr' | 'en' | 'sr'} limit={6} />
          </div>
        </section>

        {/* Why Choose Section - Figma design */}
        <section className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-2xl sm:text-3xl text-center mb-8 sm:mb-10 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent'>
              {t('homepage.features.title', 'Why Choose Us?')}
            </h2>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8'>
              {[
                {
                  emoji: '✨',
                  title: t(
                    'homepage.features.authentic.title',
                    'Original Guidance'
                  ),
                  subtitle: t(
                    'homepage.features.authentic.description',
                    'Traditional tarot and numerology methods.'
                  ),
                },
                {
                  emoji: '🎯',
                  title: t(
                    'homepage.features.personalized.title',
                    'Personalized'
                  ),
                  subtitle: t(
                    'homepage.features.personalized.description',
                    'In-depth analyses made just for you.'
                  ),
                },
                {
                  emoji: '🔒',
                  title: t('homepage.features.secure.title', 'Secure'),
                  subtitle: t(
                    'homepage.features.secure.description',
                    'Your data is fully protected.'
                  ),
                },
                {
                  emoji: '🌍',
                  title: t(
                    'homepage.features.multilingual.title',
                    'Multilingual'
                  ),
                  subtitle: t(
                    'homepage.features.multilingual.description',
                    'Support in Turkish, English and Serbian.'
                  ),
                },
              ].map((feature, index) => (
                <GlassCard
                  key={index}
                  className='hover:border-purple-400/30 transition-colors'
                >
                  <div className='text-3xl mb-3'>{feature.emoji}</div>
                  <h3 className='text-lg mb-2'>{feature.title}</h3>
                  <p className='text-gray-400 text-sm'>{feature.subtitle}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Figma design */}
        <section className='px-4 sm:px-6 lg:px-8 py-8 sm:py-12'>
          <div className='max-w-6xl mx-auto'>
            <h2 className='text-2xl sm:text-3xl text-center mb-8 sm:mb-10 bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-transparent'>
              {t('homepage.stats.title', 'Trusted Service')}
            </h2>

            <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8'>
              <GlassCard className='text-center hover:shadow-2xl hover:shadow-purple-500/20 transition-shadow'>
                <div className='text-4xl sm:text-5xl mb-3 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-bold'>
                  10K+
                </div>
                <p className='text-gray-300'>
                  {t('homepage.stats.users', 'Active Users')}
                </p>
              </GlassCard>

              <GlassCard className='text-center hover:shadow-2xl hover:shadow-purple-500/20 transition-shadow'>
                <div className='text-4xl sm:text-5xl mb-3 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-bold'>
                  {!mounted ? (
                    <div className='animate-pulse text-purple-300'>...</div>
                  ) : (
                    initialReadings.toLocaleString('tr-TR')
                  )}
                </div>
                <p className='text-gray-300'>
                  {t('homepage.stats.readings', 'Completed Readings')}
                </p>
              </GlassCard>

              <GlassCard className='text-center hover:shadow-2xl hover:shadow-purple-500/20 transition-shadow'>
                <div className='text-4xl sm:text-5xl mb-3 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent font-bold'>
                  94%
                </div>
                <p className='text-gray-300'>
                  {t('homepage.stats.satisfaction', 'Satisfaction Rate')}
                </p>
              </GlassCard>
            </div>
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
