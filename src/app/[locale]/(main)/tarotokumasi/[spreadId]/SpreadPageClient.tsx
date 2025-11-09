'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BottomNavigation } from '@/features/shared/layout';
import { TarotCard } from '@/features/tarot/lib/full-tarot-deck';
import { tarotSpreads } from '@/lib/constants/tarotSpreads';
import { LastReadingSummary } from '@/features/tarot/components';
import { useTranslations } from '@/hooks/useTranslations';

// Token'i almak için wrapper component
function SpreadPageContent({
  locale,
  spreadId,
}: {
  locale: string;
  spreadId: string;
}) {
  const { t } = useTranslations();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [lastReading, setLastReading] = useState<{
    cards: TarotCard[];
    interpretation: string;
    spreadId: string;
  } | null>(null);

  const [initialReadingType, setInitialReadingType] = useState<
    'detailed' | 'written' | null
  >(null);
  const [tokenValidating, setTokenValidating] = useState(!!token);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [tokenErrorDetails, setTokenErrorDetails] = useState<{
    message?: string;
    status?: string;
    readingId?: string;
  } | null>(null);
  const [completedReading, setCompletedReading] = useState<any>(null);
  const [loadingReading, setLoadingReading] = useState(false);

  // Token doğrulama
  useEffect(() => {
    if (!token) {
      setTokenValidating(false);
      return;
    }

    const validateToken = async () => {
      try {
        const response = await fetch(
          `/api/reading-sessions/validate?token=${token}`
        );
        const data = await response.json();

        if (!response.ok) {
          setTokenError(data.error || 'Token doğrulanamadı');
          setTokenErrorDetails(
            data.status === 'completed'
              ? {
                  message: data.message,
                  status: data.status,
                  readingId: data.readingId || null,
                }
              : null
          );
          setTokenValidating(false);
          return;
        }

        // Token geçerli, reading type'ı ayarla
        if (data.readingType === 'detailed' || data.readingType === 'written') {
          setInitialReadingType(data.readingType);
        }

        // Spread ID kontrolü (eğer token'daki spreadKey farklıysa uyar)
        if (data.spreadKey && data.spreadKey !== spreadId) {
          console.warn(
            `Token'daki spread key (${data.spreadKey}) mevcut spread ID (${spreadId}) ile eşleşmiyor`
          );
        }

        setTokenValidating(false);
      } catch (error) {
        console.error('Token doğrulama hatası:', error);
        setTokenError('Token doğrulanırken bir hata oluştu');
        setTokenValidating(false);
      }
    };

    validateToken();
  }, [token, spreadId]);

  // Tamamlanmış okuma için reading'i çek
  useEffect(() => {
    if (
      tokenErrorDetails?.status === 'completed' &&
      tokenErrorDetails?.readingId
    ) {
      setLoadingReading(true);
      fetch(`/api/readings/${tokenErrorDetails.readingId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.reading) {
            setCompletedReading(data.reading);
          }
        })
        .catch(err => {
          console.error('Reading fetch error:', err);
        })
        .finally(() => {
          setLoadingReading(false);
        });
    }
  }, [tokenErrorDetails?.status, tokenErrorDetails?.readingId]);

  // Find the spread
  const currentSpread = tarotSpreads.find(s => s.id === spreadId);
  const CurrentComponent = currentSpread?.component;

  // Handle reading completion
  const handleReadingComplete = async (
    cards: TarotCard[],
    interpretation: string
  ) => {
    // Normal akış: lastReading'e kaydet
    setLastReading({
      cards,
      interpretation,
      spreadId: spreadId,
    });
  };

  // onReadingTypeSelected callback'i kaldırıldı - açıklama kapatma mantığı gereksiz

  // Token doğrulama yükleniyor
  if (tokenValidating) {
    return (
      <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <main className='flex-1 px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-center'>
          <div className='text-center'>
            <div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-500 mx-auto mb-4'></div>
            <p className='text-gray-300 text-base sm:text-lg'>
              Okuma linki doğrulanıyor...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // Token hatası
  if (tokenError) {
    const isCompleted = tokenErrorDetails?.status === 'completed';

    // Tamamlanmış okuma ve kartlar yükleniyor
    if (isCompleted && loadingReading) {
      return (
        <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
          <main className='flex-1 px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-center'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-500 mx-auto mb-4'></div>
              <p className='text-gray-300 text-base sm:text-lg'>
                Okuma bilgileri yükleniyor...
              </p>
            </div>
          </main>
        </div>
      );
    }

    // Tamamlanmış okuma ve kartlar varsa göster
    if (isCompleted && completedReading) {
      // Kartları parse et (JSONB formatından)
      let cards: TarotCard[] = [];
      if (completedReading.cards) {
        if (Array.isArray(completedReading.cards)) {
          cards = completedReading.cards;
        } else if (completedReading.cards.selectedCards) {
          cards = completedReading.cards.selectedCards;
        } else if (completedReading.cards.cards) {
          cards = completedReading.cards.cards;
        }
      }

      return (
        <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
          <main className='flex-1 px-4 sm:px-6 py-6 sm:py-8'>
            <div className='max-w-4xl mx-auto'>
              <div className='text-center mb-8'>
                <div className='text-6xl mb-4'>✅</div>
                <h2 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
                  Okuma Tamamlandı
                </h2>
                <p className='text-gray-400 text-sm sm:text-base'>
                  Bu okuma zaten tamamlandı. Çekilen kartlarınız aşağıda.
                </p>
              </div>

              {/* Çekilen kartları göster */}
              {cards.length > 0 ? (
                <LastReadingSummary
                  cards={cards}
                  interpretation={completedReading.interpretation || ''}
                  spreadId={spreadId}
                />
              ) : (
                <div className='admin-glass rounded-2xl p-6 border border-slate-700/50 text-center'>
                  <p className='text-gray-400'>Kart bilgileri bulunamadı.</p>
                </div>
              )}

              <div className='mt-6 text-center'>
                <Link
                  href={`/${locale}/tarotokumasi`}
                  className='inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors'
                >
                  Tüm Açılımları Gör
                </Link>
              </div>
            </div>
          </main>
        </div>
      );
    }

    // Normal hata mesajı (completed değil veya reading yüklenemedi)
    return (
      <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <main className='flex-1 px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-center'>
          <div className='text-center max-w-md'>
            <div className='text-gray-400 mb-4'>
              <span className='text-4xl sm:text-6xl'>
                {isCompleted ? '✅' : '⚠️'}
              </span>
            </div>
            <h2 className='text-xl sm:text-2xl font-bold text-white mb-4'>
              {isCompleted ? 'Okuma Tamamlandı' : 'Hata'}
            </h2>
            <p className='text-gray-300 text-base sm:text-lg mb-2'>
              {tokenErrorDetails?.message || tokenError}
            </p>
            {isCompleted && (
              <p className='text-gray-400 text-sm mb-6'>
                Bu okuma linki artık kullanılamaz. Yeni bir okuma için lütfen
                admin panelinden yeni bir link oluşturun.
              </p>
            )}
            <Link
              href={`/${locale}/tarotokumasi`}
              className='inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors'
            >
              Tüm Açılımları Gör
            </Link>
          </div>
        </main>
      </div>
    );
  }

  if (!currentSpread) {
    return (
      <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
        <main className='flex-1 px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-center'>
          <div className='text-center'>
            <div className='text-gray-400 mb-4'>
              <span className='text-4xl sm:text-6xl'>🔮</span>
            </div>
            <p className='text-gray-300 text-base sm:text-lg mb-4'>
              Açılım bulunamadı
            </p>
            <Link
              href={`/${locale}/tarotokumasi`}
              className='inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors'
            >
              Tüm Açılımları Gör
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
      <main className='flex-1 px-4 sm:px-6 py-6 sm:py-8'>
        {/* Breadcrumb Navigation - SEO + UX */}
        <nav className='max-w-6xl mx-auto mb-6' aria-label='Breadcrumb'>
          <ol className='flex items-center gap-2 text-xs sm:text-sm'>
            <li>
              <Link
                href={`/${locale}`}
                className='text-purple-400 hover:text-purple-300 transition-colors'
              >
                Ana Sayfa
              </Link>
            </li>
            <li className='text-gray-500'>›</li>
            <li>
              <Link
                href={`/${locale}/tarotokumasi`}
                className='text-purple-400 hover:text-purple-300 transition-colors'
              >
                Tarot
              </Link>
            </li>
            <li className='text-gray-500'>›</li>
            <li className='text-gray-300 truncate max-w-[150px] sm:max-w-none'>
              {t(currentSpread.name)}
            </li>
          </ol>
        </nav>

        {/* Modern Hero Section - Ana sayfa tarzı gradient */}
        <div className='max-w-6xl mx-auto mb-8'>
          <div className='relative overflow-hidden rounded-2xl sm:rounded-3xl'>
            {/* Animated gradient background */}
            <div className='absolute inset-0 bg-gradient-to-br from-pink-600/20 via-purple-600/20 to-slate-900/50'></div>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(236,72,153,0.3),transparent_50%)]'></div>
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.2),transparent_50%)]'></div>

            {/* Content */}
            <div className='relative z-10 p-6 sm:p-8 md:p-12'>
              <div className='flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6'>
                <div className='text-5xl sm:text-6xl md:text-8xl animate-float filter drop-shadow-lg'>
                  {currentSpread.icon}
                </div>
                <div className='text-center sm:text-left flex-1'>
                  <h1 className='text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-2 sm:mb-3'>
                    {t(currentSpread.name)}
                  </h1>
                  <p className='text-gray-300 text-sm sm:text-base md:text-xl max-w-2xl'>
                    {t(currentSpread.description)}
                  </p>
                </div>
              </div>

              {/* What You'll Discover - Positions Preview */}
              <div className='mt-6 sm:mt-8 p-5 sm:p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl'>
                <h3 className='text-sm sm:text-lg font-bold text-white mb-4 sm:mb-5 flex items-center gap-2'>
                  <span className='text-xl sm:text-2xl'>🔮</span>
                  Bu Açılımda Keşfedecekleriniz
                </h3>

                <div className='grid sm:grid-cols-2 gap-3 sm:gap-4'>
                  {currentSpread.positions.slice(0, 4).map((pos, idx) => (
                    <div
                      key={pos.id}
                      className='flex items-start gap-3 p-3 sm:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-purple-500/30 transition-all group'
                    >
                      <div className='flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full text-white font-bold text-xs sm:text-sm border border-purple-500/50 group-hover:scale-110 transition-transform'>
                        {idx + 1}
                      </div>
                      <div className='flex-1 min-w-0'>
                        <h4 className='text-xs sm:text-sm font-semibold text-white mb-1 leading-tight group-hover:text-purple-300 transition-colors'>
                          {t(pos.title)}
                        </h4>
                        <p className='text-xs text-gray-400 leading-relaxed line-clamp-2'>
                          {t(pos.description)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {currentSpread.positions.length > 4 && (
                  <div className='mt-4 text-center'>
                    <p className='text-xs text-purple-300 font-medium'>
                      + {currentSpread.positions.length - 4} pozisyon daha
                      keşfedilecek...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Spread component */}
        <div className='max-w-6xl mx-auto mb-8'>
          {CurrentComponent ? (
            <Suspense
              fallback={
                <div className='flex items-center justify-center py-12 sm:py-16'>
                  <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-500 mx-auto mb-4'></div>
                    <span className='text-gray-400 text-sm sm:text-base'>
                      {t('tarot.page.loadingSpread')}
                    </span>
                  </div>
                </div>
              }
            >
              <CurrentComponent
                onComplete={handleReadingComplete}
                initialReadingType={initialReadingType}
                sessionToken={token}
                // onReadingTypeSelected prop'u kaldırıldı - açıklama kapatma mantığı gereksiz
              />
            </Suspense>
          ) : (
            <div className='text-center py-12 sm:py-16'>
              <div className='text-gray-400 mb-4'>
                <span className='text-4xl sm:text-6xl'>🔮</span>
              </div>
              <p className='text-gray-300 text-base sm:text-lg'>
                {t('common.tarot.spread.componentNotAvailable')}
              </p>
            </div>
          )}
        </div>

        {/* Last reading summary */}
        <div className='max-w-6xl mx-auto mb-8'>
          <LastReadingSummary
            lastReading={lastReading}
            currentSpreadId={spreadId}
          />
        </div>

        {/* Related spreads - Token varsa gizle, normal sayfada göster */}
        {!token && (
          <>
            <div className='max-w-6xl mx-auto mt-12 sm:mt-16'>
              <div className='flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8 gap-4'>
                <h2 className='text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent'>
                  İlgili Açılımlar
                </h2>
                <Link
                  href={`/${locale}/tarotokumasi`}
                  className='inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group'
                >
                  Tümünü Gör
                  <svg
                    className='w-4 h-4 group-hover:translate-x-1 transition-transform'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5l7 7-7 7'
                    />
                  </svg>
                </Link>
              </div>

              <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                {tarotSpreads
                  .filter(s => s.id !== spreadId)
                  .slice(0, 3)
                  .map(spread => (
                    <Link
                      key={spread.id}
                      href={`/${locale}/tarotokumasi/${spread.id}`}
                      className='group relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/10 hover:border-white/20 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl'
                    >
                      {/* Gradient overlay on hover */}
                      <div className='absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

                      <div className='relative z-10'>
                        <div className='flex items-center gap-3 mb-4'>
                          <span className='text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg'>
                            {spread.icon}
                          </span>
                          <div className='flex-1'>
                            <h3 className='text-base sm:text-lg font-bold text-white group-hover:text-purple-300 transition-colors leading-tight'>
                              {t(spread.name)}
                            </h3>
                            <p className='text-xs sm:text-sm text-gray-400 mt-1'>
                              {spread.cardCount} Kart
                            </p>
                          </div>
                        </div>

                        <p className='text-xs sm:text-sm text-gray-400 line-clamp-2 mb-4'>
                          {t(spread.description)}
                        </p>

                        <div className='flex items-center gap-2 text-purple-400 text-xs sm:text-sm font-semibold'>
                          Okumaya Başla
                          <svg
                            className='w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform'
                            fill='none'
                            stroke='currentColor'
                            viewBox='0 0 24 24'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M9 5l7 7-7 7'
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Back to all spreads button - Mobile friendly */}
            <div className='max-w-6xl mx-auto mt-12'>
              <Link
                href={`/${locale}/tarotokumasi`}
                className='group w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 backdrop-blur-xl border border-purple-500/30 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-2xl'
              >
                <svg
                  className='w-5 h-5 group-hover:-translate-x-1 transition-transform'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
                <span className='text-white font-semibold text-sm sm:text-base'>
                  Tüm Tarot Açılımları
                </span>
              </Link>
            </div>
          </>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

// Ana component - Suspense wrapper ile useSearchParams için
export default function SpreadPageClient({
  locale,
  spreadId,
}: {
  locale: string;
  spreadId: string;
}) {
  return (
    <Suspense
      fallback={
        <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
          <main className='flex-1 px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-center'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-500 mx-auto mb-4'></div>
              <p className='text-gray-300 text-base sm:text-lg'>
                Yükleniyor...
              </p>
            </div>
          </main>
        </div>
      }
    >
      <SpreadPageContent locale={locale} spreadId={spreadId} />
    </Suspense>
  );
}
