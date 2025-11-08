import { CardContent } from '@/types/tarot-cards';

interface CardNumerologicalPerspectiveProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardNumerologicalPerspective({
  content,
  locale,
}: CardNumerologicalPerspectiveProps) {
  const numerologicalPerspective = (content as any).numerological_perspective;

  if (!numerologicalPerspective) {
    return null;
  }

  const sectionTitle = {
    tr: '🔮 Numerolojik Perspektif ve Spiritüel Anlam',
    en: '🔮 Numerological Perspective and Spiritual Meaning',
    sr: '🔮 Numerološka Perspektiva i Duhovno Značenje',
  };

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50'>
      <div className='max-w-4xl mx-auto'>
        <div className='bg-white rounded-2xl shadow-2xl p-8 lg:p-12 border border-purple-100'>
          {/* Header */}
          <div className='text-center mb-10'>
            <div className='w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg'>
              <span className='text-4xl'>🔮</span>
            </div>
            <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
              {sectionTitle[locale]}
            </h2>
            {numerologicalPerspective.title && (
              <p className='text-xl text-gray-700 font-medium'>
                {numerologicalPerspective.title}
              </p>
            )}
          </div>

          {/* Summary */}
          {numerologicalPerspective.summary && (
            <div className='bg-gradient-to-r from-violet-100 to-purple-100 rounded-xl p-6 mb-8 border-l-4 border-violet-500'>
              <p className='text-lg text-gray-800 leading-relaxed italic'>
                {numerologicalPerspective.summary}
              </p>
            </div>
          )}

          {/* Insights */}
          {numerologicalPerspective.insights &&
            Array.isArray(numerologicalPerspective.insights) &&
            numerologicalPerspective.insights.length > 0 && (
              <div className='space-y-6'>
                <h3 className='text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3'>
                  <span className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xl'>
                    ✨
                  </span>
                  {locale === 'tr'
                    ? 'Derin İçgörüler'
                    : locale === 'en'
                      ? 'Deep Insights'
                      : 'Duboke Uvide'}
                </h3>

                {numerologicalPerspective.insights.map(
                  (insight: string, index: number) => (
                    <div
                      key={index}
                      className='group hover:scale-[1.02] transition-transform duration-300'
                    >
                      <div className='bg-gradient-to-r from-white to-purple-50 rounded-xl p-6 border border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all duration-300'>
                        <div className='flex items-start gap-4'>
                          <div className='flex-shrink-0 w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md'>
                            {index + 1}
                          </div>
                          <p className='flex-1 text-gray-700 leading-relaxed text-lg'>
                            {insight}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </section>
  );
}
