/*
 * Numerology Result Modal Component
 * Displays calculation results in a beautiful modal
 * Lazy-loaded for performance optimization
 */

'use client';

import { NumerologyResult } from '@/lib/numerology/types';
import { useTranslations } from '@/hooks/useTranslations';

interface NumerologyResultModalProps {
  result: NumerologyResult;
  activeTab: string;
  tabs: Array<{ id: string; label: string; icon: string }>;
  onClose: () => void;
}

export default function NumerologyResultModal({
  result,
  activeTab,
  tabs,
  onClose,
}: NumerologyResultModalProps) {
  const { t } = useTranslations();

  return (
    <div className='fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300'>
      <div className='bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-purple-500/20 border border-white/10 animate-in zoom-in-95 duration-300'>
        <div className='p-8'>
          {/* Enhanced Modal Header */}
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center gap-3'>
              <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
                <span className='text-2xl'>
                  {tabs.find(tab => tab.id === activeTab)?.icon}
                </span>
              </div>
              <div>
                <h3 className='text-xl font-bold text-white'>
                  {tabs.find(tab => tab.id === activeTab)?.label}{' '}
                  {t('numerology.page.results.title')}
                </h3>
                <p className='text-sm text-gray-400'>
                  {t('numerology.page.results.subtitle')}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className='w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200 hover:scale-110'
            >
              <span className='text-xl'>×</span>
            </button>
          </div>

          {/* Enhanced Result Content */}
          <div className='space-y-6'>
            {/* Enhanced Number Display */}
            <div className='text-center'>
              <div className='relative inline-block'>
                <div className='w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-purple-500/30'>
                  <span className='text-4xl font-bold text-white'>
                    {result.number}
                  </span>
                </div>
                {result.isMasterNumber && (
                  <div className='absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center'>
                    <span className='text-yellow-900 text-xs font-bold'>
                      ★
                    </span>
                  </div>
                )}
              </div>
              {result.isMasterNumber && (
                <div className='inline-flex items-center gap-2 px-4 py-2 bg-yellow-400/20 rounded-full'>
                  <span className='text-yellow-400 text-sm font-semibold'>
                    ✨ {t('numerology.page.results.masterNumber')}
                  </span>
                </div>
              )}
            </div>

            {/* Enhanced Description */}
            <div className='bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10'>
              <div className='flex items-center gap-2 mb-3'>
                <span className='text-lg'>📖</span>
                <h4 className='text-white font-semibold'>
                  {t('numerology.page.results.description')}
                </h4>
              </div>
              <p className='text-gray-300 text-sm leading-relaxed whitespace-pre-line'>
                {result.description}
              </p>
            </div>

            {/* Special Results */}
            {result.pinnacles && (
              <div className='bg-gray-800 rounded-lg p-4'>
                <h4 className='text-white font-semibold mb-2'>
                  {t('numerology.page.results.pinnacles')}
                </h4>
                <div className='grid grid-cols-2 gap-2'>
                  {result.pinnacles.map((pinnacle, index) => (
                    <div key={index} className='text-center'>
                      <div className='text-lg font-bold text-purple-400'>
                        {pinnacle.number}
                      </div>
                      <div className='text-xs text-gray-400'>
                        {pinnacle.period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.challenges && (
              <div className='bg-gray-800 rounded-lg p-4'>
                <h4 className='text-white font-semibold mb-2'>
                  {t('numerology.page.results.challenges')}
                </h4>
                <div className='grid grid-cols-2 gap-2'>
                  {result.challenges.map((challenge, index) => (
                    <div key={index} className='text-center'>
                      <div className='text-lg font-bold text-red-400'>
                        {challenge.number}
                      </div>
                      <div className='text-xs text-gray-400'>
                        {challenge.period}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.personalYear && (
              <div className='bg-gray-800 rounded-lg p-4'>
                <h4 className='text-white font-semibold mb-2'>
                  {t('numerology.page.results.personalCycles')}
                </h4>
                <div className='grid grid-cols-3 gap-2 text-center'>
                  <div>
                    <div className='text-lg font-bold text-blue-400'>
                      {result.personalYear}
                    </div>
                    <div className='text-xs text-gray-400'>
                      {t('numerology.page.results.year')}
                    </div>
                  </div>
                  <div>
                    <div className='text-lg font-bold text-green-400'>
                      {result.personalMonth}
                    </div>
                    <div className='text-xs text-gray-400'>
                      {t('numerology.page.results.month')}
                    </div>
                  </div>
                  <div>
                    <div className='text-lg font-bold text-yellow-400'>
                      {result.personalDay}
                    </div>
                    <div className='text-xs text-gray-400'>
                      {t('numerology.page.results.day')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {result.compatibilityScore && (
              <div className='bg-gray-800 rounded-lg p-4'>
                <h4 className='text-white font-semibold mb-2'>
                  {t('numerology.page.results.compatibility')}
                </h4>
                <div className='text-center mb-2'>
                  <div className='text-3xl font-bold text-pink-400'>
                    {result.compatibilityScore}/100
                  </div>
                  <div className='text-sm text-gray-400'>
                    {t('numerology.page.results.compatibilityScore')}
                  </div>
                </div>
                {result.compatibilityNotes && (
                  <div className='text-sm text-gray-300'>
                    {result.compatibilityNotes.map((note, index) => (
                      <div key={index}>• {note}</div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Enhanced Close Button */}
          <div className='mt-8'>
            <button
              onClick={onClose}
              className='group w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25'
            >
              <div className='flex items-center justify-center gap-2'>
                <span className='text-lg group-hover:scale-110 transition-transform duration-300'>
                  ✨
                </span>
                <span>{t('numerology.page.close')}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

