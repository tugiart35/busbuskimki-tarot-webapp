'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react'; // veya kendi icon'unuz

interface ExpertCommentaryModalProps {
  locale: 'tr' | 'en' | 'sr';
}

export function ExpertCommentaryModal({ locale }: ExpertCommentaryModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // LocalStorage kontrolü
    const hasSeenCommentary = localStorage.getItem('expertCommentaryDismissed');

    if (!hasSeenCommentary) {
      // 1 saniye bekle, sonra göster (sayfanın yüklenmesini bekle)
      setTimeout(() => {
        setShouldShow(true);
        setIsOpen(true);
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('expertCommentaryDismissed', 'true');

    // Animasyon bitsin diye bekle
    setTimeout(() => {
      setShouldShow(false);
    }, 300);
  };

  if (!shouldShow) {
    return null;
  }

  const content = {
    tr: {
      title: '🔮 Hoş Geldiniz!',
      subtitle: 'Tarot ve İçsel Keşif Hakkında',
      text: 'Tarot, yüzyıllardır insanların içsel yolculuklarında rehber olmuş evrensel bir bilgelik aracıdır. Büşbüşkimki olarak, tarot kartlarını sadece fal aracı değil, aynı zamanda kendini tanıma ve farkındalık geliştirme yolu olarak görüyoruz.',
      disclaimer:
        '💡 Tarot, eğlence ve kişisel gelişim amaçlıdır. Profesyonel yaşam tavsiyesi yerine geçmez.',
      button: 'Anladım',
    },
    en: {
      title: '🔮 Welcome!',
      subtitle: 'About Tarot and Inner Discovery',
      text: 'Tarot has been a universal wisdom tool guiding people in their inner journeys for centuries. At Büşbüşkimki, we see tarot cards not just as fortune-telling tools, but as a path for self-discovery and awareness development.',
      disclaimer:
        '💡 Tarot is for entertainment and personal development purposes. It does not replace professional life advice.',
      button: 'Got it',
    },
    sr: {
      title: '🔮 Dobrodošli!',
      subtitle: 'O Tarotu i Unutrašnjem Otkrivanju',
      text: 'Tarot je vekovima bio univerzalni alat mudrosti koji vodi ljude na njihovim unutrašnjim putovanjima. U Büşbüşkimki, vidimo tarot karte ne samo kao alat za gatanje, već kao put za samootkrivanje i razvoj svesti.',
      disclaimer:
        '💡 Tarot je za zabavu i lični razvoj. Ne zamenjuje profesionalni životni savet.',
      button: 'Razumem',
    },
  };

  const t = content[locale];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg mx-4 transition-all duration-300 ${
          isOpen
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className='bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-200'>
          {/* Header */}
          <div className='bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 relative'>
            <button
              onClick={handleClose}
              className='absolute top-4 right-4 text-white/80 hover:text-white transition-colors'
            >
              <X size={24} />
            </button>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg'>
                <span className='text-2xl'>✨</span>
              </div>
              <div>
                <h3 className='text-2xl font-bold text-white'>{t.title}</h3>
                <p className='text-purple-100 text-sm'>{t.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className='p-6'>
            <p className='text-gray-700 leading-relaxed mb-4 text-base'>
              {t.text}
            </p>

            {/* Disclaimer */}
            <div className='bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border border-purple-200 mb-4'>
              <p className='text-sm text-gray-700 text-center'>
                {t.disclaimer}
              </p>
            </div>

            {/* Button */}
            <button
              onClick={handleClose}
              className='w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105'
            >
              {t.button}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
