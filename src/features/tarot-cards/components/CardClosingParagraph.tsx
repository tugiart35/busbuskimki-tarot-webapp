import { CardContent } from '@/types/tarot-cards';

interface CardClosingParagraphProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardClosingParagraph({
  content,
  locale,
}: CardClosingParagraphProps) {
  const closingParagraph = (content as any).closing_paragraph;

  if (!closingParagraph) {
    return null;
  }

  const sectionTitle = {
    tr: '🌟 Son Söz',
    en: '🌟 Final Words',
    sr: '🌟 Završne Reči',
  };

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border-2 border-amber-200'>
          {/* Header */}
          <div className='text-center mb-8'>
            <div className='w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg'>
              <span className='text-3xl'>🌟</span>
            </div>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-2'>
              {sectionTitle[locale]}
            </h2>
          </div>

          {/* Content */}
          <div className='bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-8 border-l-4 border-amber-500'>
            <div className='prose prose-lg prose-gray max-w-none'>
              <p className='text-gray-800 leading-relaxed text-lg whitespace-pre-line'>
                {closingParagraph}
              </p>
            </div>
          </div>

          {/* Decorative element */}
          <div className='mt-8 flex justify-center'>
            <div className='flex items-center gap-2 text-amber-600'>
              <span className='text-2xl'>✨</span>
              <div className='w-32 h-0.5 bg-gradient-to-r from-amber-300 to-transparent'></div>
              <span className='text-2xl'>🌙</span>
              <div className='w-32 h-0.5 bg-gradient-to-l from-amber-300 to-transparent'></div>
              <span className='text-2xl'>✨</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



