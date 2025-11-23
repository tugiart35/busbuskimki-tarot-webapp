'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  shuffleCards,
  getCardImagePath,
  getBackImagePath,
} from '@/lib/aklindaki-kisi/utils';
import {
  ValidateTokenResponse,
  DrawCardResponse,
} from '@/types/aklindaki-kisi.types';
import { Mail, ArrowRight, Clock, X, Info } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from '@/hooks/useTranslations';

export default function AklindakiKisiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useTranslations();
  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  const [cards, setCards] = useState<number[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [isShuffling, setIsShuffling] = useState(false);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [remainingCards, setRemainingCards] = useState<number | null>(null);
  const [drawingCard, setDrawingCard] = useState(false);
  const [resetCountdown, setResetCountdown] = useState<number | null>(null); // Toplam kalan süre (milisaniye) - 31 gün sonra sıfırlanır
  const [fullscreenCard, setFullscreenCard] = useState<number | null>(null); // Tam ekran gösterilecek kart numarası

  // E-posta girişi state
  const [requiresEmail, setRequiresEmail] = useState(false);
  const [email, setEmail] = useState(emailParam || '');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [validatingEmail, setValidatingEmail] = useState(false);

  // Kullanıcının yerel saat dilimini al
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const formatCountdown = useCallback(
    (milliseconds: number): string => {
      const totalSeconds = Math.floor(milliseconds / 1000);
      const days = Math.floor(totalSeconds / (24 * 60 * 60));
      const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      if (days > 0) {
        return t('aklindakiKisi.page.countdown.daysHoursMinutes', {
          days,
          hours,
          minutes,
        });
      }
      if (hours > 0) {
        return t('aklindakiKisi.page.countdown.hoursMinutesSeconds', {
          hours,
          minutes,
          seconds,
        });
      }
      if (minutes > 0) {
        return t('aklindakiKisi.page.countdown.minutesSeconds', {
          minutes,
          seconds,
        });
      }
      return t('aklindakiKisi.page.countdown.secondsOnly', { seconds });
    },
    [t]
  );

  // Initialize cards (2-45, toplam 44 kart) - Token validation'dan sonra yapılacak

  // Reset countdown geri sayım (her saniye güncelle)
  useEffect(() => {
    if (resetCountdown === null || resetCountdown <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setResetCountdown(prev => {
        if (prev === null || prev <= 0) {
          return 0;
        }
        const newValue = prev - 1000; // 1 saniye azalt
        if (newValue <= 0) {
          // Süre doldu, sayfayı yenile
          window.location.reload();
          return 0;
        }
        return newValue;
      });
    }, 1000); // Her saniye güncelle

    return () => clearInterval(interval);
  }, [resetCountdown]);

  // Token validation
  useEffect(() => {
    if (!token) {
      setError(t('aklindakiKisi.page.errors.tokenMissing'));
      setTokenValid(false);
      setLoading(false);
      return;
    }

    const validateToken = async () => {
      try {
        // Timezone parametresini ekle
        const url = emailParam
          ? `/api/aklindaki-kisi/validate?token=${token}&email=${encodeURIComponent(emailParam)}&timezone=${encodeURIComponent(userTimezone)}`
          : `/api/aklindaki-kisi/validate?token=${token}&timezone=${encodeURIComponent(userTimezone)}`;

        const response = await fetch(url);
        const data: ValidateTokenResponse = await response.json();

        if (data.requiresEmail && !emailParam) {
          // E-posta girişi gerekiyor
          setRequiresEmail(true);
          setTokenValid(false);
          setLoading(false);
          return;
        }

        if (!response.ok || !data.valid) {
          setError(data.error || t('aklindakiKisi.page.errors.tokenInvalid'));
          setTokenValid(false);
          setLoading(false);
          return;
        }

        setTokenValid(true);
        setRequiresEmail(false);

        // remainingCards bilgisini set et (eğer varsa)
        if (data.remainingCards !== undefined) {
          setRemainingCards(data.remainingCards);
        }

        // resetCountdown bilgisini set et (eğer varsa)
        if (data.resetCountdown !== undefined) {
          setResetCountdown(data.resetCountdown);
        }

        // Kartları initialize et (eğer henüz initialize edilmediyse)
        const allCardNumbers = Array.from({ length: 44 }, (_, i) => i + 2); // 2-45

        // Açılan kartları state'e yükle (database'den gelen)
        if (data.resetCountdown !== undefined && data.resetCountdown <= 0) {
          // Süre dolmuş, kartları sıfırla
          setFlippedCards(new Set());
          // Kartları shuffle edilmiş olarak initialize et
          const shuffled = shuffleCards(allCardNumbers);
          setCards(shuffled);
        } else if (data.openedCards && data.openedCards.length > 0) {
          // Açılan kartları flippedCards state'ine set et
          const openedCardsSet = new Set(data.openedCards);
          setFlippedCards(openedCardsSet);

          // Tüm kartları karıştır (açılan kartlar da dahil)
          const shuffled = shuffleCards(allCardNumbers);
          setCards(shuffled);
        } else {
          // Hiç açılan kart yok, tüm kartları shuffle et
          const shuffled = shuffleCards(allCardNumbers);
          setCards(shuffled);
        }

        setLoading(false);
      } catch (err) {
        setError(t('aklindakiKisi.page.errors.tokenValidation'));
        setTokenValid(false);
        setLoading(false);
      }
    };

    validateToken();
  }, [emailParam, t, token, userTimezone]);

  // E-posta doğrulama
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);
    setValidatingEmail(true);

    if (!email.trim()) {
      setEmailError(t('aklindakiKisi.page.email.errors.required'));
      setValidatingEmail(false);
      return;
    }

    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t('aklindakiKisi.page.email.errors.invalidFormat'));
      setValidatingEmail(false);
      return;
    }

    try {
      const response = await fetch(
        `/api/aklindaki-kisi/validate?token=${token}&email=${encodeURIComponent(email.trim())}`
      );
      const data: ValidateTokenResponse = await response.json();

      if (!response.ok || !data.valid) {
        setEmailError(
          data.error || t('aklindakiKisi.page.email.errors.validationFailed')
        );
        setValidatingEmail(false);
        return;
      }

      // E-posta doğru, URL'yi güncelle ve sayfayı yenile
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('email', email.trim());
      router.push(newUrl.pathname + newUrl.search);
    } catch (err) {
      setEmailError(t('aklindakiKisi.page.email.errors.network'));
      setValidatingEmail(false);
    }
  };

  // Shuffle cards (visual only) - Tüm kartları karıştır (açık kartlar dahil)
  const handleShuffle = useCallback(() => {
    setIsShuffling(true);

    // Tüm kartları karıştır (açık kartlar dahil)
    const shuffledCards = shuffleCards([...cards]);

    setCards(shuffledCards);
    setTimeout(() => {
      setIsShuffling(false);
    }, 500);
  }, [cards]);

  // Draw card
  const handleCardClick = useCallback(
    async (cardNumber: number) => {
      // Eğer kart zaten açıksa, tekrar çekme
      if (
        !token ||
        drawingCard ||
        dailyLimitReached ||
        flippedCards.has(cardNumber)
      ) {
        return;
      }

      setDrawingCard(true);
      setError(null);

      try {
        const response = await fetch('/api/aklindaki-kisi/draw', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            timezone: userTimezone, // Timezone bilgisini gönder
          }),
        });

        const data: DrawCardResponse = await response.json();

        if (!response.ok || !data.success) {
          if (data.dailyLimitReached) {
            setDailyLimitReached(true);
            setError(t('aklindakiKisi.page.errors.dailyLimit'));
          } else {
            setError(data.error || t('aklindakiKisi.page.errors.cardDraw'));
          }
          setDrawingCard(false);
          return;
        }

        if (data.card) {
          const drawnCardNumber = data.card.card_number;

          // Tıklanan kartın ilk göründüğü pozisyonu bul
          const firstOccurrenceIndex = cards.indexOf(cardNumber);

          if (firstOccurrenceIndex !== -1) {
            // Tıklanan pozisyondaki kartı API'den dönen kartla değiştir
            setCards(prev => {
              const newCards = [...prev];
              // Eğer çekilen kart zaten grid'de varsa, önce onu kaldır (duplicate önlemek için)
              const existingIndex = newCards.indexOf(drawnCardNumber);
              if (
                existingIndex !== -1 &&
                existingIndex !== firstOccurrenceIndex
              ) {
                newCards.splice(existingIndex, 1);
                // Index değişti, yeniden hesapla
                const newFirstOccurrenceIndex = newCards.indexOf(cardNumber);
                if (newFirstOccurrenceIndex !== -1) {
                  newCards[newFirstOccurrenceIndex] = drawnCardNumber;
                }
              } else {
                newCards[firstOccurrenceIndex] = drawnCardNumber;
              }
              return newCards;
            });

            // Tıklanan pozisyondaki kartı açık olarak işaretle
            setFlippedCards(prev => new Set(prev).add(drawnCardNumber));
          } else {
            // Eğer tıklanan kart grid'de bulunamazsa
            setFlippedCards(prev => new Set(prev).add(drawnCardNumber));

            // Eğer çekilen kart grid'de yoksa, grid'e ekle
            if (!cards.includes(drawnCardNumber)) {
              setCards(prev => {
                const newCards = [...prev];
                const randomIndex = Math.floor(Math.random() * newCards.length);
                newCards.splice(randomIndex, 0, drawnCardNumber);
                return newCards;
              });
            }
          }

          setRemainingCards(data.remainingCards || null);
          // resetCountdown bilgisini güncelle
          if (data.resetCountdown !== undefined) {
            setResetCountdown(data.resetCountdown);
          }
        }
      } catch (err) {
        setError(t('aklindakiKisi.page.errors.cardDrawNetwork'));
      } finally {
        setDrawingCard(false);
      }
    },
    [
      token,
      cards,
      dailyLimitReached,
      drawingCard,
      flippedCards,
      t,
      userTimezone,
    ]
  );

  if (loading) {
    return (
      <div className='min-h-screen bg-[#F7F6F3] text-[#1F2A44] flex flex-col items-center justify-center font-serif'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#C9B26D] mx-auto mb-4'></div>
          <p className='text-lg text-[#4B5563]'>
            {t('aklindakiKisi.page.loading.message')}
          </p>
        </div>
      </div>
    );
  }

  // E-posta girişi ekranı
  if (requiresEmail) {
    return (
      <div className='min-h-screen bg-[#F7F6F3] text-[#1F2A44] flex flex-col items-center justify-center font-serif px-6'>
        <div className='max-w-md w-full bg-[#FDFBF8] rounded-2xl shadow-lg p-8 border border-[#D9CBA1]'>
          <div className='text-center mb-8'>
            <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500/20 to-rose-600/20 rounded-full mb-4'>
              <Mail className='h-8 w-8 text-pink-500' />
            </div>
            <h1 className='text-3xl font-bold mb-2 tracking-wide text-[#1F2A44]'>
              {t('aklindakiKisi.page.email.title')}
            </h1>
            <p className='text-[#4B5563] leading-relaxed'>
              {t('aklindakiKisi.page.email.description')}
            </p>
          </div>

          <form onSubmit={handleEmailSubmit} className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-[#1F2A44] mb-2'
              >
                {t('aklindakiKisi.page.email.label')}
              </label>
              <div className='relative'>
                <Mail className='absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#6B7280]' />
                <input
                  id='email'
                  type='email'
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setEmailError(null);
                  }}
                  placeholder={t('aklindakiKisi.page.email.placeholder')}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all ${
                    emailError
                      ? 'border-red-300 bg-red-50'
                      : 'border-[#D9CBA1] bg-white'
                  }`}
                  disabled={validatingEmail}
                  autoFocus
                />
              </div>
              {emailError && (
                <div className='mt-2'>
                  <p className='text-sm text-red-600'>{emailError}</p>
                </div>
              )}
            </div>

            <button
              type='submit'
              disabled={validatingEmail || !email.trim()}
              className='w-full bg-gradient-to-r from-pink-500 to-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2'
            >
              {validatingEmail ? (
                <>
                  <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                  {t('aklindakiKisi.page.email.actions.validating')}
                </>
              ) : (
                <>
                  {t('aklindakiKisi.page.email.actions.continue')}
                  <ArrowRight className='h-5 w-5' />
                </>
              )}
            </button>
          </form>

          <p className='mt-6 text-xs text-center text-[#6B7280]'>
            {t('aklindakiKisi.page.email.footer')}
          </p>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className='min-h-screen bg-[#F7F6F3] text-[#1F2A44] flex flex-col items-center justify-center font-serif px-6'>
        <div className='text-center max-w-2xl'>
          <h1 className='text-4xl font-bold mb-4 tracking-wide text-[#C9B26D]'>
            {t('aklindakiKisi.page.invalid.title')}
          </h1>
          <p className='text-lg text-[#4B5563] leading-relaxed'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-[#F7F6F3] text-[#1F2A44] flex flex-col items-center font-serif'>
      {/* Hero Section */}
      <section className='text-center mt-16 mb-12 px-6'>
        <h1 className='text-4xl font-bold mb-4 tracking-wide'>
          {t('aklindakiKisi.page.hero.title')}
        </h1>
        <p className='text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed'>
          {t('aklindakiKisi.page.hero.subtitle')}
        </p>
        <p className='mt-4 text-sm italic text-[#6B7280]'>
          {t('aklindakiKisi.page.hero.caption')}
        </p>
        <div className='mt-6'>
          <button
            onClick={handleShuffle}
            disabled={isShuffling || drawingCard}
            className='bg-[#C9B26D] hover:bg-[#B8A056] disabled:bg-[#D9CBA1] disabled:cursor-not-allowed text-white px-8 py-3 rounded-full font-medium transition-all'
          >
            {isShuffling
              ? t('aklindakiKisi.page.hero.shuffleLoading')
              : t('aklindakiKisi.page.hero.shuffle')}
          </button>
        </div>
      </section>

      {/* Stats Bar */}
      <div className='w-full max-w-7xl px-6 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4'>
        {/* Sol: Açılan kartlar */}
        <div className='text-sm text-[#6B7280]'>
          {t('aklindakiKisi.page.stats.openedCards')}:{' '}
          <span className='font-semibold text-[#1F2A44]'>
            {flippedCards.size}
          </span>{' '}
          / 44
        </div>

        {/* Sağ: Kalan kart hakkı */}
        <div className='text-sm text-[#6B7280]'>
          {t('aklindakiKisi.page.stats.remainingCards')}:{' '}
          <span className='font-semibold text-[#1F2A44]'>
            {remainingCards === null
              ? t('aklindakiKisi.page.stats.unlimited')
              : (remainingCards ?? 3)}
          </span>
        </div>
      </div>

      {/* Bilgilendirme Mesajı - Günde 3 kart */}
      <div className='w-full max-w-7xl px-6 mb-3'>
        <div className='bg-gradient-to-r from-[#C9B26D]/10 via-[#D9CBA1]/10 to-[#C9B26D]/10 border border-[#D9CBA1]/30 rounded-lg px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 shadow-sm'>
          <div className='flex-shrink-0'>
            <div className='bg-gradient-to-br from-[#C9B26D]/20 to-[#B8A056]/20 rounded-full p-1.5 sm:p-2'>
              <Info className='h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#C9B26D]' />
            </div>
          </div>
          <p className='text-xs sm:text-sm text-[#ffffff] leading-relaxed flex-1'>
            <span className='font-medium text-[#4cb1a2]'>
              {t('aklindakiKisi.page.info.dailyLimit.title', 'Günde 3 kart')}
            </span>{' '}
            {t(
              'aklindakiKisi.page.info.dailyLimit.message',
              'çekebilirsiniz. Her gün yeni bir şans sizi bekliyor ✨'
            )}
          </p>
        </div>
      </div>

      {/* Sıfırlanma Countdown - Küçük detay olarak göster */}
      {resetCountdown !== null && resetCountdown > 0 && (
        <div className='w-full max-w-7xl px-6 mb-4'>
          <div className='flex items-center justify-center gap-1 text-xs text-[#6B7280]'>
            <Clock className='h-3 w-3 text-[#9CA3AF]' />
            <span>
              {t('aklindakiKisi.page.countdown.label')}{' '}
              <span className='font-medium text-[#4B5563]'>
                {formatCountdown(resetCountdown)}
              </span>
            </span>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className='mb-6 px-6 max-w-2xl w-full'>
          <div className='bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg'>
            <p className='font-medium mb-1'>{error}</p>
          </div>
        </div>
      )}

      {/* Card Grid */}
      <section className='grid grid-cols-5 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 mb-16 w-full'>
        {cards.length === 0 && (
          <div className='col-span-full text-center text-[#6B7280] py-8'>
            {t('aklindakiKisi.page.cardGrid.loading')}
          </div>
        )}
        {cards.map((cardNumber, index) => {
          const isFlipped = flippedCards.has(cardNumber);
          const isDisabled =
            !token || drawingCard || dailyLimitReached || isFlipped;

          const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();

            // Açık kartlara tıklama (mobilde tam ekran için)
            if (isFlipped) {
              setFullscreenCard(cardNumber);
              return;
            }

            // Kapalı kartlar veya disabled kartlar
            if (isDisabled) {
              return;
            }

            handleCardClick(cardNumber);
          };

          return (
            <div
              key={`${cardNumber}-${index}`}
              className={`w-full aspect-[9/16] transition-all duration-300 ${
                isDisabled && !isFlipped
                  ? 'opacity-50 cursor-not-allowed'
                  : isFlipped
                    ? 'cursor-pointer'
                    : 'cursor-pointer hover:scale-105'
              }`}
              onClick={handleClick}
              style={{
                pointerEvents: isDisabled && !isFlipped ? 'none' : 'auto',
              }}
            >
              <div className='w-full h-full bg-[#FDFBF8] border border-[#D9CBA1] rounded-xl shadow-sm relative overflow-hidden'>
                {isFlipped ? (
                  <Image
                    src={getCardImagePath(cardNumber)}
                    alt={t('aklindakiKisi.page.card.alt', {
                      number: cardNumber,
                    })}
                    fill
                    className='object-cover'
                    priority={false}
                    sizes='(max-width: 640px) 128px, (max-width: 768px) 160px, 192px'
                  />
                ) : (
                  <Image
                    src={getBackImagePath()}
                    alt={t('aklindakiKisi.page.card.backAlt')}
                    fill
                    className='object-cover'
                    priority={false}
                    sizes='(max-width: 640px) 128px, (max-width: 768px) 160px, 192px'
                  />
                )}
              </div>
            </div>
          );
        })}
      </section>

      {/* Fullscreen Modal - Desktop ve mobilde açık kartları tam ekran göster */}
      {fullscreenCard && (
        <div
          className='fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4'
          onClick={() => setFullscreenCard(null)}
        >
          <div
            className='relative w-full h-full max-w-md md:max-w-2xl lg:max-w-3xl max-h-[90vh] flex flex-col items-center justify-center'
            onClick={e => e.stopPropagation()}
          >
            {/* Kapatma butonu */}
            <button
              onClick={() => setFullscreenCard(null)}
              className='absolute top-3 right-3 sm:top-4 sm:right-4 z-50 flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-full bg-slate-900/85 border border-white/40 ring-2 ring-[#f5e9d7] shadow-[0_10px_28px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all hover:bg-slate-900 active:scale-95'
              aria-label={t('aklindakiKisi.page.fullscreen.closeAria')}
            >
              <X className='h-5 w-5 sm:h-6 sm:w-6 text-[#f5e9d7]' />
            </button>

            {/* Kart görseli - Desktop'ta daha büyük */}
            <div className='relative w-full aspect-[9/16] max-h-[85vh]'>
              <Image
                src={getCardImagePath(fullscreenCard)}
                alt={t('aklindakiKisi.page.card.alt', {
                  number: fullscreenCard,
                })}
                fill
                className='object-contain'
                priority={true}
                sizes='100vw'
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer / Ritual Text */}
      <footer className='text-center text-[#4B5563] mb-12 max-w-2xl px-6 leading-relaxed'>
        <p>{t('aklindakiKisi.page.footer.note')}</p>
      </footer>
    </div>
  );
}
