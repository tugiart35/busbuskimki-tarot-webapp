'use client';

import { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export function KaynakBilgisiAccordion() {
  const { t } = useTranslations();
  const [isOpen, setIsOpen] = useState(false);

  // Namespace'i manuel olarak ekle
  const getTranslation = (key: string) => {
    return t(`psychTests.page.scientificBasis.${key}`);
  };

  return (
    <div className='mt-12 bg-white/5 rounded-xl border border-white/10 overflow-hidden'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors'
        aria-expanded={isOpen}
        aria-controls='kaynak-bilgisi-content'
      >
        <h2 className='text-xl font-bold text-white'>
          {getTranslation('title')}
        </h2>
        <svg
          className={`w-5 h-5 text-white transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 9l-7 7-7-7'
          />
        </svg>
      </button>

      {isOpen && (
        <div
          id='kaynak-bilgisi-content'
          className='px-6 pb-6 space-y-3 text-sm text-white/70 border-t border-white/10 pt-4'
        >
          <p>
            <strong className='text-white'>MBTI:</strong>{' '}
            {getTranslation('mbti')}
          </p>
          <p>
            <strong className='text-white'>Enneagram:</strong>{' '}
            {getTranslation('enneagram')}
          </p>
          <p>
            <strong className='text-white'>Big Five (OCEAN):</strong>{' '}
            {getTranslation('bigFive')}
          </p>
          <p>
            <strong className='text-white'>Deniz Fırtınası Testi:</strong>{' '}
            {getTranslation('seaStorm')}
          </p>
          <p>
            <strong className='text-white'>
              İsim Enerjine Göre Tarot Kartın:
            </strong>{' '}
            {getTranslation('nameEnergy')}
          </p>
          <p>
            <strong className='text-white'>Stres Düzeyi Testi:</strong>{' '}
            {getTranslation('stressTest')}
          </p>
          <p>
            <strong className='text-white'>
              Aşk Enerjisi (Love Vibration):
            </strong>{' '}
            {getTranslation('loveVibration')}
          </p>
          <p>
            <strong className='text-white'>Arkadaş Grubu Enerjisi:</strong>{' '}
            {getTranslation('friendGroup')}
          </p>
          <p className='text-xs text-white/50 mt-4'>
            <strong>Not:</strong> {getTranslation('disclaimer')}
          </p>
        </div>
      )}
    </div>
  );
}
