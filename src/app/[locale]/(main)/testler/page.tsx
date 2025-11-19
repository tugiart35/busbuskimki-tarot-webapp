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

import { DynamicBottomNavigation as BottomNavigation } from './DynamicTestComponents';
import { TestlerPageClient } from './TestlerPageClient';

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

  // Structured Data (Schema.org) - E-E-A-T için
  const pageContent = structuredContent[resolvedLocale];
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageContent.pageName,
    description: pageContent.pageDescription,
    url: `${baseUrl}${localePaths[resolvedLocale]}`,
    inLanguage:
      resolvedLocale === 'tr' ? 'tr' : resolvedLocale === 'en' ? 'en' : 'sr',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Büşbüşkimki',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Büşbüşkimki',
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
        resolvedLocale === 'tr' ? 'tr' : resolvedLocale === 'en' ? 'en' : 'sr',
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
        <TestlerPageClient />
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
