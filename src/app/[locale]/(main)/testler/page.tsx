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
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

// SEO Metadata - E-E-A-T Uyumlu
export const metadata: Metadata = {
  title: 'Deniz Fırtınası Testi, İsim Enerjisi, MBTI | busbuskimki',
  description:
    'Krizde kim oluyorsun? Deniz Fırtınası kokoloji testi, İsim Enerjisi numerolojisi, MBTI, Enneagram, Stres Testi, Aşk Enerjisi. Hızlı, eğlenceli ve viral testler!',
  keywords: [
    'psikolojik test',
    'kişilik testi',
    'isim enerjisi',
    'numeroloji testi',
    'isim numerolojisi',
    'tarot kartı testi',
    'pythagoras numerolojisi',
    'deniz fırtınası testi',
    'kokoloji testi',
    'bilinçaltı analizi',
    'psikolojik dayanıklılık',
    'fırtına kişilik testi',
    'kriz yönetimi testi',
    'MBTI testi',
    'enneagram testi',
    'big five testi',
    'OCEAN testi',
    'aşk enerjisi testi',
    'love vibration test',
    'venüs mars merkür',
    'astroloji testi',
    'tarot ve astroloji',
    'aşk astrolojisi',
    'gezegen enerjileri',
    'stres testi',
    'stres düzeyi testi',
    'dass21 testi',
    'stres ölçeği',
    'meditasyon önerileri',
    'stres yönetimi',
    'psikolojik stres testi',
    'arkadaş grubu testi',
    'arkadaş grubundaki enerjin',
    'eğlenceli kişilik testi',
    'viral kişilik testi',
    'ücretsiz kişilik testi',
    'online psikoloji testi',
    'kişilik analizi',
    'kendini tanıma',
    'psikolojik analiz',
    'drama kraliçesi testi',
    'sosyal enerji testi',
  ],
  authors: [{ name: 'busbuskimki Psikoloji Ekibi' }],
  openGraph: {
    title:
      'Psikolojik Testler: MBTI, Enneagram, Aşk Enerjisi (Astroloji) | busbuskimki',
    description:
      'Bilimsel psikolojik ve astrolojik testlerle kendinizi keşfedin! MBTI, Enneagram, Aşk Enerjin (Venüs-Mars-Merkür), Arkadaş Grubu testleri. Tarot ve astroloji ile!',
    type: 'website',
    siteName: 'Büşbüşkimki',
    locale: 'tr_TR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aşk Enerjin Nedir? Venüs, Mars, Merkür Testi 💕',
    description:
      'Astroloji ve tarot ile aşk enerjini keşfet! MBTI, Enneagram, Big Five testleri de var. Ücretsiz!',
  },
  alternates: {
    canonical: '/testler',
    languages: {
      tr: '/tr/testler',
      en: '/en/tests',
      sr: '/sr/testovi',
    },
  },
};

export default async function TestlerPage({ params }: PageProps) {
  // Locale'i params'tan al
  const { locale } = await params;

  // Çevirileri al
  const t = await getTranslations({
    locale,
    namespace: 'psychTests.page.scientificBasis',
  });

  // Structured Data (Schema.org) - E-E-A-T için
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Psikolojik Testler - MBTI, Enneagram, Big Five',
    description:
      'Bilimsel psikolojik testler ile kendinizi keşfedin. MBTI kişilik testi, Enneagram analizi, Big Five (OCEAN) testi ve kokoloji testleri.',
    url: 'https://busbuskimki.com/testler',
    mainEntity: {
      '@type': 'Quiz',
      name: 'Psikolojik Kişilik Testleri',
      description:
        'MBTI, Enneagram ve Big Five testleri ile kişiliğinizi, motivasyonlarınızı ve davranış kalıplarınızı keşfedin.',
      educationalLevel: 'Beginner',
      typicalAgeRange: '18-65',
      teaches: 'Kişilik analizi, öz farkındalık, psikolojik gelişim',
      about: {
        '@type': 'Thing',
        name: 'Psikoloji ve Kişilik Analizi',
        description:
          'Bilimsel kişilik testleri, psikolojik değerlendirmeler ve kişisel gelişim araçları',
      },
      provider: {
        '@type': 'Organization',
        name: 'busbuskimki',
        description:
          'Profesyonel tarot, numeroloji ve psikolojik test platformu',
      },
      assesses: [
        'MBTI Kişilik Tipi',
        'Enneagram Tipi',
        'Big Five Kişilik Boyutları',
        'Kişilik Özellikleri',
      ],
      isAccessibleForFree: true,
      inLanguage: ['tr', 'en', 'sr'],
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Ana Sayfa',
          item: 'https://busbuskimki.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Psikolojik Testler',
          item: 'https://busbuskimki.com/testler',
        },
      ],
    },
    hasPart: [
      {
        '@type': 'Quiz',
        name: 'Deniz Fırtınası Testi: Zor Zamanlarda Kim Oluyorsun?',
        description:
          'Bir fırtınanın ortasında nasıl davranırsın? Bilinçaltında krizle nasıl baş ettiğini keşfet. Kokoloji ile psikolojik dayanıklılığını öğren.',
        numberOfQuestions: 4,
        educationalUse: 'Kriz yönetimi ve psikolojik dayanıklılık analizi',
        isAccessibleForFree: true,
        about: [
          {
            '@type': 'Thing',
            name: 'Kokoloji',
            description:
              'Projektif psikoloji testleri - bilinçaltı analizi yöntemi',
          },
          {
            '@type': 'Thing',
            name: 'Psikolojik Dayanıklılık',
            description: 'Stres ve kriz anlarında baş etme stratejileri',
          },
        ],
      },
      {
        '@type': 'Quiz',
        name: 'İsim Enerjine Göre Tarot Kartın',
        description:
          'Adının numerolojik enerjisini hesapla, kaderini simgeleyen tarot kartını öğren. Pythagoras numerolojisi ve Rider-Waite tarot.',
        numberOfQuestions: 1,
        educationalUse: 'Numeroloji ve Tarot analizi',
        isAccessibleForFree: true,
        about: [
          {
            '@type': 'Thing',
            name: 'Pythagoras Numerolojisi',
            description:
              'Her harfin sayısal titreşimi ile kişisel enerji analizi',
          },
          {
            '@type': 'Thing',
            name: 'Rider-Waite Tarot',
            description: 'Klasik tarot sembolizmi ve kart yorumları',
          },
        ],
      },
      {
        '@type': 'Quiz',
        name: 'MBTI Kişilik Testi',
        description: '16 kişilik tipinden hangisi olduğunuzu keşfedin',
        numberOfQuestions: 20,
        educationalUse: 'Kişilik analizi',
      },
      {
        '@type': 'Quiz',
        name: 'Enneagram Kişilik Testi',
        description:
          'Dokuz farklı kişilik tipinden hangisi olduğunuzu keşfedin',
        numberOfQuestions: 27,
        educationalUse: 'Motivasyon ve korku analizi',
      },
      {
        '@type': 'Quiz',
        name: 'Big Five (OCEAN) Kişilik Testi',
        description:
          '5 temel kişilik boyutunuzu keşfedin: Açıklık, Sorumluluk, Dışa Dönüklük, Uyumluluk, Duygusal Denge',
        numberOfQuestions: 25,
        educationalUse: 'Kişilik boyutları analizi',
      },
      {
        '@type': 'Quiz',
        name: 'Arkadaş Grubundaki Enerjin',
        description:
          'Sen arkadaş grubunda nasıl bir roldesin? Drama Kraliçesi, Akıl Hocası, Plansız Gezgin mi?',
        numberOfQuestions: 10,
        educationalUse: 'Sosyal dinamikler ve grup rolleri analizi',
        isAccessibleForFree: true,
        interactionStatistic: {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/ShareAction',
          userInteractionCount: 0,
        },
      },
      {
        '@type': 'Quiz',
        name: 'Aşk Enerjin (Love Vibration Test)',
        description:
          'Astrolojik gezegenler ve tarot kartları ile aşk enerjinizi keşfedin. Venüs, Mars, Merkür enerjileri ile titreşiminizi öğrenin.',
        numberOfQuestions: 7,
        educationalUse: 'Astroloji ve aşk enerjisi analizi',
        isAccessibleForFree: true,
        about: [
          {
            '@type': 'Thing',
            name: 'Venüs Astrolojisi',
            description: 'Aşk, romantizm ve uyum gezegeni',
          },
          {
            '@type': 'Thing',
            name: 'Mars Astrolojisi',
            description: 'Tutku, arzu ve eylem gezegeni',
          },
          {
            '@type': 'Thing',
            name: 'Merkür Astrolojisi',
            description: 'İletişim, akıl ve bağlantı gezegeni',
          },
        ],
      },
      {
        '@type': 'Quiz',
        name: 'Stres Düzeyi Testi',
        description:
          'DASS21 temelli bilimsel stres değerlendirme testi. Stres seviyenizi ölçün ve kişiselleştirilmiş meditasyon önerileri alın.',
        numberOfQuestions: 15,
        educationalUse: 'Stres değerlendirme ve yönetimi',
        isAccessibleForFree: true,
        about: [
          {
            '@type': 'Thing',
            name: 'DASS21',
            description:
              'Depression Anxiety Stress Scales - Lovibond & Lovibond (1995)',
          },
          {
            '@type': 'Thing',
            name: 'Stres Yönetimi',
            description: 'Meditasyon ve rahatlama teknikleri',
          },
        ],
        citation: {
          '@type': 'ScholarlyArticle',
          name: 'Manual for the Depression Anxiety Stress Scales',
          author: {
            '@type': 'Person',
            name: 'S. H. Lovibond & P. F. Lovibond',
          },
          datePublished: '1995',
        },
      },
    ],
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
