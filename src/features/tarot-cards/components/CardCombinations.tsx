import Link from 'next/link';
import { CardContent } from '@/types/tarot-cards';

interface CardCombinationsProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardCombinations({ content, locale }: CardCombinationsProps) {
  const { card_combinations } = content;

  if (!card_combinations || !card_combinations.combinations.length) {
    return null;
  }

  const buildCardUrl = (slug?: string) => {
    if (!slug) {
      return null;
    }
    switch (locale) {
      case 'tr':
        return `/tr/kartlar/${slug}`;
      case 'sr':
        return `/sr/kartice/${slug}`;
      default:
        return `/en/cards/${slug}`;
    }
  };

  return (
    <section className='py-16 px-4 bg-white'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-3xl lg:text-4xl font-bold text-center mb-12 text-gray-800'>
          {card_combinations.title}
        </h2>

        <div className='space-y-6'>
          {card_combinations.combinations.map((combo, index) => (
            <div
              key={index}
              className='bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow duration-300'
            >
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>
                  {index + 1}
                </div>
                <div className='flex-1'>
                  {buildCardUrl(combo.slug) ? (
                    <Link
                      href={buildCardUrl(combo.slug)!}
                      className='text-xl font-bold text-purple-600 hover:text-purple-800 transition-colors duration-200 mb-2 inline-flex items-center gap-2'
                    >
                      {combo.card}
                      <span aria-hidden='true'>↗</span>
                    </Link>
                  ) : (
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>
                      {combo.card}
                    </h3>
                  )}
                  <p className='text-gray-700 leading-relaxed'>
                    {combo.meaning}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
