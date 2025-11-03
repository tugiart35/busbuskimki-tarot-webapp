import { CardContent } from '@/types/tarot-cards';

interface CardNumerologyProps {
  content: CardContent;
  locale: 'tr' | 'en' | 'sr';
}

export function CardNumerology({ content, locale }: CardNumerologyProps) {
  const { numerology } = content;

  if (!numerology?.number && numerology?.number !== 0) {
    return null;
  }

  const sectionTitle = {
    tr: '🔢 Numeroloji',
    en: '🔢 Numerology',
    sr: '🔢 Numerologija',
  };

  const numberLabel = {
    tr: 'Sayı',
    en: 'Number',
    sr: 'Broj',
  };

  const essenceLabel = {
    tr: 'Öz',
    en: 'Essence',
    sr: 'Suština',
  };

  const messageLabel = {
    tr: 'Mesaj',
    en: 'Message',
    sr: 'Poruka',
  };

  return (
    <section className='py-16 px-4 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-12'>
          <div className='inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-6'>
            <span className='text-5xl'>{numerology.number}</span>
          </div>
          <h2 className='text-3xl lg:text-4xl font-bold mb-4'>
            {sectionTitle[locale]}
          </h2>
        </div>

        {/* Number Display */}
        <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-white/20'>
          <div className='text-center mb-6'>
            <p className='text-sm uppercase tracking-wider text-white/70 mb-2'>
              {numberLabel[locale]}
            </p>
            <div className='text-7xl font-bold bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent'>
              {numerology.number}
            </div>
          </div>
        </div>

        {/* Essence */}
        {numerology.essence && (
          <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-6 border border-white/20'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 text-2xl'>
                ✨
              </div>
              <div className='flex-1'>
                <h3 className='text-xl font-bold mb-3 text-yellow-300'>
                  {essenceLabel[locale]}
                </h3>
                <p className='text-lg leading-relaxed text-white/90'>
                  {numerology.essence}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Message */}
        {numerology.message && (
          <div className='bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20'>
            <div className='flex items-start gap-4'>
              <div className='w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-2xl'>
                💫
              </div>
              <div className='flex-1'>
                <h3 className='text-xl font-bold mb-3 text-pink-300'>
                  {messageLabel[locale]}
                </h3>
                <p className='text-lg leading-relaxed text-white/90'>
                  {numerology.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
