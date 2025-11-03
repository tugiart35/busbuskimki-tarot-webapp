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
import { BottomNavigation } from '@/features/shared/layout';
import type { Metadata } from 'next';

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

export default function TestlerPage() {
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
        {/* SEO-Optimized Header */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            <span className='bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent'>
              Psikolojik Testler
            </span>
          </h1>
          <p className='text-lg text-white/70 max-w-2xl mx-auto mb-6'>
            Kendinizi daha iyi tanıyın, kişiliğinizi keşfedin
          </p>

          {/* E-E-A-T: Expertise ve Trustworthiness */}
          <div className='bg-white/5 rounded-lg p-4 border border-white/10 max-w-2xl mx-auto'>
            <p className='text-sm text-white/60'>
              Bilimsel kişilik psikolojisi literatürüne dayanan, ücretsiz ve
              güvenilir testler. MBTI, Enneagram ve Big Five gibi dünya çapında
              kabul görmüş yöntemlerle kişilik analizinizi yapın.
            </p>
          </div>
        </div>

        <KokolojiTest />

        {/* E-E-A-T: Authoritativeness - Kaynak Bilgisi */}
        <div className='mt-12 bg-white/5 rounded-xl p-6 border border-white/10'>
          <h2 className='text-xl font-bold text-white mb-4'>
            📚 Testlerimizin Bilimsel Temeli
          </h2>
          <div className='space-y-3 text-sm text-white/70'>
            <p>
              <strong className='text-white'>MBTI:</strong> Myers-Briggs Type
              Indicator, Carl Jung'un psikolojik tipler teorisine dayanır ve
              dünya çapında 2 milyondan fazla kişi tarafından yıllık olarak
              kullanılmaktadır.
            </p>
            <p>
              <strong className='text-white'>Enneagram:</strong> Enneagram
              Institute ve International Enneagram Association'ın
              araştırmalarına dayanan, motivasyon ve davranış kalıpları analiz
              sistemidir.
            </p>
            <p>
              <strong className='text-white'>Big Five (OCEAN):</strong> Modern
              psikolojinin en geçerli ve güvenilir kişilik modeli olarak kabul
              edilir. 50 yılı aşkın araştırma ve binlerce akademik yayın
              tarafından desteklenmektedir.
            </p>
            <p>
              <strong className='text-white'>Deniz Fırtınası Testi:</strong>{' '}
              Kokoloji (projektif psikoloji) yöntemi ile bilinçaltı analizi
              yapar. Kriz anlarında gösterdiğiniz tepkileri değerlendirerek
              psikolojik dayanıklılık arketipinizi ortaya çıkarır. Lider,
              Şifacı, Bilge veya Arayıcı arketiplerine dayalı bir analizdir.
            </p>
            <p>
              <strong className='text-white'>
                İsim Enerjine Göre Tarot Kartın:
              </strong>{' '}
              Pythagoras numerolojisi sistemi ile adınızdaki harflerin sayısal
              titreşimlerini hesaplar ve Rider-Waite tarot sembolizmi ile
              eşleştirir. Her harf belirli bir enerji taşır; bu enerji, kişisel
              yolculuğunuzu simgeleyen bir tarot kartıyla birleşir.
            </p>
            <p>
              <strong className='text-white'>Stres Düzeyi Testi:</strong> DASS21
              (Depression Anxiety Stress Scales) ölçeğine dayanan bilimsel bir
              stres değerlendirme testidir. Lovibond & Lovibond (1995)
              tarafından geliştirilmiş ve yaygın olarak kullanılan bu ölçek,
              stres seviyenizi değerlendirir ve kişiselleştirilmiş meditasyon
              önerileri sunar.
            </p>
            <p>
              <strong className='text-white'>
                Aşk Enerjisi (Love Vibration):
              </strong>{' '}
              Klasik astroloji ve tarot literatürüne dayanan, Venüs (romantizm),
              Mars (tutku) ve Merkür (iletişim) gezegen enerjilerini analiz
              eder. Tarot kartları ile ilişkilendirilerek kişisel aşk enerjinizi
              keşfetmenizi sağlar.
            </p>
            <p>
              <strong className='text-white'>Arkadaş Grubu Enerjisi:</strong>{' '}
              Sosyal psikoloji ve grup dinamikleri araştırmalarına dayanan,
              eğlenceli ve ilişkilendirilebilir sosyal rol analizi sunar.
            </p>
            <p className='text-xs text-white/50 mt-4'>
              <strong>Not:</strong> Bu testler kişisel gelişim, eğlence ve
              farkındalık amaçlıdır. Profesyonel psikolojik değerlendirme veya
              astrolojik danışmanlık yerine kullanılmamalıdır.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
