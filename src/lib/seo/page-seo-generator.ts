/**
 * PAGE SEO GENERATOR - Her sayfa için dinamik SEO metadata oluşturur
 *
 * Bu dosya, her sayfa için SEO metadata'sını dinamik olarak oluşturur.
 * Dil-spesifik SEO bilgileri, hreflang tags, canonical URL'ler ve structured data içerir.
 */

import { Metadata } from 'next';

// GOOGLE SEO UYUMLU: Gerçek route'ları kullan (SEO alias'ları kaldırıldı)
// Rewrite'lar next.config.js'ten kaldırıldı, direkt route kullanıyoruz
const seoFriendlyPaths = {
  tr: {
    '/': '/',
    '/tarotokumasi': '/tarotokumasi',
    '/numeroloji': '/numeroloji',
    '/dashboard': '/dashboard',
    '/auth': '/auth',
  },
  en: {
    '/': '/',
    '/tarotokumasi': '/tarotokumasi',
    '/numeroloji': '/numeroloji',
    '/dashboard': '/dashboard',
    '/auth': '/auth',
  },
  sr: {
    '/': '/',
    '/tarotokumasi': '/tarotokumasi',
    '/numeroloji': '/numeroloji',
    '/dashboard': '/dashboard',
    '/auth': '/auth',
  },
};

// Ana sayfa SEO bilgileri (seobilgileri.md'den alındı)
const homepageSeoData = {
  tr: {
    title: 'Büşbüşkimki - Profesyonel Tarot ve Numeroloji Rehberliği',
    description:
      'Büşbüşkimki ile tarot ve numeroloji hizmetleri ile kişisel rehberlik, yaşam ipuçları ve sezgisel yorumlar keşfedin.',
    keywords: [
      'tarot okuma',
      'numeroloji rehberi',
      'kişisel rehberlik',
      'hayat ipuçları',
      'sezgisel yorumlar',
      'tarot danışmanlığı',
      'numeroloji analiz',
      'kişisel gelişim',
    ],
    ogTitle: 'Büşbüşkimki - Profesyonel Tarot ve Numeroloji Rehberliği',
    ogDescription:
      'Büşbüşkimki ile hayatınıza rehberlik eden tarot ve numeroloji yorumlarını keşfedin ve kişisel gelişiminizi destekleyin.',
    twitterTitle: 'Büşbüşkimki - Profesyonel Tarot ve Numeroloji Rehberliği',
    twitterDescription:
      'Büşbüşkimki ile hayatınıza rehberlik eden tarot ve numeroloji yorumlarını keşfedin.',
  },
  en: {
    title: 'Büşbüşkimki - Professional Tarot & Numerology Guidance',
    description:
      "Discover personal guidance and intuitive insights with Büşbüşkimki's professional tarot and numerology services.",
    keywords: [
      'tarot reading',
      'numerology guidance',
      'personal guidance',
      'life insights',
      'intuitive readings',
      'tarot consultancy',
      'numerology analysis',
      'personal development',
    ],
    ogTitle: 'Büşbüşkimki - Professional Tarot & Numerology Guidance',
    ogDescription:
      'Explore tarot and numerology insights at Büşbüşkimki to support your personal growth and life decisions.',
    twitterTitle: 'Büşbüşkimki - Professional Tarot & Numerology Guidance',
    twitterDescription:
      'Explore tarot and numerology insights at Büşbüşkimki to support your personal growth.',
  },
  sr: {
    title: 'Büşbüşkimki - Profesionalna Tarot i Numerologija',
    description:
      'Otkrijte lično vođenje i intuitivne uvide uz profesionalne tarot i numerologijske usluge Büşbüşkimki.',
    keywords: [
      'tarot čitanje',
      'numerologija',
      'lični vodič',
      'životni saveti',
      'intuitivna čitanja',
      'tarot konsultacije',
      'numerološka analiza',
      'lični razvoj',
    ],
    ogTitle: 'Büşbüşkimki - Profesionalna Tarot i Numerologija',
    ogDescription:
      'Istražite tarot i numerologiju uz Büşbüşkimki i podržite lični razvoj i životne odluke.',
    twitterTitle: 'Büşbüşkimki - Profesionalna Tarot i Numerologija',
    twitterDescription:
      'Istražite tarot i numerologiju uz Büşbüşkimki i podržite lični razvoj.',
  },
};

/**
 * Ana sayfa için SEO metadata oluşturur
 */
export function generateHomepageMetadata(locale: string): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';
  const seoData =
    homepageSeoData[locale as keyof typeof homepageSeoData] ||
    homepageSeoData.tr;

  // Canonical URL - gerçek route kullan (SEO-friendly URL değil)
  const canonicalUrl = `${baseUrl}/${locale}`;

  // Hreflang URL'leri - gerçek route'lar
  const hreflangUrls = {
    'x-default': `${baseUrl}/tr`,
    tr: `${baseUrl}/tr`,
    en: `${baseUrl}/en`,
    sr: `${baseUrl}/sr`,
  };

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords.join(', '),
    alternates: {
      canonical: canonicalUrl,
      languages: hreflangUrls,
    },
    openGraph: {
      title: seoData.ogTitle,
      description: seoData.ogDescription,
      url: canonicalUrl,
      siteName: 'Büşbüşkimki',
      images: [
        {
          url: 'https://busbuskimki.com/assets/logo/social-og.jpg',
          width: 1200,
          height: 630,
          alt: 'Büşbüşkimki',
        },
      ],
      type: 'website',
      locale: locale === 'tr' ? 'tr_TR' : locale === 'en' ? 'en_US' : 'sr_RS',
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.twitterTitle,
      description: seoData.twitterDescription,
      images: ['https://busbuskimki.com/assets/logo/twitter-card.jpg'],
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

/**
 * Ana sayfa için JSON-LD structured data oluşturur
 */
export function generateHomepageStructuredData(locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';
  // GOOGLE SEO: Ana sayfa direkt /{locale} (SEO alias yok)
  const currentUrl = `${baseUrl}/${locale}`;

  const structuredData = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Büşbüşkimki',
      url: currentUrl,
      logo: 'https://busbuskimki.com/assets/logo/logo.png',
      sameAs: [
        'https://www.instagram.com/busbuskimki',
        'https://www.facebook.com/busbuskimki',
      ],
    },
    website: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Büşbüşkimki',
      url: currentUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${currentUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    service: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name:
        locale === 'tr'
          ? 'Tarot ve Numeroloji Yorumları'
          : locale === 'en'
            ? 'Tarot and Numerology Readings'
            : 'Tarot i Numerologija',
      url: currentUrl,
      description:
        locale === 'tr'
          ? 'Büşbüşkimki, tarot ve numeroloji hizmetleri ile kişisel rehberlik ve sezgisel yorumlar sunar.'
          : locale === 'en'
            ? 'Büşbüşkimki provides professional tarot and numerology services with personal guidance and intuitive insights.'
            : 'Büşbüşkimki pruža profesionalne usluge tarota i numerologije sa ličnim vođenjem i intuitivnim uvidima.',
      provider: {
        '@type': 'Organization',
        name: 'Büşbüşkimki',
      },
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name:
            locale === 'tr' ? 'Anasayfa' : locale === 'en' ? 'Home' : 'Početna',
          item: currentUrl,
        },
      ],
    },
  };

  return structuredData;
}

/**
 * Genel sayfa için SEO metadata oluşturur (gelecekteki sayfalar için)
 */
export function generatePageMetadata(locale: string): Metadata {
  // Bu fonksiyon gelecekteki sayfalar için genişletilecek
  // Şimdilik ana sayfa için kullanılıyor
  return generateHomepageMetadata(locale);
}

/**
 * SEO-friendly URL oluşturur
 */
export function getSeoFriendlyUrl(locale: string, path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';
  const mapping = seoFriendlyPaths[locale as keyof typeof seoFriendlyPaths];
  const seoPath =
    mapping && path in mapping ? mapping[path as keyof typeof mapping] : path;
  return `${baseUrl}/${locale}${seoPath}`;
}
