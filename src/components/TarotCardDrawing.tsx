'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from '@/hooks/useTranslations';
import { useTarotDeck } from '@/features/tarot/lib/full-tarot-deck';
import { getCardImagePath } from '@/features/tarot/lib/a-tarot-helpers';
import { BlogCardService } from '@/lib/data/blog-card-service';
import { CardData } from '@/features/tarot-cards/lib/card-data';
import { CardMapping } from '@/features/tarot-cards/lib/card-mapping';
import { logger } from '@/lib/logger';
import Link from 'next/link';
import { getCardName } from '@/lib/tarot/card-names';

interface TarotCardDrawingProps {
  locale: string;
  theme?: 'dark' | 'light';
}

// Kart isminden cardKey oluşturma fonksiyonu (CardMapping formatına uygun)
function getCardKeyFromName(cardName: string): string {
  // Major Arcana mapping - CardMapping formatına uygun
  const majorArcanaNames: Record<string, string> = {
    'The Fool': 'the-fool',
    'The Magician': 'the-magician',
    'The High Priestess': 'the-high-priestess',
    'The Empress': 'the-empress',
    'The Emperor': 'the-emperor',
    'The Hierophant': 'the-hierophant',
    'The Lovers': 'the-lovers',
    'The Chariot': 'the-chariot',
    Strength: 'strength',
    'The Hermit': 'the-hermit',
    'Wheel of Fortune': 'wheeloffortune', // CardMapping'de "wheeloffortune" bekleniyor
    Justice: 'justice',
    'The Hanged Man': 'the-hanged-man',
    Death: 'death',
    Temperance: 'temperance',
    'The Devil': 'the-devil',
    'The Tower': 'the-tower',
    'The Star': 'the-star',
    'The Moon': 'the-moon',
    'The Sun': 'the-sun',
    Judgement: 'Judgement', // CardMapping'de "Judgement" bekleniyor
    'The World': 'the-world',
  };

  if (majorArcanaNames[cardName]) {
    return majorArcanaNames[cardName];
  }

  // Minor Arcana - "Ace of Cups" formatından cardKey oluştur
  const minorArcanaMatch = cardName.match(
    /^(Ace|Two|Three|Four|Five|Six|Seven|Eight|Nine|Ten|Page|Knight|Queen|King) of (Cups|Wands|Swords|Pentacles)$/i
  );
  if (minorArcanaMatch) {
    const number = minorArcanaMatch[1]!.toLowerCase();
    const suit = minorArcanaMatch[2]!.toLowerCase();
    // CardMapping için "ace-cups" formatı, ama BlogCardService için "ace-of-cups" gerekiyor
    // CardMapping zaten bunu locale'e göre çevirecek, ama English için "ace-of-cups" döndürmeli
    return `${number}-of-${suit}`; // BlogCardService formatı: "ace-of-cups"
  }

  // Fallback: lowercase ve boşlukları tire ile değiştir
  return cardName.toLowerCase().replace(/\s+/g, '-');
}

export function TarotCardDrawing({
  locale,
  theme = 'dark',
}: TarotCardDrawingProps) {
  const { t } = useTranslations();
  const isLight = theme === 'light';
  const allCards = useTarotDeck();
  const [selectedCard, setSelectedCard] = useState<(typeof allCards)[0] | null>(
    null
  );
  const [cardData, setCardData] = useState<{
    future?: string;
    uprightGeneral?: string;
    shortDescription?: string;
  } | null>(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [isLoadingMeanings, setIsLoadingMeanings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Kart seçildiğinde anlamları çek - Direkt BlogCardService'den
  useEffect(() => {
    if (!selectedCard) {
      setCardData(null);
      return;
    }

    const fetchCardMeanings = async () => {
      setIsLoadingMeanings(true);
      setError(null);

      try {
        // Kart isminden cardKey oluştur
        const cardKey = getCardKeyFromName(selectedCard.name);

        // Debug log (development only)
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('🔍 Card Debug:', {
            cardName: selectedCard.name,
            cardKey,
            locale,
          });
        }

        // Minor Arcana için direkt BlogCardService formatını kullan
        // Major Arcana için CardMapping kullan
        let slug: string;
        if (cardKey.includes('-of-')) {
          // Minor Arcana - zaten "ace-of-cups" formatında
          if (locale === 'en') {
            // English için direkt "ace-of-cups" formatını kullan (BlogCardService formatı)
            slug = cardKey;
          } else {
            // TR ve SR için CardMapping kullan
            // "nine-of-wands" → "nine-wands" → CardMapping → "asalar-dokuzlu" (TR) veya "stap-devetka" (SR)
            const minorKey = cardKey.replace('-of-', '-');
            slug = CardMapping.getCardSlugForLocale(
              minorKey,
              locale as 'tr' | 'sr'
            );
            // CardMapping'in döndürdüğü slug BlogCardService'in slugMapping'inde var
            // Örnek: "asalar-dokuzlu" → BlogCardService slugMapping'de → "nine-of-wands" cardId
          }
        } else {
          // Major Arcana - CardMapping kullan
          slug = CardMapping.getCardSlugForLocale(
            cardKey,
            locale as 'tr' | 'en' | 'sr'
          );
          // BlogCardService formatına uyarla (wheeloffortune -> wheel-of-fortune, Judgement -> judgement)
          if (slug === 'wheeloffortune') {
            slug = 'wheel-of-fortune';
          } else if (slug === 'Judgement') {
            slug = 'judgement';
          }
        }

        // Debug log (development only)
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('🔍 Slug Debug:', {
            slug,
            cardKey,
          });
        }

        // CardData.getCardBySlug kullan (fallback mekanizması var)
        const cardPageData = await CardData.getCardBySlug(
          slug,
          locale as 'tr' | 'en' | 'sr'
        );

        // Debug log (development only)
        if (process.env.NODE_ENV === 'development') {
          // eslint-disable-next-line no-console
          console.log('🔍 CardPageData Debug:', {
            slug,
            found: !!cardPageData,
            hasContent: !!cardPageData?.content,
          });
        }

        if (cardPageData?.content) {
          const content = cardPageData.content;
          // Future bilgisini direkt context.celtic_cross.future'dan al
          const cardDataToSet: {
            future?: string;
            uprightGeneral?: string;
            shortDescription?: string;
          } = {};

          if (content.context?.celtic_cross?.future) {
            cardDataToSet.future = content.context.celtic_cross.future;
          }
          if (content.meanings?.upright?.general) {
            cardDataToSet.uprightGeneral = content.meanings.upright.general;
          }
          if (content.short_description) {
            cardDataToSet.shortDescription = content.short_description;
          }

          setCardData(cardDataToSet);
        } else {
          // Fallback: BlogCardService'i dene
          const blogCard = BlogCardService.getCardBySlug(
            slug,
            locale as 'tr' | 'en' | 'sr'
          );

          if (blogCard) {
            const cardDataToSet: {
              future?: string;
              uprightGeneral?: string;
              shortDescription?: string;
            } = {};

            if (blogCard.context?.celtic_cross?.future) {
              cardDataToSet.future = blogCard.context.celtic_cross.future;
            }
            if (blogCard.meanings?.upright?.general) {
              cardDataToSet.uprightGeneral = blogCard.meanings.upright.general;
            }
            if (blogCard.short_description) {
              cardDataToSet.shortDescription = blogCard.short_description;
            }

            setCardData(cardDataToSet);
          } else {
            setError('Card meanings not found');
          }
        }
      } catch (err) {
        logger.error('Error fetching card meanings:', err);
        setError('Failed to load card meanings');
      } finally {
        setIsLoadingMeanings(false);
      }
    };

    fetchCardMeanings();
  }, [selectedCard, locale]);

  const handleCardSelect = (card: (typeof allCards)[0]) => {
    if (selectedCard) {
      return; // Prevent selecting another card
    }

    setIsRevealing(true);
    setTimeout(() => {
      setSelectedCard(card);
      setIsRevealing(false);
    }, 600);
  };

  // 78 karttan rastgele 5 kart seç
  const getRandomCards = (cards: typeof allCards, count: number) => {
    if (!cards || cards.length === 0) {
      return [];
    }
    const shuffled = [...cards].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(count, cards.length));
  };

  const [randomCards, setRandomCards] = useState<(typeof allCards)[0][]>([]);

  // allCards yüklendiğinde rastgele 5 kart seç
  useEffect(() => {
    if (allCards && allCards.length > 0 && randomCards.length === 0) {
      const shuffled = [...allCards].sort(() => Math.random() - 0.5);
      setRandomCards(shuffled.slice(0, Math.min(5, allCards.length)));
    }
  }, [allCards, randomCards.length]);

  const handleReset = () => {
    setSelectedCard(null);
    setCardData(null);
    setIsRevealing(false);
    setError(null);
    // Yeni 5 kart seç (78 karttan rastgele)
    if (allCards && allCards.length > 0) {
      setRandomCards(getRandomCards(allCards, 5));
    }
  };

  return (
    <div className='w-full'>
      <AnimatePresence mode='wait'>
        {!selectedCard ? (
          <motion.div
            key='card-selection'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='flex flex-col items-center gap-6 sm:gap-8'
          >
            <div className='text-center max-w-md mx-auto mb-2 sm:mb-4'>
              <p
                className={`text-sm sm:text-base ${
                  isLight ? 'text-gray-700' : 'text-gray-300'
                }`}
              >
                {t(
                  'tarotCardDrawing.instruction',
                  'Focus on your question and select a card to reveal your guidance for today'
                )}
              </p>
            </div>

            {/* Card deck - Rastgele 5 kart */}
            <div className='flex justify-center gap-3 sm:gap-4 flex-wrap'>
              {randomCards.length > 0 ? (
                randomCards.map((card: (typeof allCards)[0], index: number) => (
                  <motion.button
                    key={card.id}
                    onClick={() => handleCardSelect(card)}
                    disabled={isRevealing}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 1) }}
                    whileHover={{ y: -10, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                    relative w-20 h-32 sm:w-24 sm:h-36 rounded-xl
                    ${
                      isLight
                        ? 'bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-purple-300 shadow-lg shadow-purple-200/50 hover:border-purple-400 hover:shadow-purple-300/70'
                        : 'backdrop-blur-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400/30 shadow-xl shadow-purple-500/20 hover:border-purple-400/50 hover:shadow-purple-500/40'
                    }
                    transition-all duration-300
                    ${isRevealing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                  >
                    {/* Card back design */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div
                        className={`text-2xl sm:text-3xl ${
                          isLight ? 'opacity-40' : 'opacity-60'
                        }`}
                      >
                        🔮
                      </div>
                    </div>
                    <div
                      className={`absolute inset-0 rounded-xl ${
                        isLight
                          ? 'bg-gradient-to-br from-purple-50/50 to-pink-50/50'
                          : 'bg-gradient-to-br from-purple-600/10 to-pink-600/10'
                      }`}
                    />

                    {/* Decorative pattern */}
                    <div
                      className={`absolute inset-1 rounded-lg border ${
                        isLight
                          ? 'border-purple-200/40'
                          : 'border-purple-400/20'
                      }`}
                    />
                    <div
                      className={`absolute inset-2 rounded-md border ${
                        isLight ? 'border-pink-200/30' : 'border-pink-400/10'
                      }`}
                    />
                  </motion.button>
                ))
              ) : (
                <div className='flex items-center justify-center py-8'>
                  <Loader2
                    className={`w-6 h-6 animate-spin ${
                      isLight ? 'text-purple-600' : 'text-purple-400'
                    }`}
                  />
                </div>
              )}
            </div>

            <p
              className={`text-sm animate-pulse ${
                isLight ? 'text-purple-600' : 'text-purple-300'
              }`}
            >
              {t('aklindakiKisi.page.hero.title', '✨ Tap any card ✨')}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key='card-reveal'
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className='flex flex-col items-center gap-4 sm:gap-6'
          >
            {/* Revealed card */}
            <motion.div
              initial={{ rotateY: 90 }}
              animate={{ rotateY: 0 }}
              transition={{ duration: 0.6 }}
              className='relative'
            >
              <div
                className={`relative w-48 h-72 sm:w-56 sm:h-80 rounded-2xl overflow-hidden ${
                  isLight
                    ? 'shadow-2xl shadow-purple-300/30'
                    : 'shadow-2xl shadow-purple-500/40'
                }`}
              >
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br blur-xl z-0 ${
                    isLight
                      ? 'from-purple-200/30 to-pink-200/30'
                      : 'from-purple-400/20 to-pink-400/20'
                  }`}
                />

                {/* Card Image */}
                <div className='relative z-10 w-full h-full'>
                  <Image
                    src={getCardImagePath(selectedCard)}
                    alt={selectedCard.nameTr || selectedCard.name}
                    width={280}
                    height={420}
                    className='w-full h-full object-cover rounded-2xl'
                    priority
                    onError={e => {
                      // Fallback to card back if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.src = '/cards/CardBack.webp';
                    }}
                  />
                </div>
              </div>

              {/* Card name - Kartın altında */}
              <h3
                className={`text-lg sm:text-xl text-center font-semibold mt-4 bg-gradient-to-r bg-clip-text text-transparent ${
                  isLight
                    ? 'from-purple-600 to-pink-600'
                    : 'from-purple-200 to-pink-200'
                }`}
              >
                {getCardName(
                  getCardKeyFromName(selectedCard.name),
                  locale as 'tr' | 'en' | 'sr'
                )}
              </h3>

              {/* Sparkle effects around card */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className='absolute -top-4 -right-4 z-20'
              >
                <Sparkles className='w-6 h-6 text-yellow-300 opacity-80' />
              </motion.div>
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                className='absolute -bottom-4 -left-4 z-20'
              >
                <Sparkles className='w-6 h-6 text-pink-300 opacity-80' />
              </motion.div>
            </motion.div>

            {/* Card Meanings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='max-w-2xl w-full space-y-6 px-4'
            >
              {isLoadingMeanings ? (
                <div className='flex items-center justify-center gap-3 py-8'>
                  <Loader2
                    className={`w-6 h-6 animate-spin ${
                      isLight ? 'text-purple-600' : 'text-purple-400'
                    }`}
                  />
                  <span className={isLight ? 'text-gray-700' : 'text-gray-300'}>
                    {t('tarotCardDrawing.loading', 'Loading card meanings...')}
                  </span>
                </div>
              ) : error ? (
                <div className='text-center py-8'>
                  <p
                    className={`mb-4 ${isLight ? 'text-red-600' : 'text-red-400'}`}
                  >
                    {error}
                  </p>
                  <button
                    onClick={handleReset}
                    className={`px-6 py-3 rounded-xl transition-all text-sm font-medium ${
                      isLight
                        ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 shadow-md'
                        : 'backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white'
                    }`}
                  >
                    {t('tarotCardDrawing.drawAnother', 'Draw Another Card')}
                  </button>
                </div>
              ) : cardData ? (
                <div className='space-y-6'>
                  {/* Future (Celtic Cross) - Öncelikli */}
                  {cardData.future ? (
                    <div
                      className={`rounded-xl p-6 ${
                        isLight
                          ? 'bg-white border border-gray-200 shadow-md'
                          : 'backdrop-blur-md bg-white/5 border border-white/10'
                      }`}
                    >
                      <h4
                        className={`text-lg font-semibold mb-3 ${
                          isLight ? 'text-amber-600' : 'text-yellow-300'
                        }`}
                      >
                        {t('tarotCardDrawing.future', 'Future')}
                      </h4>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          isLight ? 'text-gray-700' : 'text-gray-300'
                        }`}
                      >
                        {cardData.future}
                      </p>
                    </div>
                  ) : cardData.uprightGeneral ? (
                    // Future yoksa Upright Meaning göster
                    <div
                      className={`rounded-xl p-6 ${
                        isLight
                          ? 'bg-white border border-gray-200 shadow-md'
                          : 'backdrop-blur-md bg-white/5 border border-white/10'
                      }`}
                    >
                      <h4
                        className={`text-lg font-semibold mb-3 ${
                          isLight ? 'text-purple-600' : 'text-purple-300'
                        }`}
                      >
                        {t('tarotCardDrawing.meaning', 'Card Meaning')}
                      </h4>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          isLight ? 'text-gray-700' : 'text-gray-300'
                        }`}
                      >
                        {cardData.uprightGeneral}
                      </p>
                    </div>
                  ) : cardData.shortDescription ? (
                    // Upright meaning yoksa short_description göster
                    <div
                      className={`rounded-xl p-6 ${
                        isLight
                          ? 'bg-white border border-gray-200 shadow-md'
                          : 'backdrop-blur-md bg-white/5 border border-white/10'
                      }`}
                    >
                      <h4
                        className={`text-lg font-semibold mb-3 ${
                          isLight ? 'text-purple-600' : 'text-purple-300'
                        }`}
                      >
                        {t('tarotCardDrawing.meaning', 'Card Meaning')}
                      </h4>
                      <p
                        className={`text-sm sm:text-base leading-relaxed ${
                          isLight ? 'text-gray-700' : 'text-gray-300'
                        }`}
                      >
                        {cardData.shortDescription}
                      </p>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {/* CTAs */}
              <div className='flex flex-col sm:flex-row gap-3 pt-4'>
                <Link
                  href={`/${locale}/tarotokumasi`}
                  className='px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 text-center text-sm font-medium'
                >
                  {t('home.services.tarot.button', 'Get a Full Reading')}
                </Link>
                <button
                  onClick={handleReset}
                  className={`px-6 py-3 rounded-xl transition-all text-sm font-medium ${
                    isLight
                      ? 'bg-white border border-gray-300 hover:bg-gray-50 text-gray-900 shadow-md'
                      : 'backdrop-blur-md bg-white/10 border border-white/20 hover:bg-white/20 text-white'
                  }`}
                >
                  {t('tarotCardDrawing.drawAnother', 'Draw Another Card')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
