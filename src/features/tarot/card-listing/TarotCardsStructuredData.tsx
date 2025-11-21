import type { FAQEntry, SupportedLocale } from './config';

interface TarotCardsStructuredDataProps {
  locale: SupportedLocale;
  canonicalUrl: string;
  title: string;
  description: string;
  faqEntries: FAQEntry[];
  featuredItems: Array<{
    name: string;
    url: string;
    description: string;
  }>;
  lastUpdated: string;
}

const LOCALE_LANGUAGE_CODES: Record<SupportedLocale, string> = {
  tr: 'tr-TR',
  en: 'en-US',
  sr: 'sr-RS',
};

const HOME_URLS: Record<SupportedLocale, string> = {
  tr: 'https://busbuskimki.com/tr',
  en: 'https://busbuskimki.com/en',
  sr: 'https://busbuskimki.com/sr',
};

export function TarotCardsStructuredData({
  locale,
  canonicalUrl,
  title,
  description,
  faqEntries,
  featuredItems,
  lastUpdated,
}: TarotCardsStructuredDataProps) {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    name: title,
    description,
    inLanguage: LOCALE_LANGUAGE_CODES[locale],
    datePublished: lastUpdated,
    dateModified: lastUpdated,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Büsbüşkimki',
      url: HOME_URLS[locale],
    },
    potentialAction: [
      {
        '@type': 'SearchAction',
        target: 'https://busbuskimki.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    ],
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: locale === 'tr' ? 'Ana Sayfa' : locale === 'en' ? 'Home' : 'Početna',
        item: HOME_URLS[locale],
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: canonicalUrl,
      },
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqEntries.map(entry => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    })),
  };

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: title,
    description,
    url: canonicalUrl,
    about: featuredItems.slice(0, 12).map(item => ({
      '@type': 'ListItem',
      name: item.name,
      description: item.description,
      url: item.url,
    })),
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
    </>
  );
}







