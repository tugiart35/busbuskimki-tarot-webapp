import { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

const testsSeoData = {
  tr: {
    title: 'Psikolojik Testler: MBTI, Enneagram, Kokoloji | BüşBüşKimKi',
    description:
      'MBTI, Enneagram, Big Five ve kokoloji testleri ile kendinizi keşfedin. Deniz Fırtınası kokoloji testi, İsim Enerjisi, Stres Testi ve daha fazlası ücretsiz!',
    keywords: [
      'psikolojik test',
      'kişilik testi',
      'MBTI',
      'Enneagram',
      'kokoloji testi',
      'stres testi',
      'isim enerjisi',
      'numeroloji testi',
      'ücretsiz test',
    ],
    path: '/tr/testler',
  },
  en: {
    title: 'Psychological Tests: MBTI, Enneagram, Kokology | BüşBüşKimKi',
    description:
      'Discover yourself with MBTI, Enneagram, Big Five and Kokology quizzes. Sea Storm Kokology, Name Energy numerology, stress level test and more – all free!',
    keywords: [
      'psychology test',
      'personality test',
      'MBTI',
      'Enneagram',
      'Kokology test',
      'stress test',
      'name numerology',
      'free quiz',
    ],
    path: '/en/tests',
  },
  sr: {
    title: 'Psihološki Testovi: MBTI, Eneagram, Kokologija | BüşBüşKimKi',
    description:
      'Otkrij sebe uz MBTI, Eneagram, Big Five i kokologija testove. Test Olujne Oluje, energija imena, test nivoa stresa i još mnogo toga – besplatno!',
    keywords: [
      'psihološki test',
      'test ličnosti',
      'MBTI',
      'Eneagram',
      'kokologija',
      'test stresa',
      'energija imena',
      'besplatan test',
    ],
    path: '/sr/testovi',
  },
} as const;

type TestsLocale = keyof typeof testsSeoData;

function resolveLocale(locale: string): TestsLocale {
  return (['tr', 'en', 'sr'].includes(locale) ? locale : 'tr') as TestsLocale;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolveLocale(locale);
  const data = testsSeoData[resolvedLocale];

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}${data.path}`,
      languages: {
        'x-default': `${baseUrl}${testsSeoData.en.path}`,
        tr: `${baseUrl}${testsSeoData.tr.path}`,
        en: `${baseUrl}${testsSeoData.en.path}`,
        sr: `${baseUrl}${testsSeoData.sr.path}`,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${baseUrl}${data.path}`,
      siteName: 'BüşBüşKimKi',
      type: 'website',
      locale:
        resolvedLocale === 'tr'
          ? 'tr_TR'
          : resolvedLocale === 'en'
            ? 'en_US'
            : 'sr_RS',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}

// ISR Configuration for optimal performance
export const revalidate = 3600; // 1 hour cache
export const fetchCache = 'force-cache'; // Aggressive caching

export default function TestlerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
