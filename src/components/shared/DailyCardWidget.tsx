'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';

interface DailyCard {
  id: string;
  name: string;
  imageUrl: string;
  url: string;
  shortMeaning: string;
  date: string;
}

interface DailyCardWidgetProps {
  locale: 'tr' | 'en' | 'sr';
}

// Sample tarot cards data (daha sonra Supabase'den çekilecek)
const SAMPLE_CARDS = [
  {
    id: 'the-fool',
    name: { tr: 'Deli (Joker)', en: 'The Fool', sr: 'Joker' },
    imageUrl: '/cards/rws/0-Fool.webp',
    url: {
      tr: '/tr/kartlar/joker',
      en: '/en/cards/the-fool',
      sr: '/sr/kartice/joker',
    },
    shortMeaning: {
      tr: 'Yeni başlangıçlar, cesaret ve saf potansiyel',
      en: 'New beginnings, courage and pure potential',
      sr: 'Novi počeci, hrabrost i čist potencijal',
    },
  },
  {
    id: 'the-magician',
    name: { tr: 'Büyücü', en: 'The Magician', sr: 'Čarobnjak' },
    imageUrl: '/cards/rws/I-Magician.webp',
    url: {
      tr: '/tr/kartlar/buyucu',
      en: '/en/cards/the-magician',
      sr: '/sr/kartice/carobnjak',
    },
    shortMeaning: {
      tr: 'Yaratıcılık, beceri ve tezahür gücü',
      en: 'Creativity, skill and manifestation power',
      sr: 'Kreativnost, veština i moć manifestacije',
    },
  },
];

export function DailyCardWidget({ locale }: DailyCardWidgetProps) {
  const [dailyCard, setDailyCard] = useState<DailyCard | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnToday, setHasDrawnToday] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkTodaysCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkTodaysCard = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0]!;

      // Supabase'den bugünün kartını kontrol et
      const { data, error } = await supabase
        .from('daily_cards')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single();

      if (data && !error) {
        setDailyCard({
          id: data.card_id,
          name: data.card_name,
          imageUrl: data.card_image_url,
          url: data.card_url,
          shortMeaning: data.card_meaning,
          date: data.date,
        });
        setHasDrawnToday(true);
      }
    } catch (error) {
      console.error('Error checking daily card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const drawCard = async () => {
    if (hasDrawnToday) {
      return;
    }

    setIsDrawing(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert(
          locale === 'tr'
            ? 'Kart çekmek için giriş yapmalısınız.'
            : locale === 'en'
              ? 'You must log in to draw a card.'
              : 'Morate se prijaviti da biste izvukli kartu.'
        );
        setIsDrawing(false);
        return;
      }

      // Animation delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Select random card
      const randomIndex = Math.floor(Math.random() * SAMPLE_CARDS.length);
      const selectedCard = SAMPLE_CARDS[randomIndex];

      if (!selectedCard) {
        setIsDrawing(false);
        return;
      }

      const today = new Date().toISOString().split('T')[0]!;
      const card: DailyCard = {
        id: selectedCard.id,
        name: selectedCard.name[locale],
        imageUrl: selectedCard.imageUrl,
        url: selectedCard.url[locale],
        shortMeaning: selectedCard.shortMeaning[locale],
        date: today,
      };

      // Supabase'e kaydet (upsert ile - aynı gün için güncelleme yapar)
      const { error } = await supabase.from('daily_cards').upsert(
        {
          user_id: user.id,
          card_id: card.id,
          card_name: card.name,
          card_image_url: card.imageUrl,
          card_url: card.url,
          card_meaning: card.shortMeaning,
          date: today,
          locale,
        },
        {
          onConflict: 'user_id,date', // Aynı user + date varsa güncelle
          ignoreDuplicates: false,
        }
      );

      if (error) {
        console.error('Error saving daily card:', error);
      } else {
        setDailyCard(card);
        setHasDrawnToday(true);
      }
    } catch (error) {
      console.error('Error drawing card:', error);
    } finally {
      setIsDrawing(false);
    }
  };

  const getTitle = () => {
    if (locale === 'tr') {
      return 'Bugünün Kartı';
    }
    if (locale === 'en') {
      return 'Card of the Day';
    }
    return 'Karta Dana';
  };

  const getButtonText = () => {
    if (locale === 'tr') {
      return 'Kartını Çek';
    }
    if (locale === 'en') {
      return 'Draw Your Card';
    }
    return 'Izvuci Kartu';
  };

  const getDescription = () => {
    if (locale === 'tr') {
      return 'Günlük rehberliğiniz için bir kart çekin';
    }
    if (locale === 'en') {
      return 'Draw a card for your daily guidance';
    }
    return 'Izvucite kartu za vaše dnevno vođstvo';
  };

  const getAlreadyDrawnText = () => {
    if (locale === 'tr') {
      return 'Bugün zaten kartınızı çektiniz. Yarın tekrar deneyin!';
    }
    if (locale === 'en') {
      return 'You already drew your card today. Try again tomorrow!';
    }
    return 'Već ste izvukli kartu danas. Pokušajte ponovo sutra!';
  };

  const getViewDetailsText = () => {
    if (locale === 'tr') {
      return 'Detaylı Anlam';
    }
    if (locale === 'en') {
      return 'View Details';
    }
    return 'Pogledaj Detalje';
  };

  if (isLoading) {
    return (
      <div className='bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white'>
        <div className='text-center py-12'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto'></div>
          <p className='mt-4 text-purple-100'>
            {locale === 'tr'
              ? 'Yükleniyor...'
              : locale === 'en'
                ? 'Loading...'
                : 'Učitavanje...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl shadow-2xl p-8 text-white'>
      {/* Header */}
      <div className='text-center mb-6'>
        <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4'>
          <span className='text-4xl'>🔮</span>
        </div>
        <h3 className='text-2xl lg:text-3xl font-bold mb-2'>{getTitle()}</h3>
        <p className='text-purple-100'>{getDescription()}</p>
      </div>

      {/* Card Display or Draw Button */}
      <div className='relative'>
        {!dailyCard ? (
          <div className='text-center py-12'>
            <button
              onClick={drawCard}
              disabled={isDrawing}
              className={`px-8 py-4 bg-white text-purple-600 font-bold rounded-lg shadow-lg transform transition-all duration-300 ${
                isDrawing
                  ? 'scale-95 opacity-70 cursor-wait'
                  : 'hover:scale-105 hover:shadow-xl active:scale-95'
              }`}
            >
              {isDrawing ? (
                <span className='flex items-center gap-3'>
                  <svg
                    className='animate-spin h-5 w-5'
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                  >
                    <circle
                      className='opacity-25'
                      cx='12'
                      cy='12'
                      r='10'
                      stroke='currentColor'
                      strokeWidth='4'
                    ></circle>
                    <path
                      className='opacity-75'
                      fill='currentColor'
                      d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                    ></path>
                  </svg>
                  {locale === 'tr'
                    ? 'Çekiliyor...'
                    : locale === 'en'
                      ? 'Drawing...'
                      : 'Izvlačenje...'}
                </span>
              ) : (
                getButtonText()
              )}
            </button>
          </div>
        ) : (
          <div className='bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-4'>
            {/* Card Image */}
            <div className='relative w-48 h-72 mx-auto'>
              <Image
                src={dailyCard.imageUrl}
                alt={`${dailyCard.name} tarot kartı`}
                fill
                className='object-cover rounded-lg shadow-xl'
              />
            </div>

            {/* Card Info */}
            <div className='text-center space-y-2'>
              <h4 className='text-2xl font-bold'>{dailyCard.name}</h4>
              <p className='text-purple-100 leading-relaxed'>
                {dailyCard.shortMeaning}
              </p>

              {/* View Details Button */}
              <Link
                href={dailyCard.url}
                className='inline-block mt-4 px-6 py-3 bg-white text-purple-600 font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200'
              >
                {getViewDetailsText()} →
              </Link>

              {/* Already Drawn Message */}
              {hasDrawnToday && (
                <p className='text-xs text-purple-200 mt-4'>
                  {getAlreadyDrawnText()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none rounded-2xl'>
        <div className='absolute -top-20 -right-20 w-40 h-40 bg-purple-400/20 rounded-full blur-3xl'></div>
        <div className='absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-3xl'></div>
      </div>
    </div>
  );
}

// Default export for dynamic import
export default DailyCardWidget;
