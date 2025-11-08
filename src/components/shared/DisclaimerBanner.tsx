'use client';

import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaTimes, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';

interface DisclaimerBannerProps {
  locale: 'tr' | 'en' | 'sr';
}

const DISCLAIMER_DISMISSED_KEY = 'busbuskimki_disclaimer_dismissed';

export default function DisclaimerBanner({ locale }: DisclaimerBannerProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if user has previously dismissed the banner
    const dismissed = localStorage.getItem(DISCLAIMER_DISMISSED_KEY);
    if (!dismissed) {
      // Show banner after a short delay for better UX
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      localStorage.setItem(DISCLAIMER_DISMISSED_KEY, 'true');
    }, 300);
  };

  const getContent = () => {
    switch (locale) {
      case 'tr':
        return {
          icon: '🔮',
          title: 'Önemli Uyarı',
          message:
            'Bu site eğlence ve kişisel gelişim amaçlıdır. Tarot falı, profesyonel tıbbi, hukuki veya finansal tavsiye yerine geçmez. Herhangi bir karar vermeden önce lütfen uzman görüşü alın.',
          learnMore: 'Daha Fazla Bilgi',
          close: 'Anladım',
          ageNotice: '18+ içerik: Bu site yetişkinler içindir.',
        };
      case 'en':
        return {
          icon: '🔮',
          title: 'Important Notice',
          message:
            'This site is for entertainment and personal development purposes. Tarot readings do not replace professional medical, legal, or financial advice. Please consult experts before making any decisions.',
          learnMore: 'Learn More',
          close: 'Got it',
          ageNotice: '18+ content: This site is for adults.',
        };
      case 'sr':
        return {
          icon: '🔮',
          title: 'Važno Upozorenje',
          message:
            'Ova stranica je namenjena zabavi i ličnom razvoju. Tarot čitanja ne zamenjuju profesionalne medicinske, pravne ili finansijske savete. Molimo konsultujte stručnjake pre donošenja bilo kakvih odluka.',
          learnMore: 'Saznaj Više',
          close: 'Razumem',
          ageNotice: '18+ sadržaj: Ova stranica je namenjena odraslima.',
        };
      default:
        return {
          icon: '🔮',
          title: 'Important Notice',
          message:
            'This site is for entertainment and personal development purposes.',
          learnMore: 'Learn More',
          close: 'Got it',
          ageNotice: '18+ content: This site is for adults.',
        };
    }
  };

  if (!isVisible) {
    return null;
  }

  const content = getContent();

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[100] transform transition-all duration-300 ${
        isClosing ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
      }`}
      role='alert'
      aria-live='polite'
    >
      {/* Banner Container */}
      <div className='bg-gradient-to-r from-amber-900/95 via-orange-900/95 to-amber-900/95 backdrop-blur-lg border-b-2 border-amber-500/50 shadow-2xl shadow-amber-500/20'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3'>
          <div className='flex items-start justify-between gap-4'>
            {/* Icon + Content */}
            <div className='flex items-start gap-3 flex-1 min-w-0'>
              {/* Warning Icon */}
              <div className='flex-shrink-0 mt-0.5'>
                <div className='w-8 h-8 bg-gradient-to-br from-amber-400/20 to-orange-400/20 rounded-lg flex items-center justify-center border border-amber-500/30'>
                  <FaExclamationTriangle className='w-4 h-4 text-amber-300' />
                </div>
              </div>

              {/* Text Content */}
              <div className='flex-1 min-w-0'>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='text-lg'>{content.icon}</span>
                  <h3 className='text-sm font-bold text-amber-100'>
                    {content.title}
                  </h3>
                </div>
                <p className='text-xs sm:text-sm text-amber-50/90 leading-relaxed mb-2'>
                  {content.message}
                </p>

                {/* Age Notice */}
                <div className='flex items-center gap-2 mb-2'>
                  <FaInfoCircle className='w-3 h-3 text-amber-300 flex-shrink-0' />
                  <p className='text-xs text-amber-200/80 font-medium'>
                    {content.ageNotice}
                  </p>
                </div>

                {/* Learn More Link */}
                <Link
                  href={`/${locale}/legal/disclaimer`}
                  className='inline-flex items-center gap-1 text-xs font-medium text-amber-300 hover:text-amber-100 transition-colors underline'
                >
                  <FaInfoCircle className='w-3 h-3' />
                  {content.learnMore}
                </Link>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className='flex-shrink-0 group p-2 bg-amber-800/30 hover:bg-amber-700/40 rounded-lg transition-all duration-200 border border-amber-500/20 hover:border-amber-500/40'
              aria-label={content.close}
            >
              <FaTimes className='w-4 h-4 text-amber-200 group-hover:text-white transition-colors' />
            </button>
          </div>

          {/* Mobile: Dismiss Text */}
          <div className='sm:hidden mt-2 text-center'>
            <button
              onClick={handleDismiss}
              className='text-xs text-amber-300 hover:text-amber-100 font-medium underline'
            >
              {content.close}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
