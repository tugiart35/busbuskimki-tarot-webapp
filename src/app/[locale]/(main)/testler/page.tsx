/*
  Psikolojik Testler Sayfası - SEO & E-E-A-T Optimized
  ----------------------------------------------------------------------
  Bu dosya ne işe yarar?
  - Kullanıcılara bilimsel psikolojik testler sunar
  - MBTI, Enneagram, Big Five, Kokoloji testlerini içerir
  - SEO ve E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) uyumlu
  - Modern tasarım ile kullanıcı deneyimi sağlar
  
  SEO Optimizasyonları:
  - Detaylı metadata
  - Structured data (Schema.org)
  - Anahtar kelime optimizasyonu
  - E-E-A-T prensipleri
*/

import { KokolojiTest } from '@/features/psychological-tests';
import { DynamicBottomNavigation as BottomNavigation } from './DynamicTestComponents';
import { getTranslations } from 'next-intl/server';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

const localePaths = {
  tr: '/tr/testler',
  en: '/en/tests',
  sr: '/sr/testovi',
} as const;

type TestsLocale = keyof typeof localePaths;

const structuredContent = {
  tr: {
    pageName: 'Psikolojik Testler',
    pageDescription:
      'Bilimsel ve eğlenceli testlerle kişiliğinizi, kriz anındaki tavrınızı ve enerji dengenizi keşfedin.',
    breadcrumbHome: 'Ana Sayfa',
    breadcrumbCurrent: 'Psikolojik Testler',
    tests: [
      {
        name: 'Deniz Fırtınası Kokoloji Testi',
        description:
          'Kriz anında hangi arketiple hareket ettiğinizi keşfetmek için kokoloji (projektif psikoloji) metodu.',
      },
      {
        name: 'İsim Enerjisi Analizi',
        description:
          'Pythagoras numerolojisi ile isminizdeki titreşimleri hesaplayın ve tarot kartınızla eşleştirin.',
      },
      {
        name: 'Stres Düzeyi Testi',
        description:
          'DASS21 temelli değerlendirme ile stres seviyenizi ölçün ve meditasyon önerileri alın.',
      },
    ],
  },
  en: {
    pageName: 'Psychological Tests',
    pageDescription:
      'Discover your personality, crisis archetype and energy balance with scientific and entertaining quizzes.',
    breadcrumbHome: 'Home',
    breadcrumbCurrent: 'Psychological Tests',
    tests: [
      {
        name: 'Sea Storm Kokology Test',
        description:
          'Explore your crisis archetype using the kokology (projective psychology) method.',
      },
      {
        name: 'Name Energy Analysis',
        description:
          'Calculate the numerical vibration of your name with Pythagorean numerology and match it with a tarot archetype.',
      },
      {
        name: 'Stress Level Quiz',
        description:
          'Assess your stress level with the DASS21-based scale and receive meditation suggestions.',
      },
    ],
  },
  sr: {
    pageName: 'Psihološki Testovi',
    pageDescription:
      'Otkrijte svoju ličnost, krizni arhetip i energetsku ravnotežu kroz naučne i zabavne testove.',
    breadcrumbHome: 'Početna',
    breadcrumbCurrent: 'Psihološki Testovi',
    tests: [
      {
        name: 'Test Olujne Oluje (Kokologija)',
        description:
          'Kokologija – projektivna psihologija – pomaže da otkrijete kako reagujete u kriznim situacijama.',
      },
      {
        name: 'Analiza Energije Imena',
        description:
          'Izračunajte vibracije svog imena pomoću Pitagorine numerologije i povežite ih sa tarot simbolikom.',
      },
      {
        name: 'Test Nivoa Stresa',
        description:
          'Procijenite nivo stresa uz skalu zasnovanu na DASS21 i dobijte predloge za meditaciju.',
      },
    ],
  },
} as const;

function resolveLocale(locale: string): TestsLocale {
  return (['tr', 'en', 'sr'].includes(locale) ? locale : 'tr') as TestsLocale;
}

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function TestlerPage({ params }: PageProps) {
  // Locale'i params'tan al
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);

  // Çevirileri al
  const t = await getTranslations({
    locale,
    namespace: 'psychTests.page.scientificBasis',
  });

  // Structured Data (Schema.org) - E-E-A-T için
  const pageContent = structuredContent[resolvedLocale];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageContent.pageName,
    description: pageContent.pageDescription,
    url: `${baseUrl}${localePaths[resolvedLocale]}`,
    inLanguage:
      resolvedLocale === 'tr'
        ? 'tr'
        : resolvedLocale === 'en'
          ? 'en'
          : 'sr',
    isPartOf: {
      '@type': 'WebSite',
      name: 'BüşBüşKimKi',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BüşBüşKimKi',
      url: baseUrl,
    },
    author: {
      '@type': 'Person',
      name: 'Dr. Selin Yüzbaşıoğlu',
      jobTitle: 'Psikolojik Danışman',
    },
    hasPart: pageContent.tests.map(test => ({
      '@type': 'Quiz',
      name: test.name,
      description: test.description,
      isAccessibleForFree: true,
      inLanguage:
        resolvedLocale === 'tr'
          ? 'tr'
          : resolvedLocale === 'en'
            ? 'en'
            : 'sr',
    })),
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: pageContent.breadcrumbHome,
          item: baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: pageContent.breadcrumbCurrent,
          item: `${baseUrl}${localePaths[resolvedLocale]}`,
        },
      ],
    },
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white'>
      {/* Structured Data */}
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Background Effects */}
      <div className='absolute inset-0 bg-gradient-to-br from-slate-950 via-black to-slate-900' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3),transparent_50%)]' />
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_50%)]' />

      {/* Main Content */}
      <div className='relative z-10 container mx-auto px-4 py-12 max-w-4xl'>
        <KokolojiTest />

        {/* E-E-A-T: Authoritativeness - Kaynak Bilgisi */}
        <div className='mt-12 bg-white/5 rounded-xl p-6 border border-white/10'>
          <h2 className='text-xl font-bold text-white mb-4'>{t('title')}</h2>
          <div className='space-y-3 text-sm text-white/70'>
            <p>
              <strong className='text-white'>MBTI:</strong> {t('mbti')}
            </p>
            <p>
              <strong className='text-white'>Enneagram:</strong>{' '}
              {t('enneagram')}
            </p>
            <p>
              <strong className='text-white'>Big Five (OCEAN):</strong>{' '}
              {t('bigFive')}
            </p>
            <p>
              <strong className='text-white'>Deniz Fırtınası Testi:</strong>{' '}
              {t('seaStorm')}
            </p>
            <p>
              <strong className='text-white'>
                İsim Enerjine Göre Tarot Kartın:
              </strong>{' '}
              {t('nameEnergy')}
            </p>
            <p>
              <strong className='text-white'>Stres Düzeyi Testi:</strong>{' '}
              {t('stressTest')}
            </p>
            <p>
              <strong className='text-white'>
                Aşk Enerjisi (Love Vibration):
              </strong>{' '}
              {t('loveVibration')}
            </p>
            <p>
              <strong className='text-white'>Arkadaş Grubu Enerjisi:</strong>{' '}
              {t('friendGroup')}
            </p>
            <p className='text-xs text-white/50 mt-4'>
              <strong>Not:</strong> {t('disclaimer')}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
