/*
 * Numerology Error Modal Component
 * Displays errors in a user-friendly modal
 * Lazy-loaded for performance
 */

'use client';

import { useTranslations } from '@/hooks/useTranslations';

interface ErrorModalProps {
  error: string;
  onClose: () => void;
}

export default function ErrorModal({ error, onClose }: ErrorModalProps) {
  const { t } = useTranslations();

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300'>
      <div className='bg-gradient-to-br from-red-900/90 via-gray-900 to-red-900/90 rounded-3xl max-w-md w-full p-8 shadow-2xl shadow-red-500/20 border border-red-500/20 animate-in zoom-in-95 duration-300'>
        <div className='text-center'>
          <div className='relative inline-block mb-6'>
            <div className='w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-red-500/30'>
              <span className='text-3xl'>⚠️</span>
            </div>
            <div className='absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-pulse'></div>
          </div>
          <h3 className='text-2xl font-bold text-white mb-3'>
            {t('numerology.page.errors.calculationError')}
          </h3>
          <p className='text-gray-300 mb-6 leading-relaxed'>{error}</p>
          <button
            onClick={onClose}
            className='group w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-4 rounded-2xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-red-500/25'
          >
            <div className='flex items-center justify-center gap-2'>
              <span className='text-lg group-hover:scale-110 transition-transform duration-300'>
                👍
              </span>
              <span>{t('numerology.page.close')}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

