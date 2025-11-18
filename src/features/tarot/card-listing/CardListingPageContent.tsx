import type { ComponentType } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCardName as getLocalizedCardName } from '@/lib/tarot/card-names';
import { generateCardAltText } from '@/utils/seo-helpers';
import {
  TrendingCardsWidget,
  PageReactions,
  CardStatsWidget,
  GeneralComments,
} from '@/components/shared/ClientWidgets';
import { TarotCardDrawing } from '@/components/TarotCardDrawing';
import {
  CARD_LISTING_TRANSLATIONS,
  FAQ_ENTRIES,
  LOCALE_URLS,
  POPULAR_CARD_SLUGS,
  LAST_UPDATED,
  buildCardListingMetadata,
  type SupportedLocale,
} from './config';
import {
  MAJOR_ARCANA_CARDS,
  MINOR_ARCANA_CARDS,
  type MinorArcanaCard,
} from './cardData';
import {
  SUIT_COLORS,
  SUIT_LABELS,
  getCardImagePath,
  getCardUrl,
  getFeaturedItemDescription,
} from './helpers';
import { TarotCardsStructuredData } from './TarotCardsStructuredData';

interface CardListingPageContentProps {
  locale: SupportedLocale;
  bottomNavigation: ComponentType;
}

export function CardListingPageContent({
  locale,
  bottomNavigation: BottomNavigationComponent,
}: CardListingPageContentProps) {
  const translations = CARD_LISTING_TRANSLATIONS[locale];
  const metadata = buildCardListingMetadata(locale);
  const description =
    metadata.description ||
    (locale === 'tr'
      ? 'Tarot kartlarının anlamlarını ve ters yorumlarını Büsbüşkimki ile keşfet.'
      : locale === 'en'
        ? 'Explore tarot card meanings and reversed interpretations with the Büsbüşkimki editorial team.'
        : 'Otkrij značenja tarot karata uz urednički tim Büsbüşkimki platforme.');

  const featuredItems = MAJOR_ARCANA_CARDS.slice(0, 8).map(card => {
    const cardName = getLocalizedCardName(card.key, locale);
    return {
      name: cardName,
      url: getCardUrl(locale, card.key),
      description: getFeaturedItemDescription(locale, cardName),
    };
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100'>
      <TarotCardsStructuredData
        locale={locale}
        canonicalUrl={LOCALE_URLS[locale]}
        title={translations.title}
        description={description}
        faqEntries={FAQ_ENTRIES[locale]}
        featuredItems={featuredItems}
        lastUpdated={LAST_UPDATED}
      />

      <div className='relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='absolute inset-0'>
          <div className='absolute top-0 left-0 h-full w-full bg-gradient-to-br from-transparent via-transparent to-black/30' />
        </div>
        <div className='relative mx-auto max-w-7xl px-4 py-3 sm:px-4 lg:px-4'>
          <div className='text-center space-y-6'>
            {/* Subtitle */}
            <p className='mx-auto max-w-3xl text-base sm:text-lg text-white/90 leading-relaxed mb-2'>
              {translations.subtitle}
            </p>
          </div>
        </div>
      </div>

      <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
        <TarotCardDrawing locale={locale} theme='light' />
      </div>

      <TrendingCardsWidget locale={locale} limit={6} />

      <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8'>
        <section className='mb-20'>
          <div className='mb-16 text-center'>
            <div className='mb-6 inline-flex items-center rounded-full border border-purple-200 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2'>
              <span className='text-sm font-semibold text-purple-700'>
                🔮 Major Arcana
              </span>
            </div>
            <h2 className='mb-6 text-4xl font-bold text-gray-900 md:text-5xl'>
              {translations.majorArcana}
            </h2>
            <p className='mx-auto max-w-4xl text-xl leading-relaxed text-gray-600'>
              {translations.majorArcanaDescription}
            </p>
          </div>

          <div className='grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
            {MAJOR_ARCANA_CARDS.map(card => (
              <Link
                key={card.key}
                href={getCardUrl(locale, card.key)}
                className='group transform overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition-all duration-500 hover:-translate-y-2 hover:scale-105 hover:border-purple-300 hover:shadow-2xl'
              >
                <div className='relative aspect-[2/3] overflow-hidden'>
                  <Image
                    src={getCardImagePath(card.key)}
                    alt={generateCardAltText(
                      {
                        ...(locale === 'tr' && {
                          nameTr: getLocalizedCardName(card.key, locale),
                        }),
                        ...(locale === 'en' && {
                          nameEn: getLocalizedCardName(card.key, locale),
                        }),
                        ...(locale === 'sr' && {
                          nameSr: getLocalizedCardName(card.key, locale),
                        }),
                        type: 'major',
                        number: card.number,
                      },
                      locale,
                      { includeContext: true, context: 'gallery' }
                    )}
                    fill
                    sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 16vw'
                    className='object-cover transition-transform duration-700 group-hover:scale-110'
                  />
                  <div className='absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/60 via-transparent to-transparent' />
                  <div className='absolute left-3 top-3'>
                    <span className='rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1.5 text-xs font-bold text-white shadow-lg'>
                      {card.number}
                    </span>
                  </div>
                  <div className='absolute inset-x-3 bottom-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                    <div className='rounded-lg bg-white/90 p-2 backdrop-blur-sm'>
                      <p className='text-center text-xs font-medium text-gray-800'>
                        {translations.viewCard}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='p-4'>
                  <h3 className='text-sm font-bold text-gray-900 transition-colors duration-300 line-clamp-2 group-hover:text-purple-600'>
                    {getLocalizedCardName(card.key, locale)}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className='mb-16'>
          <PageReactions
            pageId='cards-listing-major'
            locale={locale}
            title={translations.pageReactionsTitle}
          />
        </div>

        <section>
          <div className='mb-16 text-center'>
            <div className='mb-6 inline-flex items-center rounded-full border border-blue-200 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2'>
              <span className='text-sm font-semibold text-blue-700'>
                🃏 Minor Arcana
              </span>
            </div>
            <h2 className='mb-6 text-4xl font-bold text-gray-900 md:text-5xl'>
              {translations.minorArcana}
            </h2>
            <p className='mx-auto max-w-4xl text-xl leading-relaxed text-gray-600'>
              {translations.minorArcanaDescription}
            </p>
          </div>

          {(
            [
              'Cups',
              'Pentacles',
              'Swords',
              'Wands',
            ] as MinorArcanaCard['suit'][]
          ).map(suit => {
            const suitCards = MINOR_ARCANA_CARDS.filter(
              card => card.suit === suit
            );

            return (
              <div key={suit} className='mb-16'>
                <div className='mb-8 text-center'>
                  <div className='mb-4 inline-flex items-center rounded-full border border-gray-300 bg-gradient-to-r from-gray-100 to-gray-200 px-6 py-3'>
                    <span className='mr-3 text-2xl'>
                      {suit === 'Cups'
                        ? '💧'
                        : suit === 'Pentacles'
                          ? '💰'
                          : suit === 'Swords'
                            ? '⚔️'
                            : '🔥'}
                    </span>
                    <h3 className='text-2xl font-bold text-gray-900'>
                      {SUIT_LABELS[locale][suit]}
                    </h3>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7'>
                  {suitCards.map(card => (
                    <Link
                      key={card.key}
                      href={getCardUrl(locale, card.key)}
                      className='group transform overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md transition-all duration-400 hover:-translate-y-1 hover:scale-105 hover:border-blue-300 hover:shadow-xl'
                    >
                      <div className='relative aspect-[2/3] overflow-hidden'>
                        <Image
                          src={getCardImagePath(card.key)}
                          alt={generateCardAltText(
                            {
                              ...(locale === 'tr' && {
                                nameTr: getLocalizedCardName(card.key, locale),
                              }),
                              ...(locale === 'en' && {
                                nameEn: getLocalizedCardName(card.key, locale),
                              }),
                              ...(locale === 'sr' && {
                                nameSr: getLocalizedCardName(card.key, locale),
                              }),
                              type: 'minor',
                            },
                            locale,
                            { includeContext: true, context: 'gallery' }
                          )}
                          fill
                          sizes='(max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 14vw'
                          className='object-cover transition-transform duration-500 group-hover:scale-110'
                        />
                        <div className='absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/40 via-transparent to-transparent' />
                        <div className='absolute left-2 top-2'>
                          <span
                            className={`rounded-full bg-gradient-to-r ${SUIT_COLORS[suit]} px-2.5 py-1 text-xs font-bold text-white shadow-md`}
                          >
                            {card.number}
                          </span>
                        </div>
                        <div className='absolute inset-x-2 bottom-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
                          <div className='rounded-lg bg-white/90 p-2 backdrop-blur-sm'>
                            <p className='text-center text-xs font-medium text-gray-800'>
                              {translations.viewCard}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className='p-3'>
                        <h3 className='text-sm font-bold text-gray-900 transition-colors duration-300 line-clamp-2 group-hover:text-blue-600'>
                          {getLocalizedCardName(card.key, locale)}
                        </h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </section>

        <section className='mb-20'>
          <div className='mb-12 text-center'>
            <div className='mb-6 inline-flex items-center rounded-full border border-amber-200 bg-gradient-to-r from-amber-100 to-orange-100 px-4 py-2'>
              <span className='text-sm font-semibold text-amber-700'>
                ⭐ {translations.popularSectionLabel}
              </span>
            </div>
            <h2 className='mb-6 text-4xl font-bold text-gray-900 md:text-5xl'>
              {translations.popularSectionTitle}
            </h2>
            <p className='mx-auto max-w-3xl text-xl text-gray-600'>
              {translations.popularSectionSubtitle}
            </p>
          </div>

          <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
            {POPULAR_CARD_SLUGS[locale].map(slug => (
              <CardStatsWidget key={slug} slug={slug} locale={locale} />
            ))}
          </div>
        </section>

        <section className='relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-12 text-center text-white'>
          <div className='absolute inset-0 rounded-3xl bg-black/20' />
          <div className='absolute inset-0 rounded-3xl'>
            <div className='absolute inset-0 rounded-3xl bg-gradient-to-br from-transparent via-transparent to-black/30' />
          </div>
          <div className='relative z-10'>
            <div className='mb-6 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm'>
              <span className='text-sm font-medium text-white/90'>
                {translations.freeTarotBadge}
              </span>
            </div>
            <h3 className='mb-6 text-4xl font-bold text-transparent bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text md:text-5xl'>
              {translations.drawCardsTitle}
            </h3>
            <p className='mx-auto mb-8 max-w-3xl text-xl leading-relaxed opacity-90'>
              {translations.drawCardsDescription}
            </p>
            <Link
              href={`/${locale}/tarotokumasi`}
              className='inline-flex transform items-center rounded-2xl bg-white px-10 py-4 text-lg font-bold text-purple-600 shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-gray-100 hover:shadow-3xl'
            >
              {translations.drawCardsButton}
              <svg
                className='ml-3 h-6 w-6'
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
        </section>
      </div>

      <section className='bg-white py-16'>
        <div className='mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-3 lg:gap-16 lg:px-8'>
          <div className='space-y-6'>
            <h2 className='text-3xl font-bold text-gray-900'>
              {translations.expertSectionTitle}
            </h2>
            <div className='rounded-2xl border border-gray-100 bg-slate-50 p-6 shadow-sm'>
              <p className='text-lg font-semibold text-gray-900'>
                {translations.expertName}
              </p>
              <p className='text-sm text-purple-700'>
                {translations.expertRole}
              </p>
              <p className='mt-4 text-sm leading-relaxed text-gray-700'>
                {translations.expertBio}
              </p>
              <dl className='mt-6 space-y-2 text-sm text-gray-600'>
                <div className='flex flex-col'>
                  <dt className='font-semibold text-gray-900'>
                    {translations.factCheckLabel}
                  </dt>
                  <dd>{translations.factCheckValue}</dd>
                </div>
                <div className='flex flex-col'>
                  <dt className='font-semibold text-gray-900'>
                    {translations.updateLabel}
                  </dt>
                  <dd>{translations.updateValue}</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className='space-y-6 lg:col-span-2'>
            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
              <h3 className='text-xl font-semibold text-gray-900'>
                {translations.trustSignalsTitle}
              </h3>
              <ul className='mt-4 space-y-3 text-sm text-gray-700'>
                {translations.trustSignals.map(signal => (
                  <li key={signal} className='flex items-start gap-3'>
                    <span className='mt-1 text-purple-600'>✓</span>
                    <span>{signal}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
              <h3 className='text-xl font-semibold text-gray-900'>
                {translations.adsPolicyTitle}
              </h3>
              <p className='mt-3 text-sm text-gray-700'>
                {translations.adsPolicyBody}
              </p>
            </div>

            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
              <h3 className='text-xl font-semibold text-gray-900'>
                {translations.moderationTitle}
              </h3>
              <p className='mt-3 text-sm text-gray-700'>
                {translations.moderationBody}
              </p>
            </div>

            <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
              <h3 className='text-xl font-semibold text-gray-900'>
                {translations.disclaimerTitle}
              </h3>
              <p className='mt-3 text-sm text-gray-700'>
                {translations.disclaimerBody}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className='bg-slate-50 py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mb-12 text-center'>
            <div className='inline-flex items-center rounded-full border border-emerald-200 bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-2'>
              <span className='text-sm font-semibold text-emerald-700'>
                FAQ
              </span>
            </div>
            <h2 className='mt-4 text-3xl font-bold text-gray-900 md:text-4xl'>
              {locale === 'tr'
                ? 'En Sık Sorulan Sorular'
                : locale === 'en'
                  ? 'Frequently Asked Questions'
                  : 'Najčešća pitanja'}
            </h2>
          </div>

          <div className='space-y-6'>
            {FAQ_ENTRIES[locale].map(entry => (
              <details
                key={entry.question}
                className='group rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm'
              >
                <summary className='flex cursor-pointer items-center justify-between text-left text-lg font-semibold text-gray-900'>
                  <span>{entry.question}</span>
                  <span className='ml-4 text-emerald-600 transition-transform duration-200 group-open:rotate-45'>
                    +
                  </span>
                </summary>
                <p className='mt-4 text-sm leading-relaxed text-gray-700'>
                  {entry.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <GeneralComments pageId='cards-listing' locale={locale} />

      <BottomNavigationComponent />
    </div>
  );
}
