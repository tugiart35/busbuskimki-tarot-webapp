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

  // Ana sayfada otomatik yönlendirme kaldırıldı
  // Kullanıcı ana sayfayı görebilir ve isterse dashboard'a gidebilir

  // PERFORMANCE OPTIMIZATION: Database query kaldırıldı
  // Server component'ten ISR ile cache'lenmiş veri geliyor (initialReadings prop)
  // Her sayfa yüklemesinde query çalışmıyor - sadece 5 dakikada bir ISR ile güncelleniyor

  // Component mount olduğunda sadece mounted state'i set et
  useEffect(() => {
    setMounted(true);
  }, []);

  // Structured Data for SEO - moved to layout.tsx for better SEO

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white'>
      {/* Modern Hero Section */}
      <div className='relative overflow-hidden'>
        {/* Modern Background Effects */}
        <div className='absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-900' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]' />
        <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]' />

        {/* Animated Grid Pattern */}
        <div className='absolute inset-0 opacity-[0.02]'>
          <div className='absolute inset-0 bg-[linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.05)_25%,rgba(255,255,255,0.05)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.05)_75%,rgba(255,255,255,0.05)_76%,transparent_77%)] bg-[length:50px_50px] animate-pulse' />
        </div>

        {/* Modern Floating Elements */}
        <div
          className='absolute top-20 left-10 text-3xl opacity-20 animate-float filter drop-shadow-lg'
          aria-hidden='true'
          style={{ animationDelay: '0s' }}
        >
          ✨
        </div>
        <div
          className='absolute top-40 right-20 text-2xl opacity-25 animate-float filter drop-shadow-lg'
          aria-hidden='true'
          style={{ animationDelay: '1s' }}
        >
          🔮
        </div>
        <div
          className='absolute bottom-40 left-20 text-xl opacity-20 animate-float filter drop-shadow-lg'
          aria-hidden='true'
          style={{ animationDelay: '2s' }}
        >
          💎
        </div>
        <div
          className='absolute top-60 right-10 text-2xl opacity-25 animate-float filter drop-shadow-lg'
          aria-hidden='true'
          style={{ animationDelay: '3s' }}
        >
          🌙
        </div>

        {/* Main Content */}
        <div className='relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center'>
          {/* Modern Hero Content */}
          <header className='mb-20'>
            <h1 className='text-5xl md:text-7xl lg:text-8xl font-bold mb-8 text-white leading-tight'>
              <span className='bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent'>
                {t('homepage.hero.title')}
              </span>
            </h1>
            <h2 className='text-xl md:text-2xl lg:text-3xl text-white/90 font-medium mb-6 max-w-4xl mx-auto'>
              {t('homepage.hero.subtitle')}
            </h2>
            <p className='text-lg md:text-xl text-white/70 max-w-4xl mx-auto leading-relaxed'>
              {t('homepage.hero.description')}
            </p>
          </header>
          {/* Delivery Time Alert */}
          <FastDeliveryInfoCard
            selectedReadingType={null}
            readingTypes={{
              SIMPLE: 'simple',
              DETAILED: 'detailed',
              WRITTEN: 'written',
            }}
            locale={locale as 'tr' | 'en' | 'sr'}
            className='mb-12'
          />
          {/* Services Showcase */}
          <section
            className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl w-full mb-16 animate-fadeIn'
            aria-label='Hizmetlerimiz'
          >
            {/* Modern Tarot Service Card */}
            <Link
              href={`/${locale}/tarotokumasi`}
              className='group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/30 shadow-2xl hover:shadow-3xl'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              <div className='relative z-10'>
                <div
                  className='text-5xl mb-6 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg'
                  aria-hidden='true'
                >
                  🔮
                </div>
                <h2 className='text-3xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors'>
                  {t('homepage.services.tarot.title')}
                </h2>
                <p className='text-white/80 leading-relaxed mb-6 text-lg'>
                  {t('homepage.services.tarot.description')}
                </p>
                <div className='flex flex-wrap gap-3 mb-6'>
                  {(() => {
                    const features = t('homepage.services.tarot.features');
                    return Array.isArray(features)
                      ? features.map((feature: string, index: number) => (
                          <span
                            key={index}
                            className='px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300'
                          >
                            {feature}
                          </span>
                        ))
                      : null;
                  })()}
                </div>
                <div className='text-white font-semibold group-hover:text-white/80 transition-colors text-lg flex items-center gap-2'>
                  {t('homepage.services.tarot.button')}
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>
                    →
                  </span>
                </div>
              </div>
            </Link>

            {/* Modern Numerology Service Card */}
            <Link
              href={`/${locale}/numeroloji`}
              className='group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/30 shadow-2xl hover:shadow-3xl'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              <div className='relative z-10'>
                <div
                  className='text-5xl mb-6 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg'
                  aria-hidden='true'
                >
                  🔢
                </div>
                <h2 className='text-3xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors'>
                  {t('homepage.services.numerology.title')}
                </h2>
                <p className='text-white/80 leading-relaxed mb-6 text-lg'>
                  {t('homepage.services.numerology.description')}
                </p>
                <div className='flex flex-wrap gap-3 mb-6'>
                  {(() => {
                    const features = t('homepage.services.numerology.features');
                    return Array.isArray(features)
                      ? features.map((feature: string, index: number) => (
                          <span
                            key={index}
                            className='px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300'
                          >
                            {feature}
                          </span>
                        ))
                      : null;
                  })()}
                </div>
                <div className='text-white font-semibold group-hover:text-white/80 transition-colors text-lg flex items-center gap-2'>
                  {t('homepage.services.numerology.button')}
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>
                    →
                  </span>
                </div>
              </div>
            </Link>

            {/* Modern Psychological Tests Service Card */}
            <Link
              href={`/${locale}/testler`}
              className='group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/20 p-8 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/30 shadow-2xl hover:shadow-3xl'
            >
              <div className='absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              <div className='relative z-10'>
                <div
                  className='text-5xl mb-6 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg'
                  aria-hidden='true'
                >
                  🧠
                </div>
                <h2 className='text-3xl font-bold text-white mb-4 group-hover:text-white/90 transition-colors'>
                  {t('homepage.services.tests.title')}
                </h2>
                <p className='text-white/80 leading-relaxed mb-6 text-lg'>
                  {t('homepage.services.tests.description')}
                </p>
                <div className='flex flex-wrap gap-3 mb-6'>
                  {(() => {
                    const features = t('homepage.services.tests.features');
                    return Array.isArray(features)
                      ? features.map((feature: string, index: number) => (
                          <span
                            key={index}
                            className='px-4 py-2 bg-white/10 backdrop-blur-sm text-white/90 text-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300'
                          >
                            {feature}
                          </span>
                        ))
                      : null;
                  })()}
                </div>
                <div className='text-white font-semibold group-hover:text-white/80 transition-colors text-lg flex items-center gap-2'>
                  {t('homepage.services.tests.button')}
                  <span className='group-hover:translate-x-1 transition-transform duration-300'>
                    →
                  </span>
                </div>
              </div>
            </Link>
          </section>

          {/* Modern Features Section */}
          <section
            className='max-w-6xl w-full mb-20'
            aria-label='Özelliklerimiz'
          >
            <h3 className='text-4xl md:text-5xl font-bold text-white mb-16 text-center'>
              <span className='bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent'>
                {t('homepage.features.title')}
              </span>
            </h3>
            <div className='grid md:grid-cols-2 lg:grid-cols-4 gap-6'>
              {[
                {
                  icon: '✨',
                  title: t('homepage.features.authentic.title'),
                  description: t('homepage.features.authentic.description'),
                },
                {
                  icon: '🎯',
                  title: t('homepage.features.personalized.title'),
                  description: t('homepage.features.personalized.description'),
                },
                {
                  icon: '🔒',
                  title: t('homepage.features.secure.title'),
                  description: t('homepage.features.secure.description'),
                },
                {
                  icon: '🌍',
                  title: t('homepage.features.multilingual.title'),
                  description: t('homepage.features.multilingual.description'),
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className='group bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:bg-white/10 hover:border-white/30 shadow-xl hover:shadow-2xl'
                >
                  <div
                    className='text-4xl mb-4 group-hover:scale-110 transition-transform duration-500 filter drop-shadow-lg'
                    aria-hidden='true'
                  >
                    {feature.icon}
                  </div>
                  <h4 className='text-xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors'>
                    {feature.title}
                  </h4>
                  <p className='text-white/70 text-sm leading-relaxed'>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Modern Stats Section */}
          <section
            className='max-w-5xl w-full mb-16'
            aria-label='İstatistiklerimiz'
          >
            <h4 className='text-2xl md:text-4xl font-bold text-white mb-8 md:mb-12 text-center'>
              <span className='bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent'>
                {t('homepage.stats.title')}
              </span>
            </h4>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center'>
              <div className='bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-8 hover:bg-white/10 hover:border-white/30 transition-all duration-500 shadow-lg sm:shadow-xl hover:shadow-2xl'>
                <div className='text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3'>10K+</div>
                <div className='text-white/70 text-xs sm:text-sm font-medium'>
                  {t('homepage.stats.users')}
                </div>
              </div>
              <div className='bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-8 hover:bg-white/10 hover:border-white/30 transition-all duration-500 shadow-lg sm:shadow-xl hover:shadow-2xl'>
                <div className='text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3'>
                  {!mounted ? (
                    <div className='animate-pulse text-white/50'>...</div>
                  ) : (
                    initialReadings.toLocaleString('tr-TR')
                  )}
                </div>
                <div className='text-white/70 text-xs sm:text-sm font-medium'>
                  {t('homepage.stats.readings')}
                </div>
              </div>
              <div className='bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-5 sm:p-8 hover:bg-white/10 hover:border-white/30 transition-all duration-500 shadow-lg sm:shadow-xl hover:shadow-2xl'>
                <div className='text-3xl sm:text-4xl font-bold text-white mb-2 sm:mb-3'>94%</div>
                <div className='text-white/70 text-xs sm:text-sm font-medium'>
                  {t('homepage.stats.satisfaction')}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
