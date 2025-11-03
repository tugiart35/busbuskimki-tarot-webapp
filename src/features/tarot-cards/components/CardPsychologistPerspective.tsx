import { CardContent } from '@/types/tarot-cards';

interface CardPsychologistPerspectiveProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardPsychologistPerspective({
  content,
  locale: _locale,
}: CardPsychologistPerspectiveProps) {
  const { psychologist_perspective } = content;

  if (!psychologist_perspective?.title) return null;

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-block p-3 bg-amber-500 rounded-full mb-4'>
            <span className='text-white text-3xl'>🧠</span>
          </div>
          <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
            {psychologist_perspective.title}
          </h2>
          {psychologist_perspective.summary && (
            <p className='text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto'>
              {psychologist_perspective.summary}
            </p>
          )}
        </div>

        {/* Insights */}
        {psychologist_perspective.insights && 
         psychologist_perspective.insights.length > 0 && (
          <div className='space-y-6'>
            {psychologist_perspective.insights.map((insight, index) => (
              <div
                key={index}
                className='bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-500 hover:shadow-xl transition-shadow duration-300'
              >
                <div className='flex items-start gap-4'>
                  <div className='w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1'>
                    {index + 1}
                  </div>
                  <p className='text-gray-700 leading-relaxed flex-1'>
                    {insight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

