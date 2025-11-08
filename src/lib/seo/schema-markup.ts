/**
 * Schema.org JSON-LD structured data for SEO optimization
 * Provides rich snippets and enhanced search results
 */

import fs from 'fs';
import path from 'path';

export interface OrganizationSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  logo: string;
  contactPoint: {
    '@type': string;
    telephone: string;
    contactType: string;
  };
  sameAs: string[];
  address: {
    '@type': string;
    addressCountry: string;
    addressLocality: string;
  };
}

export interface WebSiteSchema {
  '@context': string;
  '@type': string;
  name: string;
  url: string;
  description: string;
  publisher: {
    '@type': string;
    name: string;
  };
  potentialAction: {
    '@type': string;
    target: string;
    'query-input': string;
  };
  inLanguage: string[];
}

export interface ServiceSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider: {
    '@type': string;
    name: string;
    url: string;
  };
  serviceType: string;
  areaServed: string;
  hasOfferCatalog: {
    '@type': string;
    name: string;
    itemListElement: Array<{
      '@type': string;
      itemOffered: {
        '@type': string;
        name: string;
        description: string;
      };
    }>;
  };
}

export interface BreadcrumbSchema {
  '@context': string;
  '@type': string;
  itemListElement: Array<{
    '@type': string;
    position: number;
    name: string;
    item: string;
  }>;
}

export interface FAQSchema {
  '@context': string;
  '@type': string;
  mainEntity: Array<{
    '@type': string;
    name: string;
    acceptedAnswer: {
      '@type': string;
      text: string;
    };
  }>;
}

export interface TarotReadingSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  provider: {
    '@type': string;
    name: string;
    url: string;
  };
  serviceType: string;
  category: string;
  offers: {
    '@type': string;
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

/**
 * Generate Organization schema for the business
 */
export function generateOrganizationSchema(): OrganizationSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BüşBüşKimKi Tarot Okuyucusu',
    description:
      'Profesyonel tarot okuma ve numeroloji hizmetleri. Aşk, kariyer ve yaşam rehberliği için kişiselleştirilmiş içgörüler alın.',
    url: baseUrl,
    logo: 'https://busbuskimki.com/assets/logo/logo.png', // Logo URL'i
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+382 67 010176',
      contactType: 'customer service',
    },
    sameAs: [
      'https://facebook.com/busbuskimki',
      'https://twitter.com/busbuskimki',
      'https://instagram.com/busbuskimki',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'ME',
      addressLocality: 'Podgorica - Montenegro',
    },
  };
}

/**
 * Generate Website schema for the main site
 */
export function generateWebSiteSchema(): WebSiteSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BüşBüşKimKi Tarot Okuyucusu',
    url: baseUrl,
    description:
      'Profesyonel tarot okuma ve numeroloji hizmetleri. Aşk, kariyer ve yaşam rehberliği için kişiselleştirilmiş içgörüler alın.',
    publisher: {
      '@type': 'Organization',
      name: 'BüşBüşKimKi Tarot Okuyucusu',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${baseUrl}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['tr-TR', 'en-US', 'sr-RS'],
  };
}

/**
 * Generate Service schema for tarot/numerology services
 */
export function generateServiceSchema(): ServiceSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Tarot & Numeroloji Hizmetleri',
    description:
      'Aşk, kariyer ve yaşam rehberliği için profesyonel tarot okuma ve numeroloji hizmetleri.',
    provider: {
      '@type': 'Organization',
      name: 'BüşBüşKimKi Tarot Okuyucusu',
      url: baseUrl,
    },
    serviceType: 'Personal Services',
    areaServed: 'Worldwide',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Tarot & Numeroloji Hizmetleri',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Aşk Tarot Okuması',
            description:
              'Aşk hayatınız ve ilişkileriniz hakkında içgörüler alın',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Kariyer Tarot Okuması',
            description: 'Kariyer yolunuzu ve profesyonel fırsatları keşfedin',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Numeroloji Okuması',
            description: 'Numeroloji ile yaşam yolunuzu anlayın',
          },
        },
      ],
    },
  };
}

/**
 * Generate Breadcrumb schema for navigation
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): BreadcrumbSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate FAQ schema for common questions with i18n support
 */
export function generateFAQSchema(locale: string = 'tr'): FAQSchema {
  try {
    // Load messages from JSON file
    const messagesPath = path.join(process.cwd(), 'messages', `${locale}.json`);
    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf-8'));

    const faqData = messages.seo?.faq;

    if (!faqData) {
      console.warn(`FAQ data not found for locale: ${locale}`);
      return generateFallbackFAQSchema();
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: faqData.q1.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faqData.q1.answer,
          },
        },
        {
          '@type': 'Question',
          name: faqData.q2.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faqData.q2.answer,
          },
        },
        {
          '@type': 'Question',
          name: faqData.q3.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faqData.q3.answer,
          },
        },
        {
          '@type': 'Question',
          name: faqData.q4.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faqData.q4.answer,
          },
        },
        {
          '@type': 'Question',
          name: faqData.q5.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faqData.q5.answer,
          },
        },
      ],
    };
  } catch (error) {
    console.error('Error generating FAQ schema:', error);
    return generateFallbackFAQSchema();
  }
}

/**
 * Fallback FAQ schema in Turkish
 */
function generateFallbackFAQSchema(): FAQSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Tarot okuması nasıl çalışır?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Tarot okuması, tarot kartlarını kullanarak aşk, kariyer ve kişisel gelişim gibi hayatın çeşitli yönlerine dair içgörüler elde etme şeklidir.',
        },
      },
    ],
  };
}

/**
 * Generate Tarot Reading schema for specific readings
 */
export function generateTarotReadingSchema(
  readingType: string,
  price?: string
): TarotReadingSchema {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  const readingNames: Record<string, string> = {
    'love-spread': 'Love Tarot Reading',
    'career-spread': 'Career Tarot Reading',
    'situation-analysis': 'Situation Analysis Reading',
    'new-lover': 'New Lover Reading',
    'relationship-problems': 'Relationship Problems Reading',
  };

  const readingDescriptions: Record<string, string> = {
    'love-spread':
      'Get insights about your love life, relationships, and romantic future',
    'career-spread':
      'Discover your career path, professional opportunities, and work-life balance',
    'situation-analysis':
      'Analyze your current situation and get guidance for the future',
    'new-lover': 'Explore potential new romantic connections and relationships',
    'relationship-problems':
      'Address relationship challenges and find solutions',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: readingNames[readingType] || 'Tarot Reading',
    description:
      readingDescriptions[readingType] || 'Professional tarot reading service',
    provider: {
      '@type': 'Organization',
      name: 'Busbuskimki',
      url: baseUrl,
    },
    serviceType: 'Tarot Reading',
    category: 'Personal Services',
    offers: {
      '@type': 'Offer',
      price: price || '5',
      priceCurrency: 'TRY',
      availability: 'https://schema.org/InStock',
    },
  };
}

/**
 * Generate Product schema for tarot packages
 */
export function generateProductSchema(product: {
  name: string;
  description: string;
  price: string;
  currency: string;
  sku?: string;
  imageUrl?: string;
  offers?: {
    validFrom?: string;
    validThrough?: string;
  };
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.imageUrl || `${baseUrl}/icons/icon-512x512.png`,
    sku: product.sku || `TAROT-${Date.now()}`,
    brand: {
      '@type': 'Brand',
      name: 'BüşBüşKimKi',
    },
    offers: {
      '@type': 'Offer',
      url: baseUrl,
      priceCurrency: product.currency,
      price: product.price,
      priceValidUntil:
        product.offers?.validThrough ||
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'BüşBüşKimKi',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '256',
      bestRating: '5',
      worstRating: '1',
    },
  };
}

/**
 * Generate AggregateRating schema for service ratings
 */
export function generateAggregateRatingSchema(ratings: {
  ratingValue: string;
  reviewCount: string;
  bestRating?: string;
  worstRating?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Service',
      name: 'BüşBüşKimKi Tarot Okuma Hizmetleri',
      description: 'Profesyonel tarot ve numeroloji hizmetleri',
    },
    ratingValue: ratings.ratingValue,
    reviewCount: ratings.reviewCount,
    bestRating: ratings.bestRating || '5',
    worstRating: ratings.worstRating || '1',
  };
}

/**
 * Generate Review schema for user reviews
 */
export function generateReviewSchema(review: {
  author: string;
  reviewRating: string;
  reviewBody: string;
  datePublished: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Service',
      name: 'BüşBüşKimKi Tarot Okuma',
    },
    author: {
      '@type': 'Person',
      name: review.author,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.reviewRating,
      bestRating: '5',
      worstRating: '1',
    },
    reviewBody: review.reviewBody,
    datePublished: review.datePublished,
  };
}

/**
 * Generate Article schema for tarot card pages
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  imageUrl: string;
  datePublished: string;
  dateModified: string;
  authorName?: string;
  locale?: string;
  url?: string; // ✅ Sayfa URL'si eklendi
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.imageUrl,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: {
      '@type': 'Organization',
      name: article.authorName || 'BüşBüşKimKi',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'BüşBüşKimKi',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icons/icon-512x512.png`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url || baseUrl, // ✅ Özel sayfa URL'si kullanılıyor
    },
    inLanguage: article.locale || 'tr-TR',
  };
}

/**
 * Generate HowTo schema for instructional content
 */
export function generateHowToSchema(howTo: {
  name: string;
  description: string;
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
  totalTime?: string;
  locale?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howTo.name,
    description: howTo.description,
    totalTime: howTo.totalTime || 'PT10M',
    step: howTo.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      image: step.image,
    })),
    inLanguage: howTo.locale || 'tr-TR',
  };
}

/**
 * Generate VideoObject schema
 */
export function generateVideoSchema(video: {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string;
  contentUrl?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    duration: video.duration || 'PT5M',
    contentUrl: video.contentUrl,
    embedUrl: video.contentUrl,
    publisher: {
      '@type': 'Organization',
      name: 'BüşBüşKimKi',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icons/icon-512x512.png`,
      },
    },
  };
}

/**
 * Generate Event schema for webinars or special sessions
 */
export function generateEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  price?: string;
  currency?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com';

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: {
      '@type': 'VirtualLocation',
      url: baseUrl,
    },
    organizer: {
      '@type': 'Organization',
      name: 'BüşBüşKimKi',
      url: baseUrl,
    },
    offers: event.price
      ? {
          '@type': 'Offer',
          price: event.price,
          priceCurrency: event.currency || 'TRY',
          availability: 'https://schema.org/InStock',
          url: baseUrl,
        }
      : undefined,
  };
}

/**
 * Generate schemas for a specific page
 */
export function generatePageSchemas(pageType: string, pageData?: any) {
  const schemas: any[] = [generateOrganizationSchema()];

  if (pageType === 'tarot-reading' && pageData?.readingType) {
    schemas.push(
      generateTarotReadingSchema(pageData.readingType, pageData.price)
    );
  }

  if (pageType === 'product' && pageData?.product) {
    schemas.push(generateProductSchema(pageData.product));
  }

  if (pageType === 'article' && pageData?.article) {
    schemas.push(generateArticleSchema(pageData.article));
  }

  if (pageData?.breadcrumbs) {
    schemas.push(generateBreadcrumbSchema(pageData.breadcrumbs));
  }

  if (pageData?.ratings) {
    schemas.push(generateAggregateRatingSchema(pageData.ratings));
  }

  return schemas;
}
