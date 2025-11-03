import { CardContent } from '@/types/tarot-cards';

interface CardKeywordsProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardKeywords({ content, locale }: CardKeywordsProps) {
  // Extract keywords from symbolism if keywords structure doesn't exist
  // If there's symbolism, use that as keywords source
  const hasSymbolism = content.symbolism && content.symbolism.length > 0;
  const hasNumerology = content.numerology;

  if (!hasSymbolism && !hasNumerology) {
    return null;
  }

  const title = {
    tr: '🔑 Anahtar Semboller',
    en: '🔑 Key Symbols',
    sr: '🔑 Ključni Simboli',
  };

  const subtitle = {
    tr: 'Bu kartın taşıdığı temel semboller ve enerji',
    en: 'Core symbols and energy of this card',
    sr: 'Osnovni simboli i energija ove karte',
  };

  // Get first 3 symbols as key aspects
  const keySymbols = hasSymbolism ? content.symbolism!.slice(0, 3) : [];

  return (
    <section className='py-12 px-4 bg-white'>
      {/* Section Header */}
      <div className='text-center mb-8'>
        <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
          {title[locale]}
        </h2>
        <p className='text-lg text-gray-600'>{subtitle[locale]}</p>
      </div>

      {/* Keyword Cards */}
      <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6'>
        {keySymbols.map((item, index) => (
          <div
            key={index}
            className='text-center p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-purple-100'
          >
            <div className='w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4'>
              <span className='text-white font-bold text-xl'>
                {index === 0 ? '✨' : index === 1 ? '⚖️' : '🔮'}
              </span>
            </div>
            <h4 className='font-bold text-gray-900 mb-3 text-lg'>
              {item.symbol}
            </h4>
            <p className='text-sm text-gray-600 leading-relaxed'>
              {item.meaning.length > 100
                ? `${item.meaning.substring(0, 100)}...`
                : item.meaning}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
