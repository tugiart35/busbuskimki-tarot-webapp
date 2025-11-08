import Image from 'next/image';
import Link from 'next/link';
import { TarotCard } from '@/types/tarot-cards';
import { CardMapping } from '../lib/card-mapping';

interface RelatedCardsProps {
  cards: TarotCard[];
  locale: 'tr' | 'en' | 'sr';
}

export function RelatedCards({ cards, locale }: RelatedCardsProps) {
  if (!cards || cards.length === 0) {
    return null;
  }

  // Generate SEO-optimized ALT text for card images
  const getCardAltText = (
    name: string,
    cardData: TarotCard,
    lang: 'tr' | 'en' | 'sr'
  ): string => {
    const arcanaText =
      cardData.arcanaType === 'major'
        ? lang === 'tr'
          ? 'Major Arcana'
          : lang === 'en'
            ? 'Major Arcana'
            : 'Velika Arkana'
        : lang === 'tr'
          ? 'Minor Arcana'
          : lang === 'en'
            ? 'Minor Arcana'
            : 'Mala Arkana';

    const numberText = cardData.number
      ? ` ${lang === 'tr' ? 'numara' : lang === 'en' ? 'number' : 'broj'} ${cardData.number}`
      : '';

    const seoKeywords =
      lang === 'tr'
        ? 'düz ve ters pozisyon yorumları, aşk, kariyer, para ve ruhsal rehberlik'
        : lang === 'en'
          ? 'upright and reversed position interpretations, love, career, money and spiritual guidance'
          : 'uspravna i obrnuta pozicija tumačenja, ljubav, karijera, novac i duhovno vođstvo';

    const meaningText =
      lang === 'tr'
        ? 'kartı anlamı'
        : lang === 'en'
          ? 'card meaning'
          : 'karta značenje';

    return `${name} tarot ${meaningText} - ${arcanaText}${numberText} - ${seoKeywords}`;
  };

  return (
    <section
      className='py-16 px-4 bg-white'
      aria-labelledby='related-cards-heading'
    >
      <div className='max-w-6xl mx-auto'>
        {/* Section Header */}
        <header className='text-center mb-12'>
          <h2
            id='related-cards-heading'
            className='text-3xl font-bold text-gray-900 mb-4'
          >
            {locale === 'tr'
              ? 'İlgili Kartlar'
              : locale === 'en'
                ? 'Related Cards'
                : 'Povezane Karte'}
          </h2>
          <p className='text-lg text-gray-600'>
            {locale === 'tr'
              ? 'Bu kartla benzer enerjilere sahip diğer kartlar'
              : locale === 'en'
                ? 'Other cards with similar energies to this one'
                : 'Druge karte sa sličnim energijama kao ova'}
          </p>
        </header>

        {/* Related Cards Grid */}
        <ul
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
          role='list'
        >
          {cards.map((card, index) => {
            const cardName = CardMapping.getCardNameForLocale(card, locale);
            const cardUrl = CardMapping.getCardUrlForLocale(card, locale);

            return (
              <li key={`${card.id}-${index}`}>
                <Link href={cardUrl}>
                  <article className='group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-purple-300'>
                    {/* Card Image - Semantic figure */}
                    <figure className='relative aspect-[2/3] overflow-hidden'>
                      <Image
                        src={card.imageUrl}
                        alt={getCardAltText(cardName, card, locale)}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                        loading='lazy'
                      />
                      {/* Card Type Badge */}
                      <div className='absolute top-2 left-2'>
                        <span className='bg-black/70 text-white text-xs px-2 py-1 rounded-full'>
                          {card.arcanaType === 'major'
                            ? locale === 'tr'
                              ? 'Major'
                              : locale === 'en'
                                ? 'Major'
                                : 'Velika'
                            : locale === 'tr'
                              ? 'Minor'
                              : locale === 'en'
                                ? 'Minor'
                                : 'Mala'}
                        </span>
                      </div>
                      {/* Card Number Badge */}
                      {card.arcanaType === 'major' && card.number && (
                        <div className='absolute top-2 right-2'>
                          <span className='bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full'>
                            {card.number}
                          </span>
                        </div>
                      )}
                      {/* Minor Arcana Badge */}
                      {card.arcanaType === 'minor' && card.suit && (
                        <div className='absolute top-2 right-2'>
                          <span className='bg-white/90 text-black text-xs font-bold px-2 py-1 rounded-full'>
                            {card.suit.toUpperCase()} {card.number}
                          </span>
                        </div>
                      )}
                      <figcaption className='sr-only'>
                        {cardName} -{' '}
                        {card.arcanaType === 'major' ? 'Major' : 'Minor'} Arcana
                      </figcaption>
                    </figure>

                    {/* Card Info */}
                    <div className='p-4'>
                      <h3 className='font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-200'>
                        {cardName}
                      </h3>
                      <p className='text-sm text-gray-600 mb-3'>
                        {locale === 'tr'
                          ? 'Detaylı anlamları için tıklayın'
                          : locale === 'en'
                            ? 'Click for detailed meanings'
                            : 'Kliknite za detaljna značenja'}
                      </p>

                      {/* Card Keywords Preview */}
                      <footer className='flex flex-wrap gap-1'>
                        {card.arcanaType === 'major' && (
                          <span className='bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded'>
                            {locale === 'tr'
                              ? 'Major Arcana'
                              : locale === 'en'
                                ? 'Major Arcana'
                                : 'Velika Arkana'}
                          </span>
                        )}
                        {card.arcanaType === 'minor' && card.suit && (
                          <span className='bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded'>
                            {card.suit.toUpperCase()}
                          </span>
                        )}
                      </footer>
                    </div>
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* View All Cards Link */}
        <div className='text-center mt-12'>
          <Link
            href={`/${locale}/${locale === 'tr' ? 'kartlar' : locale === 'en' ? 'cards' : 'kartice'}`}
            className='inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            {locale === 'tr'
              ? 'Tüm Kartları Gör'
              : locale === 'en'
                ? 'View All Cards'
                : 'Pogledaj Sve Karte'}
            <svg
              className='w-5 h-5 ml-2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 7l5 5m0 0l-5 5m5-5H6'
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
