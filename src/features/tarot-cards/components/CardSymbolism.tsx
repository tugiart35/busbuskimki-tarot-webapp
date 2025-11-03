import { CardContent } from '@/types/tarot-cards';

interface CardSymbolismProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardSymbolism({ content, locale }: CardSymbolismProps) {
  const { symbolism } = content;

  if (!symbolism || !Array.isArray(symbolism) || symbolism.length === 0) {
    return null;
  }

  const sectionTitle = {
    tr: '🎭 Semboller ve Anlamları',
    en: '🎭 Symbols and Meanings',
    sr: '🎭 Simboli i Značenja',
  };

  const sectionSubtitle = {
    tr: 'Bu karttaki her sembol derin bir mesaj taşır',
    en: 'Every symbol in this card carries a deep message',
    sr: 'Svaki simbol u ovoj karti nosi duboku poruku',
  };

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50'>
      <div className='max-w-5xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
            {sectionTitle[locale]}
          </h2>
          <p className='text-lg text-gray-600'>{sectionSubtitle[locale]}</p>
        </div>

        {/* Symbols Grid */}
        <div className='space-y-8'>
          {symbolism.map((item, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-l-4 border-violet-500'
            >
              <div className='flex items-start gap-6'>
                <div className='flex-shrink-0'>
                  <div className='w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg'>
                    {index + 1}
                  </div>
                </div>
                <div className='flex-1'>
                  <h3 className='text-2xl font-bold text-gray-900 mb-3'>
                    {item.symbol}
                  </h3>
                  <p className='text-gray-700 leading-relaxed text-lg'>
                    {item.meaning}
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
