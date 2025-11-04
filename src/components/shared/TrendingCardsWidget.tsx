'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCardMetadataBySlug } from '@/lib/utils/card-metadata';
import { useTranslations } from '@/hooks/useTranslations';

interface TrendingCard {
  id: string;
  name: string;
  imageUrl: string;
  url: string;
  views: number;
  reactions: number;
}

interface TrendingCardsWidgetProps {
  locale: 'tr' | 'en' | 'sr';
  limit?: number;
}

export function TrendingCardsWidget({
  locale,
  limit = 6,
}: TrendingCardsWidgetProps) {
  const { t } = useTranslations();
  const [trendingCards, setTrendingCards] = useState<TrendingCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTrendingCards = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // API'den gerçek veriyi çek (all-time toplam)
        const response = await fetch(
          `/api/engagement/trending-cards?limit=${limit}`
        );
        const result = await response.json();

        if (result.success && result.data) {
          // Slug'lardan metadata'ları al ve TrendingCard formatına çevir
          const cards: TrendingCard[] = result.data
            .map((stat: any) => {
              const metadata = getCardMetadataBySlug(stat.card_slug);
              if (!metadata) {
                console.warn(`Metadata not found for slug: ${stat.card_slug}`);
                return null;
              }

              return {
                id: metadata.id,
                name: metadata.name[locale],
                imageUrl: metadata.imageUrl,
                url: metadata.url[locale],
                views: stat.view_count || 0,
                reactions: stat.reaction_count || 0,
              };
            })
            .filter(Boolean); // null değerleri filtrele

          setTrendingCards(cards);
        } else {
          throw new Error(result.error || 'Failed to load trending cards');
        }
      } catch (err) {
        console.error('Error loading trending cards:', err);
        setError('Failed to load trending cards');
        setTrendingCards([]); // Hata durumunda boş liste
      } finally {
        setIsLoading(false);
      }
    };

    loadTrendingCards();
  }, [locale, limit]);

  if (isLoading) {
    return (
      <div className='py-12 px-4 bg-gradient-to-br from-purple-50 to-indigo-50'>
        <div className='max-w-7xl mx-auto'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-gray-300 rounded w-1/3 mx-auto'></div>
            <div className='h-4 bg-gray-200 rounded w-1/2 mx-auto'></div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8'>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className='bg-white rounded-xl h-64'></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Veri yoksa veya hata varsa widget'ı gösterme
  if (error || !trendingCards.length) {
    return null;
  }

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold mb-4'>
            🔥 {t('widgets.trendingCards.badge')}
          </div>
          <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
            {t('widgets.trendingCards.title')}
          </h2>
          <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
            {t('widgets.trendingCards.subtitle')}
          </p>
        </div>

        {/* Trending Cards Grid */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6'>
          {trendingCards.map((card, index) => (
            <Link
              key={card.id}
              href={card.url}
              className='group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-transparent hover:border-purple-400 transform hover:-translate-y-2'
            >
              {/* Ranking Badge */}
              <div className='absolute top-3 left-3 z-10'>
                <span className='bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg'>
                  #{index + 1}
                </span>
              </div>

              {/* Card Image */}
              <div className='relative aspect-[2/3] overflow-hidden'>
                <Image
                  src={card.imageUrl}
                  alt={`${card.name} - ${t('widgets.trendingCards.imageAlt')}`}
                  fill
                  className='object-cover group-hover:scale-110 transition-transform duration-500'
                  loading='lazy'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
              </div>

              {/* Card Info */}
              <div className='p-4'>
                <h3 className='font-bold text-gray-900 text-sm mb-3 group-hover:text-purple-600 transition-colors duration-200 line-clamp-2'>
                  {card.name}
                </h3>

                {/* Stats */}
                <div className='flex items-center justify-between text-xs text-gray-500'>
                  <div className='flex items-center gap-1'>
                    <svg
                      className='w-4 h-4'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z'
                      />
                    </svg>
                    <span>{card.views}</span>
                  </div>
                  <div className='flex items-center gap-1'>
                    <svg
                      className='w-4 h-4 text-pink-500'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z' />
                    </svg>
                    <span>{card.reactions}</span>
                  </div>
                </div>
              </div>

              {/* Hover Effect */}
              <div className='absolute inset-0 bg-gradient-to-r from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'></div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className='text-center mt-8'>
          <p className='text-sm text-gray-500'>
            💡 {t('widgets.trendingCards.sortInfo')}
          </p>
        </div>
      </div>
    </section>
  );
}

// Default export for dynamic import
export default TrendingCardsWidget;
