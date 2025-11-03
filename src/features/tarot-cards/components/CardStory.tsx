import { CardContent } from '@/types/tarot-cards';

interface CardStoryProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardStory({ content, locale }: CardStoryProps) {
  // Don't render if no mythology data available
  if (!content.context?.mythology) {
    return null;
  }

  const title = {
    tr: '📖 Kartın Hikayesi',
    en: '📖 Card Story',
    sr: '📖 Priča Karte',
  };

  const subtitle = {
    tr: 'Bu kartın kökeni, mitolojisi ve tarihsel anlamı',
    en: 'The origin, mythology and historical meaning of this card',
    sr: 'Poreklo, mitologija i istorijsko značenje ove karte',
  };

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-indigo-50 to-purple-50'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-xl p-8 lg:p-12'>
          {/* Section Header */}
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-3xl'>📖</span>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-4'>
              {title[locale]}
            </h3>
            <p className='text-lg text-gray-600'>{subtitle[locale]}</p>
          </div>

          {/* Mythology Content */}
          <div className='prose prose-lg prose-gray max-w-none mb-6'>
            <div className='bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-6'>
              <div className='flex items-center mb-4'>
                <div className='w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center mr-3'>
                  <span className='text-white text-xl'>🌙</span>
                </div>
                <h4 className='text-xl font-bold text-gray-900'>
                  {locale === 'tr'
                    ? 'Mitolojik ve Sembolik Köken'
                    : locale === 'en'
                      ? 'Mythological and Symbolic Origin'
                      : 'Mitološko i Simboličko Poreklo'}
                </h4>
              </div>
              <p className='text-gray-800 leading-relaxed text-lg whitespace-pre-line'>
                {content.context.mythology}
              </p>
            </div>
          </div>

          {/* Historical Origin from context */}
          {content.context.history && (
            <div className='mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6'>
              <div className='flex items-center mb-4'>
                <div className='w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mr-3'>
                  <span className='text-white font-bold'>🏛️</span>
                </div>
                <h4 className='text-xl font-bold text-gray-900'>
                  {locale === 'tr'
                    ? 'Tarihsel Köken'
                    : locale === 'en'
                      ? 'Historical Origin'
                      : 'Istorijsko Poreklo'}
                </h4>
              </div>
              <p className='text-gray-700 leading-relaxed whitespace-pre-line'>
                {content.context.history}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
