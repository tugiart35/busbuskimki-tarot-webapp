import { TarotCard } from '@/types/tarot-cards';

// Card SEO service for generating metadata
export class CardSEO {
  // Normalize URL for canonical consistency
  private static normalizeUrl(url: string): string {
    // Ensure https and remove www for consistency
    let normalized = url.replace(/^https?:\/\/(www\.)?/, 'https://');

    // Remove trailing slash for SEO best practices
    normalized = normalized.replace(/\/$/, '');

    return normalized;
  }

  // Generate metadata for a card
  static generateMetadata(
    card: TarotCard,
    seo: any,
    locale: 'tr' | 'en' | 'sr'
  ) {
    const baseUrl = this.normalizeUrl(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com'
    );

    // Safe date handling with proper fallbacks
    const publishedDate =
      card.createdAt?.toISOString() || new Date('2025-01-01').toISOString();
    const modifiedDate = card.updatedAt?.toISOString() || publishedDate;

    // Card name for OG image
    const cardName =
      locale === 'tr'
        ? card.turkishName
        : locale === 'en'
          ? card.englishName
          : card.serbianName;

    // Determine card type (major or minor arcana)
    const cardType =
      card.number !== undefined && card.number <= 21 ? 'major' : 'minor';

    // Dynamic OG image URL
    const ogImageUrl = `/api/og/card?name=${encodeURIComponent(cardName)}&type=${cardType}&locale=${locale}`;

    return {
      title: seo.metaTitle,
      description: seo.metaDescription,
      // ✅ EKLE: keywords
      keywords: Array.isArray(seo.keywords)
        ? seo.keywords.join(', ')
        : seo.keywords || '',

      openGraph: {
        title: seo.metaTitle,
        description: seo.metaDescription,
        url: seo.canonicalUrl,
        siteName: 'Büşbüşkimki Tarot ve Numeroloji', // ✅ DÜZELTİLDİ
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${cardName} tarot kartı`, // ✅ EKLE
          },
        ],
        locale: locale === 'tr' ? 'tr_TR' : locale === 'en' ? 'en_US' : 'sr_RS',
        type: 'article',
        // ✅ EKLE: Article metadata with safe fallbacks
        publishedTime: publishedDate,
        modifiedTime: modifiedDate,
      },
      twitter: {
        card: 'summary_large_image',
        title: seo.metaTitle,
        description: seo.metaDescription,
        images: [ogImageUrl],
        site: '@busbuskimki', // ✅ EKLE: Twitter handle'ınız
        creator: '@busbuskimki', // ✅ EKLE
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
      alternates: {
        canonical: seo.canonicalUrl,
        languages: {
          'x-default': `${baseUrl}/en/cards/${card.slug?.en || card.slug}`,
          tr: `${baseUrl}/tr/kartlar/${card.slug?.tr || card.slug}`,
          en: `${baseUrl}/en/cards/${card.slug?.en || card.slug}`,
          sr: `${baseUrl}/sr/kartice/${card.slug?.sr || card.slug}`,
        },
      },
    };
  }

  // Generate structured data (JSON-LD)
  static generateStructuredData(
    card: TarotCard,
    seo: any,
    locale: 'tr' | 'en' | 'sr'
  ) {
    const baseUrl = this.normalizeUrl(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com'
    );
    const cardName =
      locale === 'tr'
        ? card.turkishName
        : locale === 'en'
          ? card.englishName
          : card.serbianName;

    // Safe date handling with proper fallbacks
    const publishedDate =
      card.createdAt?.toISOString() || new Date('2025-01-01').toISOString();
    const modifiedDate = card.updatedAt?.toISOString() || publishedDate;

    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: seo.metaTitle,
      description: seo.metaDescription,
      image: seo.ogImage,
      url: seo.canonicalUrl,
      author: {
        '@type': 'Organization',
        name: 'busbuskimki',
        url: baseUrl,
      },
      publisher: {
        '@type': 'Organization',
        name: 'busbuskimki',
        url: baseUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`,
        },
      },
      datePublished: publishedDate,
      dateModified: modifiedDate,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': seo.canonicalUrl,
      },
      about: {
        '@type': 'Thing',
        name: cardName,
        description: seo.metaDescription,
      },
    };
  }

  // Generate FAQ structured data
  static generateFAQStructuredData(seo: any) {
    const faqItems = Array.isArray(seo.faq) ? seo.faq : [];

    // Filter and map valid FAQ items
    const validFaqItems = faqItems
      .filter((item: any) => {
        // Filter out invalid items
        const question = typeof item === 'string' ? item : item?.question;
        const answer = typeof item === 'string' ? '' : item?.answer;
        return question && answer; // Both must exist
      })
      .map((item: any) => {
        const question = typeof item === 'string' ? item : item.question;
        const answer = typeof item === 'string' ? '' : item.answer;

        return {
          '@type': 'Question',
          name: question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answer,
          },
        };
      });

    // Only return FAQ schema if there are valid FAQ items
    if (validFaqItems.length === 0) {
      return null;
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: validFaqItems,
    };
  }

  // Generate breadcrumb structured data
  static generateBreadcrumbStructuredData(
    card: TarotCard,
    locale: 'tr' | 'en' | 'sr'
  ) {
    const baseUrl = this.normalizeUrl(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com'
    );
    const cardName =
      locale === 'tr'
        ? card.turkishName
        : locale === 'en'
          ? card.englishName
          : card.serbianName;

    const breadcrumbs = [
      {
        '@type': 'ListItem',
        position: 1,
        name:
          locale === 'tr' ? 'Ana Sayfa' : locale === 'en' ? 'Home' : 'Početna',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name:
          locale === 'tr'
            ? 'Tarot Kartları'
            : locale === 'en'
              ? 'Tarot Cards'
              : 'Tarot Karte',
        item: `${baseUrl}/${locale}/${locale === 'tr' ? 'kartlar' : locale === 'en' ? 'cards' : 'kartice'}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: cardName,
        item: `${baseUrl}/${locale}/${locale === 'tr' ? 'kartlar' : locale === 'en' ? 'cards' : 'kartice'}/${card.slug?.[locale] || card.slug}`,
      },
    ];

    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs,
    };
  }

  // Generate hreflang tags
  static generateHreflangTags(card: TarotCard) {
    const baseUrl = this.normalizeUrl(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com'
    );

    return [
      {
        hreflang: 'tr',
        href: `${baseUrl}/tr/kartlar/${card.slug.tr}`,
      },
      {
        hreflang: 'en',
        href: `${baseUrl}/en/cards/${card.slug.en}`,
      },
      {
        hreflang: 'sr',
        href: `${baseUrl}/sr/kartice/${card.slug.sr}`,
      },
      {
        hreflang: 'x-default',
        href: `${baseUrl}/en/cards/${card.slug.en}`,
      },
    ];
  }

  // 🆕 Generate HowTo Schema - Kart nasıl yorumlanır rehberi
  static generateHowToSchema(
    card: TarotCard,
    locale: 'tr' | 'en' | 'sr'
  ) {
    const cardName =
      locale === 'tr'
        ? card.turkishName
        : locale === 'en'
          ? card.englishName
          : card.serbianName;

    const baseUrl = this.normalizeUrl(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com'
    );

    const title =
      locale === 'tr'
        ? `${cardName} Tarot Kartını Nasıl Yorumlarım?`
        : locale === 'en'
          ? `How to Interpret ${cardName} Tarot Card?`
          : `Kako protumačiti ${cardName} Tarot kartu?`;

    const steps =
      locale === 'tr'
        ? [
            {
              name: 'Kartın Pozisyonunu Belirle',
              text: 'İlk olarak kartın düz mü yoksa ters mi çıktığını gözlemle. Düz pozisyon genellikle olumlu enerjiyi, ters pozisyon ise zorlukları temsil eder.',
            },
            {
              name: 'Yaşam Alanını Seç',
              text: 'Kartın anlamını hangi alanda öğrenmek istiyorsun? Aşk, kariyer, para veya ruhsal rehberlik alanlarından birini seç.',
            },
            {
              name: 'Sembolleri İncele',
              text: 'Karttaki görselleri, renkleri ve sembolleri dikkatlice incele. Her sembol özel bir anlam taşır.',
            },
            {
              name: 'Sezgilerinle Birleştir',
              text: 'Geleneksel yorumları kendi içsel sezgilerinle birleştir. Kart sana ne hissettiriyor?',
            },
            {
              name: 'Bağlamı Değerlendir',
              text: 'Kartı mevcut yaşam durumunuzla ilişkilendir. Kartın mesajı şu anki durumunuzla nasıl örtüşüyor?',
            },
          ]
        : locale === 'en'
          ? [
              {
                name: 'Determine the Card Position',
                text: 'First, observe whether the card is upright or reversed. Upright position usually represents positive energy, while reversed indicates challenges.',
              },
              {
                name: 'Select Life Area',
                text: 'Which area do you want to learn the meaning of the card? Choose one from love, career, money or spiritual guidance.',
              },
              {
                name: 'Examine the Symbols',
                text: 'Carefully examine the visuals, colors and symbols on the card. Each symbol carries a special meaning.',
              },
              {
                name: 'Combine with Your Intuition',
                text: 'Combine traditional interpretations with your own inner intuition. How does the card make you feel?',
              },
              {
                name: 'Evaluate the Context',
                text: 'Relate the card to your current life situation. How does the message of the card align with your current situation?',
              },
            ]
          : [
              {
                name: 'Odredite Poziciju Karte',
                text: 'Prvo, posmatrajte da li je karta uspravna ili obrnuta. Uspravna pozicija obično predstavlja pozitivnu energiju, dok obrnuta ukazuje na izazove.',
              },
              {
                name: 'Izaberite Životnu Oblast',
                text: 'U kojoj oblasti želite da naučite značenje karte? Izaberite jednu od ljubavi, karijere, novca ili duhovnog vođstva.',
              },
              {
                name: 'Ispitajte Simbole',
                text: 'Pažljivo ispitajte vizuelne elemente, boje i simbole na karti. Svaki simbol nosi posebno značenje.',
              },
              {
                name: 'Kombinujte sa Svojom Intuicijom',
                text: 'Kombinujte tradicionalna tumačenja sa svojom unutrašnjom intuicijom. Kako vas karta čini?',
              },
              {
                name: 'Procenite Kontekst',
                text: 'Povežite kartu sa svojom trenutnom životnom situacijom. Kako se poruka karte uklapa u vašu trenutnu situaciju?',
              },
            ];

    return {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: title,
      description: `${cardName} tarot kartının nasıl yorumlanacağına dair adım adım rehber`,
      image: card.imageUrl,
      totalTime: 'PT10M',
      step: steps.map((step, index) => ({
        '@type': 'HowToStep',
        position: index + 1,
        name: step.name,
        text: step.text,
        url: `${baseUrl}/${locale}/${locale === 'tr' ? 'kartlar' : locale === 'en' ? 'cards' : 'kartice'}/${card.slug?.[locale]}#step-${index + 1}`,
      })),
    };
  }

  // 🆕 Generate ItemList Schema - İlgili kartlar listesi
  static generateItemListSchema(
    relatedCards: TarotCard[],
    locale: 'tr' | 'en' | 'sr'
  ) {
    if (!relatedCards || relatedCards.length === 0) {
      return null;
    }

    const baseUrl = this.normalizeUrl(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com'
    );

    const title =
      locale === 'tr'
        ? 'İlgili Tarot Kartları'
        : locale === 'en'
          ? 'Related Tarot Cards'
          : 'Povezane Tarot Karte';

    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: title,
      itemListElement: relatedCards.map((card, index) => {
        const cardName =
          locale === 'tr'
            ? card.turkishName
            : locale === 'en'
              ? card.englishName
              : card.serbianName;

        return {
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Thing',
            name: cardName,
            url: `${baseUrl}/${locale}/${locale === 'tr' ? 'kartlar' : locale === 'en' ? 'cards' : 'kartice'}/${card.slug?.[locale]}`,
            image: card.imageUrl,
            description: `${cardName} tarot kartı anlamı ve yorumu`,
          },
        };
      }),
    };
  }

  // 🆕 Generate AggregateRating Schema - Kullanıcı reactions için
  static generateAggregateRatingSchema(
    card: TarotCard,
    locale: 'tr' | 'en' | 'sr',
    reactionsCount: number = 0
  ) {
    // Eğer reaction yoksa schema oluşturma
    if (reactionsCount === 0) {
      return null;
    }

    const cardName =
      locale === 'tr'
        ? card.turkishName
        : locale === 'en'
          ? card.englishName
          : card.serbianName;

    const baseUrl = this.normalizeUrl(
      process.env.NEXT_PUBLIC_SITE_URL || 'https://busbuskimki.com'
    );

    // Simulated rating (gelecekte gerçek reaction data'dan hesaplanabilir)
    const ratingValue = 4.5;
    const reviewCount = reactionsCount || 1;

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: `${cardName} Tarot Kartı`,
      image: card.imageUrl,
      description: `${cardName} tarot kartının detaylı anlamı ve yorumu`,
      url: `${baseUrl}/${locale}/${locale === 'tr' ? 'kartlar' : locale === 'en' ? 'cards' : 'kartice'}/${card.slug?.[locale]}`,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: ratingValue,
        reviewCount: reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    };
  }
}
