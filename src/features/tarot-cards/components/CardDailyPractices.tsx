import { CardContent } from '@/types/tarot-cards';

interface CardDailyPracticesProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardDailyPractices({
  content,
  locale,
}: CardDailyPracticesProps) {
  const { daily_practices } = content;

  if (!daily_practices || !Array.isArray(daily_practices) || daily_practices.length === 0) {
    return null;
  }

  const sectionTitle = {
    tr: '🌟 Günlük Pratikler',
    en: '🌟 Daily Practices',
    sr: '🌟 Dnevne Prakse',
  };

  const sectionSubtitle = {
    tr: 'Bu kartın enerjisini günlük hayatınıza entegre etmek için pratik öneriler',
    en: 'Practical suggestions to integrate this card\'s energy into your daily life',
    sr: 'Praktični predlozi za integraciju energije ove karte u vaš svakodnevni život',
  };

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <h2 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
            {sectionTitle[locale]}
          </h2>
          <p className='text-lg text-gray-600 max-w-3xl mx-auto'>
            {sectionSubtitle[locale]}
          </p>
        </div>

        {/* Practices Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {daily_practices.map((practice, index) => (
            <div
              key={index}
              className='bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500'
            >
              <div className='flex items-start gap-4 mb-4'>
                <div className='w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0'>
                  {index + 1}
                </div>
                <h3 className='text-xl font-bold text-gray-900 flex-1'>
                  {practice.title}
                </h3>
              </div>
              <p className='text-gray-700 leading-relaxed ml-14'>
                {practice.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

