/**
 * SEO Metadata Generator for Tarot Spreads
 * Google-optimized metadata generation for individual spread pages
 */

import { Metadata } from 'next';
import { tarotSpreads } from '@/lib/constants/tarotSpreads';

const baseUrl = 'https://busbuskimki.com';

/**
 * Spread-specific SEO data (hardcoded for server-side generation)
 */
const spreadSeoData: Record<
  string,
  {
    tr: { title: string; description: string };
    en: { title: string; description: string };
    sr: { title: string; description: string };
  }
> = {
  'love-spread': {
    tr: {
      title: 'Aşk Tarot Açılımı',
      description:
        'Aşk hayatınız hakkında 4 kartlık profesyonel tarot açılımı. Uzman tarot okuyucularımızla detaylı yorum ve rehberlik alın.',
    },
    en: {
      title: 'Love Tarot Spread',
      description:
        'Professional 4-card tarot reading about your love life. Get detailed interpretations and guidance from expert tarot readers.',
    },
    sr: {
      title: 'Tarot Čitanje Ljubavi',
      description:
        'Profesionalno tarot čitanje sa 4 karte o vašem ljubavnom životu.',
    },
  },
  'career-spread': {
    tr: {
      title: 'Kariyer Tarot Açılımı',
      description:
        'Kariyer ve iş hayatınız için 7 kartlık profesyonel tarot açılımı. Meslek yolculuğunuzda rehberlik alın.',
    },
    en: {
      title: 'Career Tarot Spread',
      description:
        'Professional 7-card tarot reading for your career and work life. Get guidance on your professional journey.',
    },
    sr: {
      title: 'Tarot Čitanje Karijere',
      description: 'Profesionalno tarot čitanje sa 7 karata za vašu karijeru.',
    },
  },
  'problem-solving-spread': {
    tr: {
      title: 'Kelt  Tarot Açılımı',
      description:
        '10 kartlık detaylı Kelt  açılımı. Karşılaştığınız zorluklar için çözüm yolları keşfedin.',
    },
    en: {
      title: 'Celtics Tarot Spread',
      description:
        'Detailed 10-card problem-solving spread. Discover solutions to your challenges.',
    },
    sr: {
      title: 'Tarot Rešavanje Problema',
      description: 'Detaljna 10-kartna pozicija za rešavanje problema.',
    },
  },
  'situation-analysis-spread': {
    tr: {
      title: 'Enerji Haritası Tarot Açılımı',
      description:
        '7 kartlık kapsamlı Enerji Haritası. Mevcut durumunuzu tüm yönleriyle anlayın.',
    },
    en: {
      title: 'Situation Analysis Tarot Spread',
      description:
        'Comprehensive 7-card situation analysis. Understand your current situation from all angles.',
    },
    sr: {
      title: 'Tarot Analiza Situacije',
      description: 'Sveobuhvatna analiza sa 7 karata.',
    },
  },
  'relationship-analysis-spread': {
    tr: {
      title: 'İlişki Analizi Tarot Açılımı',
      description:
        'İlişkinizi 7 kartla derinlemesine analiz edin. Dinamiklerinizi ve potansiyelinizi keşfedin.',
    },
    en: {
      title: 'Relationship Analysis Tarot Spread',
      description:
        'Deep analysis of your relationship with 7 cards. Discover dynamics and potential.',
    },
    sr: {
      title: 'Tarot Analiza Veze',
      description: 'Dubinska analiza veze sa 7 karata.',
    },
  },
  'relationship-problems-spread': {
    tr: {
      title: 'İlişki dönüşüm Tarot Açılımı',
      description:
        '9 kartlık ilişki sorunları açılımı. Zorlukları aşın ve çözüm yolları bulun.',
    },
    en: {
      title: 'Relationship Problems Tarot Spread',
      description:
        '9-card relationship problems spread. Overcome difficulties and find solutions.',
    },
    sr: {
      title: 'Tarot Problemi u Vezi',
      description: 'Pozicija sa 9 karata za probleme u vezi.',
    },
  },
  'marriage-spread': {
    tr: {
      title: 'Evlilik Tarot Açılımı',
      description:
        '10 kartlık evlilik açılımı. Evlilik yolculuğunuz için derinlemesine rehberlik.',
    },
    en: {
      title: 'Marriage Tarot Spread',
      description:
        '10-card marriage spread. In-depth guidance for your marriage journey.',
    },
    sr: {
      title: 'Tarot Čitanje Braka',
      description: 'Čitanje sa 10 karata za brak.',
    },
  },
  'new-lover-spread': {
    tr: {
      title: 'Yeni Aşk Tarot Açılımı',
      description:
        '6 kartlık yeni Aşk Uyumu. Yeni bir ilişki için içgörüler ve rehberlik.',
    },
    en: {
      title: 'New Love Tarot Spread',
      description:
        '6-card new love spread. Insights and guidance for a new relationship.',
    },
    sr: {
      title: 'Tarot Nova Ljubav',
      description: 'Čitanje sa 6 karata za novu ljubav.',
    },
  },
  'money-spread': {
    tr: {
      title: 'Para ve Finans Tarot Açılımı',
      description:
        '8 kartlık finans açılımı. Para, zenginlik ve maddi durum hakkında rehberlik.',
    },
    en: {
      title: 'Money & Finance Tarot Spread',
      description:
        '8-card finance spread. Guidance on money, wealth, and financial situation.',
    },
    sr: {
      title: 'Tarot Novac i Finansije',
      description: 'Finansijsko čitanje sa 8 karata.',
    },
  },
  'single-card-spread': {
    tr: {
      title: 'Tek Kart Tarot Okuması',
      description:
        'Tek bir kartla derinlemesine rehberlik. Kişisel sorularınız için özel tarot okuması.',
    },
    en: {
      title: 'Single Card Tarot Reading',
      description:
        'In-depth guidance with a single card. Personal tarot reading for your specific questions.',
    },
    sr: {
      title: 'Tarot Čitanje Jedne Karte',
      description: 'Dubinsko čitanje sa jednom kartom za vaša pitanja.',
    },
  },
};

/**
 * Generate SEO-optimized metadata for a specific tarot spread
 */
export function generateSpreadMetadata(
  spreadId: string,
  locale: string
): Metadata {
  // Normalize spreadId: eğer -spread suffix'i yoksa ekle
  // URL'de relationship-problems olabilir ama tarotSpreads'te relationship-problems-spread olarak kayıtlı
  const normalizedSpreadId = spreadId.endsWith('-spread')
    ? spreadId
    : `${spreadId}-spread`;

  // Önce normalized ile dene, sonra orijinal ile
  const spread =
    tarotSpreads.find(s => s.id === normalizedSpreadId) ||
    tarotSpreads.find(s => s.id === spreadId);

  const seoData = spreadSeoData[normalizedSpreadId] || spreadSeoData[spreadId];

  if (!spread || !seoData) {
    return {
      title: 'Tarot Açılımı Bulunamadı',
      description: 'Aradığınız tarot açılımı bulunamadı.',
    };
  }

  // Normalize edilmiş spreadId'yi kullan (spread.id ile eşleşen)
  const finalSpreadId = spread.id;

  const currentLocale = seoData[locale as keyof typeof seoData] || seoData.tr;

  // Locale-specific keywords
  const keywordsData = {
    tr: [
      'tarot',
      'tarot okuma',
      'tarot falı',
      'tarot açılımı',
      'ücretsiz tarot',
      'online tarot',
    ],
    en: [
      'tarot',
      'tarot reading',
      'tarot spread',
      'free tarot',
      'online tarot',
      'tarot cards',
    ],
    sr: [
      'tarot',
      'tarot čitanje',
      'tarot karte',
      'besplatni tarot',
      'online tarot',
    ],
  };

  const keywords =
    keywordsData[locale as keyof typeof keywordsData] || keywordsData.tr;

  // Spread-specific keywords
  const spreadKeywords = [
    spread.id.replace(/-/g, ' '),
    `${spread.cardCount} kart`,
    spread.color,
  ];

  const title = `${currentLocale.title} | Büşbüşkimki`;
  const description = currentLocale.description;

  return {
    title,
    description,
    keywords: [...keywords, ...spreadKeywords].join(', '),

    // Canonical and alternate URLs
    alternates: {
      canonical: `${baseUrl}/${locale}/tarotokumasi/${finalSpreadId}`,
      languages: {
        'x-default': `${baseUrl}/tr/tarotokumasi/${finalSpreadId}`,
        tr: `${baseUrl}/tr/tarotokumasi/${finalSpreadId}`,
        en: `${baseUrl}/en/tarotokumasi/${finalSpreadId}`,
        sr: `${baseUrl}/sr/tarotokumasi/${finalSpreadId}`,
      },
    },

    // Open Graph
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/tarotokumasi/${finalSpreadId}`,
      siteName: 'Büşbüşkimki',
      images: [
        {
          url: `${baseUrl}/assets/spreads/${finalSpreadId}-og.jpg`,
          width: 1200,
          height: 630,
          alt: currentLocale.title,
        },
      ],
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : locale === 'en' ? 'en_US' : 'sr_RS',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/assets/spreads/${finalSpreadId}-twitter.jpg`],
    },

    // Robots
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

    // Additional metadata
    authors: [{ name: 'Büşbüşkimki' }],
    creator: 'Büşbüşkimki',
    publisher: 'Büşbüşkimki',
    category: 'Spirituality',
  };
}

/**
 * Generate Schema.org structured data for a specific tarot spread
 */
export function generateSpreadStructuredData(spreadId: string, locale: string) {
  // Normalize spreadId: eğer -spread suffix'i yoksa ekle
  const normalizedSpreadId = spreadId.endsWith('-spread')
    ? spreadId
    : `${spreadId}-spread`;

  // Önce normalized ile dene, sonra orijinal ile
  const spread =
    tarotSpreads.find(s => s.id === normalizedSpreadId) ||
    tarotSpreads.find(s => s.id === spreadId);

  const seoData = spreadSeoData[normalizedSpreadId] || spreadSeoData[spreadId];

  if (!spread || !seoData) {
    return {};
  }

  // Normalize edilmiş spreadId'yi kullan (spread.id ile eşleşen)
  const finalSpreadId = spread.id;

  const currentLocale = seoData[locale as keyof typeof seoData] || seoData.tr;

  const localeNames = {
    tr: {
      home: 'Ana Sayfa',
      tarot: 'Tarot Okuması',
    },
    en: {
      home: 'Home',
      tarot: 'Tarot Reading',
    },
    sr: {
      home: 'Početna',
      tarot: 'Tarot Čitanje',
    },
  };

  const names =
    localeNames[locale as keyof typeof localeNames] || localeNames.tr;

  return {
    // Breadcrumb Schema
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: names.home,
          item: `${baseUrl}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: names.tarot,
          item: `${baseUrl}/${locale}/tarotokumasi`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: currentLocale.title,
          item: `${baseUrl}/${locale}/tarotokumasi/${finalSpreadId}`,
        },
      ],
    },

    // WebPage Schema
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: currentLocale.title,
      description: currentLocale.description,
      url: `${baseUrl}/${locale}/tarotokumasi/${finalSpreadId}`,
      inLanguage:
        locale === 'tr' ? 'tr-TR' : locale === 'en' ? 'en-US' : 'sr-RS',
      mainEntity: {
        '@type': 'Service',
        name: currentLocale.title,
        description: currentLocale.description,
        provider: {
          '@type': 'Organization',
          name: 'Büşbüşkimki',
          url: baseUrl,
        },
        serviceType: 'Tarot Reading',
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: `${baseUrl}/${locale}/tarotokumasi/${finalSpreadId}`,
        },
      },
    },

    // Product/Service Schema for specific spread
    service: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: currentLocale.title,
      description: currentLocale.description,
      brand: {
        '@type': 'Brand',
        name: 'Büşbüşkimki',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'TRY',
        lowPrice: 0,
        highPrice: 100,
        offerCount: 2,
        availability: 'https://schema.org/InStock',
      },
    },
  };
}

/**
 * Get all spread IDs for static generation
 * Hidden spreads (admin-only) are excluded from static generation
 */
export function getAllSpreadIds(): string[] {
  return tarotSpreads.filter(spread => !spread.hidden).map(spread => spread.id);
}

/**
 * Get spread by ID
 */
export function getSpreadById(spreadId: string) {
  return tarotSpreads.find(s => s.id === spreadId);
}
