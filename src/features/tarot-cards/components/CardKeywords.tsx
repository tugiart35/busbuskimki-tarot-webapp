import { CardContent } from '@/types/tarot-cards';

interface CardKeywordsProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardKeywords({ content, locale }: CardKeywordsProps) {
  return (
    <section className='py-12 px-4 bg-white'>
      <div className='max-w-4xl mx-auto'>
        <div className='text-center mb-8'>
          <h3 className='text-2xl font-bold text-gray-900 mb-4'>
            {content.keywords.keywords_title}
          </h3>
          <p className='text-gray-600'>
            {locale === 'tr'
              ? 'Bu kartla ilişkili temel kavramlar ve enerjiler'
              : locale === 'en'
                ? 'Core concepts and energies associated with this card'
                : 'Osnovni koncepti i energije povezane sa ovom kartom'}
          </p>
        </div>

        <div className='flex flex-wrap justify-center gap-3 mb-8'>
          {content.keywords.keywords_message.split(',').map((keyword, index) => (
            <span
              key={index}
              className='bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105'
            >
              {keyword.trim()}
            </span>
          ))}
        </div>

        {/* Keyword Categories */}
        <div className='mt-8 grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='text-center p-4 bg-purple-50 rounded-lg'>
            <div className='w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3'>
              <span className='text-white font-bold'>+</span>
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>
              {content.keywords.positive_title}
            </h4>
            <p className='text-sm text-gray-600'>
              {content.keywords.positive_message}
            </p>
          </div>

          <div className='text-center p-4 bg-blue-50 rounded-lg'>
            <div className='w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3'>
              <span className='text-white font-bold'>⚖️</span>
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>
              {content.keywords.balance_title}
            </h4>
            <p className='text-sm text-gray-600'>
              {content.keywords.balance_message}
            </p>
          </div>

          <div className='text-center p-4 bg-indigo-50 rounded-lg'>
            <div className='w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3'>
              <span className='text-white font-bold'>🔮</span>
            </div>
            <h4 className='font-semibold text-gray-900 mb-2'>
              {content.keywords.soul_title}
            </h4>
            <p className='text-sm text-gray-600'>
              {content.keywords.soul_message}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
