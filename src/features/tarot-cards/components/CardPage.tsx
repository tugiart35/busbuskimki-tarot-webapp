import { CardPageData } from '@/types/tarot-cards';
import { CardHero } from './CardHero';
import { CardMeanings } from './CardMeanings';
import { CardStory } from './CardStory';
import { CardSymbolism } from './CardSymbolism';
import { CardNumerology } from './CardNumerology';
import { CardNumerologicalPerspective } from './CardNumerologicalPerspective';
import { CardCombinations } from './CardCombinations';
import { CardAffirmations } from './CardAffirmations';
import { CardPsychologistPerspective } from './CardPsychologistPerspective';
import { CardDailyPractices } from './CardDailyPractices';
import { CardCTA } from './CardCTA';
import { CardFAQ } from './CardFAQ';
import { RelatedCards } from './RelatedCards';
import { CardGallery } from './CardGallery';
import { CardClosingParagraph } from './CardClosingParagraph';
import { CardSEO } from '../lib/card-seo';
import {
  DailyCardWidget,
  CardStatsWidget,
} from '@/components/shared/ClientWidgets';
import { CardReactions } from '@/components/shared/CardReactions';
import { CardComments } from '@/components/shared/CardComments';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

interface CardPageProps {
  card: CardPageData;
  locale: 'tr' | 'en' | 'sr';
  slug: string; // URL slug from route params
}

export default function CardPage({ card, locale, slug }: CardPageProps) {
  const { card: cardData, content, seo, relatedCards } = card;

  // Use the slug from URL params (this is the correct localized slug)
  const cardSlug = slug;

  // Get the correct cards page URL based on locale
  const getCardsPageUrl = (locale: string) => {
    switch (locale) {
      case 'tr':
        return '/tr/kartlar';
      case 'en':
        return '/en/cards';
      case 'sr':
        return '/sr/kartice';
      default:
        return '/tr/kartlar';
    }
  };

  // ✅ FAQ Schema'yı sadece geçerli FAQ varsa oluştur
  const faqSchema = CardSEO.generateFAQStructuredData(seo);

  return (
    <div className='min-h-screen bg-white'>
      {/* Back Button */}
      <div className='bg-white border-b border-gray-200 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <Link
            href={getCardsPageUrl(locale)}
            className='inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 group'
          >
            <FaArrowLeft className='w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200' />
            {locale === 'tr' && 'Kartlara Geri Dön'}
            {locale === 'en' && 'Back to Cards'}
            {locale === 'sr' && 'Nazad na Karte'}
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <CardHero card={cardData} content={content} locale={locale} />

      {/* 1. Kart Hikayesi */}
      <CardStory content={content} locale={locale} />

      {/* 2. Kart Anlamları (Düz - Ters) */}
      <CardMeanings content={content} locale={locale} />

      {/* 3. 🎭 Semboller ve Anlamları */}
      <CardSymbolism content={content} locale={locale} />

      {/* 4. Kart Kombinasyonları */}
      <CardCombinations content={content} locale={locale} />

      {/* 5. Günlük Afirmasyonlar */}
      <CardAffirmations content={content} locale={locale} />

      {/* 6. 🌟 Günlük Pratikler */}
      <CardDailyPractices content={content} locale={locale} />

      {/* 7. Bugünün Kartı */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <DailyCardWidget locale={locale} />
      </div>

      {/* 8. 🔢 Numeroloji */}
      <CardNumerology content={content} locale={locale} />

      {/* 8.5. 🔮 Numerolojik Perspektif ve Derin İçgörüler */}
      <CardNumerologicalPerspective content={content} locale={locale} />

      {/* 9. Kart Galeri ve Detaylar */}
      <CardGallery card={cardData} locale={locale} />

      {/* 10. Büşbüşkimki Yorumu */}
      <CardPsychologistPerspective content={content} locale={locale} />

      {/* 10.5. 🌟 Son Söz - Kapanış Paragrafı */}
      <CardClosingParagraph content={content} locale={locale} />

      {/* 11. Sıkça Sorulan Sorular */}
      <CardFAQ seo={seo} locale={locale} />

      {/* 12. 📊 İstatistikler */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <CardStatsWidget slug={cardSlug} locale={locale} />
      </div>

      {/* 13. Bu içeriği nasıl buldunuz? */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <CardReactions cardId={cardSlug} locale={locale} />
      </div>

      {/* 14. 💬 Yorumlar */}
      <CardComments cardId={cardSlug} locale={locale} />

      {/* 15. Tarot Açılımı Yap */}
      <CardCTA content={content} locale={locale} />

      {/* 16. İlgili Kartlar */}
      <RelatedCards cards={relatedCards} locale={locale} />

      {/* ✅ Main Structured Data - Only render if valid */}
      {(() => {
        const structuredData = CardSEO.generateStructuredData(cardData, seo, locale);
        return structuredData ? (
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData),
            }}
          />
        ) : null;
      })()}

      {/* ✅ FAQ Schema - Sadece geçerli FAQ varsa render et */}
      {faqSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}

      {/* ✅ Breadcrumb Schema - Only render if valid */}
      {(() => {
        const breadcrumbData = CardSEO.generateBreadcrumbStructuredData(cardData, locale);
        return breadcrumbData ? (
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbData),
            }}
          />
        ) : null;
      })()}

      {/* ✅ HowTo Schema - Only render if valid */}
      {(() => {
        const howToData = CardSEO.generateHowToSchema(cardData, locale);
        return howToData ? (
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(howToData),
            }}
          />
        ) : null;
      })()}

      {/* 🆕 ItemList Schema - İlgili kartlar */}
      {relatedCards && relatedCards.length > 0 && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              CardSEO.generateItemListSchema(relatedCards, locale)
            ),
          }}
        />
      )}

      {/* ✅ AggregateRating Schema - Only render if valid */}
      {(() => {
        const ratingData = CardSEO.generateAggregateRatingSchema(cardData, locale, 0);
        return ratingData ? (
          <script
            type='application/ld+json'
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(ratingData),
            }}
          />
        ) : null;
      })()}
    </div>
  );
}
