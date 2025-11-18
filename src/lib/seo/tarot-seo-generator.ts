import { Metadata } from 'next';
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  type FAQSchema,
  type ServiceSchema,
} from './schema-markup';

interface TarotPageStructuredData {
  organization: ReturnType<typeof generateOrganizationSchema>;
  website: ReturnType<typeof generateWebSiteSchema>;
  service: ServiceSchema;
  breadcrumb: ReturnType<typeof generateBreadcrumbSchema>;
  faq: ReturnType<typeof generateFAQSchema>;
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

const tarotPageSeoData = {
  tr: {
    title: 'Büşbüşkimki - Tarot & Kişisel Açılımlar',
    description:
      'Ücretsiz ve ücretli tarot açılımlarıyla aşk, kariyer, para ve evlilik konularında rehberlik alın.',
    keywords: [
      'tarot okuma',
      'ücretsiz tarot',
      'ücretli tarot',
      'aşk tarot',
      'kariyer tarot',
      'para tarot',
      'evlilik tarot',
      'sevgililik tarot',
      'kişisel açılım',
      'tarot rehberlik',
    ],
    canonicalPath: '/tr/tarotokumasi',
    ogImage: 'https://busbuskimki.com/assets/logo/social-og-tarot.jpg',
    twitterImage: 'https://busbuskimki.com/assets/logo/twitter-card-tarot.jpg',
    breadcrumbs: [
      { name: 'Anasayfa', url: `${baseUrl}/tr` },
      { name: 'Tarot Okuması', url: `${baseUrl}/tr/tarotokumasi` },
    ],
    faq: [
      {
        question: 'Tarot açılımları nelerdir?',
        answer:
          '9 farklı açılım vardır: aşk, kariyer, para, evlilik ve sevgililik üzerine ücretsiz ve ücretli rehberlik sunar.',
      },
      {
        question: 'Ücretsiz açılımlar nasıl alınır?',
        answer:
          'Web sitesinden istediğiniz ücretsiz açılımı seçip direkt olarak deneyebilirsiniz.',
      },
      {
        question: 'Ücretli açılımlar nasıl çalışır?',
        answer:
          'Seçtiğiniz açılım için ödeme yaparak detaylı, kişisel ve rehberlik odaklı yorum alabilirsiniz.',
      },
    ],
  },
  en: {
    title: 'Büşbüşkimki - Tarot Readings & Personal Spreads',
    description:
      'Get free and paid tarot spreads for love, career, money, marriage, and relationship guidance.',
    keywords: [
      'tarot reading',
      'free tarot',
      'paid tarot',
      'love tarot',
      'career tarot',
      'money tarot',
      'marriage tarot',
      'relationship tarot',
      'personal spread',
      'tarot guidance',
    ],
    canonicalPath: '/en/tarotokumasi',
    ogImage: 'https://busbuskimki.com/assets/logo/social-og-tarot.jpg',
    twitterImage: 'https://busbuskimki.com/assets/logo/twitter-card-tarot.jpg',
    breadcrumbs: [
      { name: 'Home', url: `${baseUrl}/en` },
      { name: 'Tarot Reading', url: `${baseUrl}/en/tarotokumasi` },
    ],
    faq: [
      {
        question: 'What are the tarot spreads?',
        answer:
          'There are 9 different spreads: love, career, money, marriage, and relationship, offering free and paid guidance.',
      },
      {
        question: 'How to use free spreads?',
        answer: 'Select any free spread on the website and try it directly.',
      },
      {
        question: 'How do paid spreads work?',
        answer:
          'Make a payment for the chosen spread to receive detailed, personal guidance.',
      },
    ],
  },
  sr: {
    title: 'Büşbüşkimki - Tarot Čitanje & Lični Rasporedi',
    description:
      'Isprobajte besplatne i plaćene tarot rasporede za ljubav, karijeru, novac, brak i odnose.',
    keywords: [
      'tarot čitanje',
      'besplatan tarot',
      'plaćeni tarot',
      'ljubavni tarot',
      'karijerni tarot',
      'novčani tarot',
      'bračni tarot',
      'odnosni tarot',
      'lični raspored',
      'tarot vodič',
    ],
    canonicalPath: '/sr/tarotokumasi',
    ogImage: 'https://busbuskimki.com/assets/logo/social-og-tarot.jpg',
    twitterImage: 'https://busbuskimki.com/assets/logo/twitter-card-tarot.jpg',
    breadcrumbs: [
      { name: 'Početna', url: `${baseUrl}/sr` },
      { name: 'Tarot Čitanje', url: `${baseUrl}/sr/tarotokumasi` },
    ],
    faq: [
      {
        question: 'Koji su tarot rasporedi?',
        answer:
          'Postoji 9 različitih rasporeda: ljubav, karijera, novac, brak i odnosi, nudeći besplatnu i plaćenu pomoć.',
      },
      {
        question: 'Kako koristiti besplatne rasporede?',
        answer:
          'Odaberite bilo koji besplatni raspored na sajtu i isprobajte ga direktno.',
      },
      {
        question: 'Kako funkcionišu plaćeni rasporedi?',
        answer:
          'Platite za odabrani raspored da biste dobili detaljno, personalizovano vođenje.',
      },
    ],
  },
};

export function generateTarotPageMetadata(locale: string): Metadata {
  const data =
    tarotPageSeoData[locale as keyof typeof tarotPageSeoData] ||
    tarotPageSeoData.tr;

  return {
    title: data.title,
    description: data.description,
    keywords: data.keywords.join(', '),
    alternates: {
      canonical: `${baseUrl}${data.canonicalPath}`,
      languages: {
        'x-default': `${baseUrl}/en/tarotokumasi`,
        tr: `${baseUrl}/tr/tarotokumasi`,
        en: `${baseUrl}/en/tarotokumasi`,
        sr: `${baseUrl}/sr/tarotokumasi`,
      },
    },
    openGraph: {
      title: data.title,
      description: data.description,
      url: `${baseUrl}${data.canonicalPath}`,
      siteName: 'Büşbüşkimki',
      images: [
        {
          url: data.ogImage,
          width: 1200,
          height: 630,
          alt: data.title,
        },
      ],
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : locale === 'en' ? 'en_US' : 'sr_RS',
    },
    twitter: {
      card: 'summary_large_image',
      title: data.title,
      description: data.description,
      images: [data.twitterImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export function generateTarotPageStructuredData(
  locale: string
): TarotPageStructuredData {
  const data =
    tarotPageSeoData[locale as keyof typeof tarotPageSeoData] ||
    tarotPageSeoData.tr;

  return {
    organization: generateOrganizationSchema(),
    website: generateWebSiteSchema(),
    service: buildTarotServiceSchema(locale),
    breadcrumb: generateBreadcrumbSchema(data.breadcrumbs),
    faq: buildTarotFaqSchema(locale, data.faq),
  };
}

function buildTarotFaqSchema(
  locale: string,
  faqItems: Array<{ question: string; answer: string }>
): FAQSchema {
  if (!faqItems || faqItems.length === 0) {
    return generateFAQSchema(locale);
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

function buildTarotServiceSchema(locale: string): ServiceSchema {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  const serviceNames = {
    tr: 'Çevrimiçi Tarot Açılımları',
    en: 'Online Tarot Readings',
    sr: 'Onlajn Tarot Čitanja',
  } as const;

  const serviceDescriptions = {
    tr: 'Aşk, kariyer, para ve ilişki temalı tarot açılımlarını seçerek kişisel rehberlik alın.',
    en: 'Select love, career, money and relationship-focused tarot spreads for personalised guidance.',
    sr: 'Odaberite tarot rasporede za ljubav, karijeru, novac i odnose i dobijte lično vođstvo.',
  } as const;

  const offerCatalog: Array<{ name: string; description: string }> =
    locale === 'tr'
      ? [
          { name: 'Aşk Tarot Açılımı', description: 'İlişkiler ve duygusal bağlantılar için tarot rehberliği.' },
          { name: 'Kariyer Tarot Açılımı', description: 'İş ve kariyer kararlarını destekleyen kart yorumları.' },
          { name: 'Genel Tarot Açılımı', description: 'Günlük yaşam ve kişisel gelişim için genel tarot rehberliği.' },
        ]
      : locale === 'sr'
        ? [
            { name: 'Ljubavni Tarot Raspored', description: 'Vođstvo kartama za ljubavne veze i emocije.' },
            { name: 'Karijerni Tarot Raspored', description: 'Podrška za poslovne odluke kroz tarot simbole.' },
            { name: 'Opšti Tarot Raspored', description: 'Sveobuhvatno vođstvo za svakodnevni život i lični rast.' },
          ]
        : [
            { name: 'Love Tarot Spread', description: 'Guidance for relationships and emotional dynamics.' },
            { name: 'Career Tarot Spread', description: 'Support for professional decisions through tarot insights.' },
            { name: 'General Tarot Spread', description: 'Holistic tarot reading for daily life and personal growth.' },
          ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceNames[locale as keyof typeof serviceNames] || serviceNames.en,
    description:
      serviceDescriptions[locale as keyof typeof serviceDescriptions] ||
      serviceDescriptions.en,
    provider: {
      '@type': 'Organization',
      name: 'Büşbüşkimki Tarot Okuyucusu',
      url: base,
    },
    serviceType: 'Personal Services',
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: serviceNames[locale as keyof typeof serviceNames] || serviceNames.en,
      itemListElement: offerCatalog.map(offer => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: offer.name,
          description: offer.description,
        },
      })),
    },
  };
}
