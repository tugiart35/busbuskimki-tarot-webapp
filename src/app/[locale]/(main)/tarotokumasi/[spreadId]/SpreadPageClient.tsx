'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BottomNavigation } from '@/features/shared/layout';
import {
  useTarotDeck,
  type TarotCard,
} from '@/features/tarot/lib/full-tarot-deck';
import { tarotSpreads } from '@/lib/constants/tarotSpreads';
import { LastReadingSummary } from '@/features/tarot/components';
import { useTranslations } from '@/hooks/useTranslations';
import Image from 'next/image';
import BaseInterpretation from '@/features/shared/ui/BaseInterpretation';
import {
  createLoveConfig,
  createCareerConfig,
  createMoneyConfig,
  createProblemSolvingConfig,
  createMarriageConfig,
  createNewLoverConfig,
  createRelationshipAnalysisConfig,
  createRelationshipProblemsConfig,
  createSituationAnalysisConfig,
} from '@/features/tarot/shared/config';
import { getI18nMeaningByCardAndPosition } from '@/features/tarot/lib/love/position-meanings-index';
import { getI18nCareerMeaningByCardAndPosition } from '@/features/tarot/lib/career/position-meanings-index';
import { getI18nMoneyMeaningByCardAndPosition } from '@/features/tarot/lib/money/position-meanings-index';
import { getI18nProblemSolvingMeaningByCardAndPosition } from '@/features/tarot/lib/problem-solving/position-meanings-index';
import { getI18nMarriageMeaningByCardAndPosition } from '@/features/tarot/lib/marriage/position-meanings-index';
import { getI18nNewLoverMeaningByCardAndPosition } from '@/features/tarot/lib/new-lover/position-meanings-index';
import { getI18nRelationshipAnalysisMeaningByCardAndPosition } from '@/features/tarot/lib/relationship-analysis/position-meanings-index';
import { getI18nRelationshipProblemsMeaningByCardAndPosition } from '@/features/tarot/lib/relationship-problems/position-meanings-index';
import { getI18nSituationAnalysisMeaningByCardAndPosition } from '@/features/tarot/lib/situation-analysis/position-meanings-index';
import type { CardMeaningData } from '@/types/ui';

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
  const fullTarotDeck = useTarotDeck();

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
          setTokenError(data.error || t('tarot.page.tokenValidationError'));
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

        // Token geçerli ve henüz tamamlanmamış, reading type'ı ayarla
        if (data.readingType === 'detailed' || data.readingType === 'written') {
          setInitialReadingType(data.readingType);
        }

        // Spread ID kontrolü (eğer token'daki spreadKey farklıysa uyar)
        if (data.spreadKey && data.spreadKey !== spreadId) {
          // Token'daki spread key mevcut spread ID ile eşleşmiyor
        }

        setTokenValidating(false);
      } catch (error) {
        // Token doğrulama hatası
        setTokenError(t('tarot.page.tokenValidationFailed'));
        setTokenValidating(false);
      }
    };

    validateToken();

    // Polling: Sadece token geçerli ve henüz tamamlanmamışsa çalış
    // Eğer completed ise polling'e gerek yok
    const pollInterval = setInterval(async () => {
      if (!token) {
        clearInterval(pollInterval);
        return;
      }

      // Eğer zaten completed reading gösteriliyorsa polling'i durdur
      if (tokenErrorDetails?.status === 'completed') {
        clearInterval(pollInterval);
        return;
      }

      try {
        const response = await fetch(
          `/api/reading-sessions/validate?token=${token}`
        );
        const data = await response.json();

        // Eğer session completed olduysa sayfayı yenile
        if (!response.ok && data.status === 'completed') {
          clearInterval(pollInterval);
          // Sayfayı yenile - completed reading gösterilecek
          window.location.reload();
        }
      } catch {
        // Polling hatası - sessizce devam et
      }
    }, 2000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [token, spreadId, tokenErrorDetails?.status, t]);

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
        .catch(() => {
          // Reading fetch error
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
              {t('tarot.page.validatingToken')}
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
                {t('tarot.page.loadingReading')}
              </p>
            </div>
          </main>
        </div>
      );
    }

    // Tamamlanmış okuma ve kartlar varsa göster
    if (isCompleted && completedReading) {
      // Kartları parse et (JSONB formatından)
      let rawCards: any[] = [];

      if (completedReading.cards) {
        if (Array.isArray(completedReading.cards)) {
          rawCards = completedReading.cards;
        } else if (completedReading.cards.selectedCards) {
          rawCards = completedReading.cards.selectedCards;
        } else if (completedReading.cards.cards) {
          rawCards = completedReading.cards.cards;
        }
      }

      // Full tarot deck'ten kart bilgilerini al
      const deckById = new Map<number, TarotCard>();
      fullTarotDeck.forEach(card => {
        deckById.set(card.id, card);
      });

      const deckByName = new Map<string, TarotCard>();
      fullTarotDeck.forEach(card => {
        deckByName.set(card.name.toLowerCase(), card);
        deckByName.set(card.nameTr.toLowerCase(), card);
      });

      // Raw kartları full kart bilgileriyle eşleştir
      const cards: (TarotCard & { isReversed: boolean })[] = rawCards
        .map((rawCard: any) => {
          // ID ile bul
          if (rawCard.id !== undefined && deckById.has(rawCard.id)) {
            return {
              ...deckById.get(rawCard.id)!,
              isReversed: rawCard.isReversed || false,
            };
          }
          // İsim ile bul
          if (rawCard.name) {
            const byName = deckByName.get(rawCard.name.toLowerCase());
            if (byName) {
              return { ...byName, isReversed: rawCard.isReversed || false };
            }
          }
          if (rawCard.nameTr) {
            const byNameTr = deckByName.get(rawCard.nameTr.toLowerCase());
            if (byNameTr) {
              return { ...byNameTr, isReversed: rawCard.isReversed || false };
            }
          }
          return null;
        })
        .filter(
          (card): card is TarotCard & { isReversed: boolean } => card !== null
        );

      // Single card okuması için özel gösterim
      const isSingleCard =
        spreadId === 'single-card-spread' && cards.length === 1;

      // Kart ismini JSON key'ine dönüştür (single card için anlam almak için)
      const getCardKeyFromName = (cardName: string): string => {
        return cardName
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^a-z0-9-]/g, '');
      };

      return (
        <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
          <main className='flex-1 px-4 sm:px-6 py-6 sm:py-8'>
            <div className='max-w-4xl mx-auto'>
              <div className='text-center mb-8'>
                <div className='text-6xl mb-4'>✅</div>
                <h2 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
                  {t('tarot.page.readingCompleted')}
                </h2>
                <p className='text-gray-400 text-sm sm:text-base'>
                  {isSingleCard
                    ? t('tarot.page.readingCompletedSingle')
                    : t('tarot.page.readingCompletedMultiple')}
                </p>
              </div>

              {/* Single card okuması için özel gösterim */}
              {isSingleCard && cards.length > 0 && cards[0] ? (
                <div className='bg-gradient-to-br from-purple-900/50 to-indigo-900/50 rounded-2xl p-6 sm:p-8 border border-purple-700/50 mb-6'>
                  <div className='flex flex-col items-center space-y-6'>
                    {/* Kart Görseli */}
                    <div className='relative'>
                      <Image
                        src={cards[0].image || '/cards/CardBack.webp'}
                        alt={cards[0].nameTr || cards[0].name}
                        width={200}
                        height={350}
                        className={`w-48 sm:w-56 md:w-64 h-auto object-cover rounded-xl border-4 border-purple-500/50 shadow-2xl ${
                          cards[0].isReversed ? 'rotate-180' : ''
                        }`}
                      />
                      {cards[0].isReversed && (
                        <div className='absolute top-2 right-2 bg-red-500/80 text-white px-3 py-1 rounded-full text-xs font-bold'>
                          {t('tarot.page.reversed')}
                        </div>
                      )}
                    </div>

                    {/* Kart İsmi */}
                    <div className='text-center'>
                      <h3 className='text-2xl sm:text-3xl font-bold text-white mb-2'>
                        {cards[0].nameTr || cards[0].name}
                      </h3>
                      <div className='flex items-center justify-center gap-2'>
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                            completedReading.metadata?.readingFormat ===
                            'written'
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}
                        >
                          {completedReading.metadata?.readingFormat ===
                          'written' ? (
                            <>
                              <span>📝</span>
                              <span>{t('tarot.page.written')}</span>
                            </>
                          ) : (
                            <>
                              <span>🎵</span>
                              <span>{t('tarot.page.audio')}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Kart Anlamı */}
                    <div className='w-full bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20'>
                      <div className='space-y-4'>
                        <div className='flex items-center gap-2 mb-4'>
                          <div
                            className={`w-4 h-4 rounded-full shadow-lg ${
                              cards[0].isReversed
                                ? 'bg-gradient-to-r from-red-400 to-orange-400'
                                : 'bg-gradient-to-r from-green-400 to-emerald-400'
                            }`}
                          ></div>
                          <span
                            className={`font-light text-lg tracking-wide ${
                              cards[0].isReversed
                                ? 'text-red-200'
                                : 'text-green-200'
                            }`}
                          >
                            {cards[0].isReversed
                              ? t('tarot.page.reversedMeaning')
                              : t('tarot.page.uprightMeaning')}
                          </span>
                        </div>
                        <div className='text-white text-base leading-relaxed font-light'>
                          {(() => {
                            const cardKey = getCardKeyFromName(cards[0].name);
                            const meaningKey = cards[0].isReversed
                              ? `blog.cards.${cardKey}.meanings.reversed.general`
                              : `blog.cards.${cardKey}.meanings.upright.general`;
                            const meaning = t(meaningKey);

                            // Eğer çeviri bulunamazsa (key dönerse), fallback olarak kartın kendi anlamını kullan
                            if (meaning === meaningKey) {
                              return cards[0].isReversed
                                ? cards[0].meaningTr?.reversed ||
                                    cards[0].meaning?.reversed ||
                                    t('tarot.common.meaningNotFound')
                                : cards[0].meaningTr?.upright ||
                                    cards[0].meaning?.upright ||
                                    t('tarot.common.meaningNotFound');
                            }
                            return meaning;
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : cards.length > 0 ? (
                (() => {
                  // Spread config ve meaning fonksiyonları mapping
                  const spreadConfigs: Record<
                    string,
                    {
                      createConfig: (_t?: (_key: string) => string) => any;
                      getMeaning: (
                        _cardName: string,
                        _position: number,
                        _t: (_key: string) => string
                      ) => any;
                      theme: string;
                      icon: string;
                      namespace: string;
                      badgeColor: string;
                    }
                  > = {
                    'love-spread': {
                      createConfig: createLoveConfig,
                      getMeaning: getI18nMeaningByCardAndPosition,
                      theme: 'pink',
                      icon: '💕',
                      namespace: 'love',
                      badgeColor: 'bg-pink-500/20 text-pink-400',
                    },
                    'career-spread': {
                      createConfig: createCareerConfig,
                      getMeaning: getI18nCareerMeaningByCardAndPosition,
                      theme: 'blue',
                      icon: '💼',
                      namespace: 'career',
                      badgeColor: 'bg-blue-500/20 text-blue-400',
                    },
                    'money-spread': {
                      createConfig: createMoneyConfig,
                      getMeaning: getI18nMoneyMeaningByCardAndPosition,
                      theme: 'green',
                      icon: '💰',
                      namespace: 'money',
                      badgeColor: 'bg-green-500/20 text-green-400',
                    },
                    'problem-solving-spread': {
                      createConfig: createProblemSolvingConfig,
                      getMeaning: getI18nProblemSolvingMeaningByCardAndPosition,
                      theme: 'amber',
                      icon: '🧩',
                      namespace: 'problemSolving',
                      badgeColor: 'bg-amber-500/20 text-amber-400',
                    },
                    'marriage-spread': {
                      createConfig: createMarriageConfig,
                      getMeaning: getI18nMarriageMeaningByCardAndPosition,
                      theme: 'purple',
                      icon: '💍',
                      namespace: 'marriage',
                      badgeColor: 'bg-purple-500/20 text-purple-400',
                    },
                    'new-lover-spread': {
                      createConfig: createNewLoverConfig,
                      getMeaning: getI18nNewLoverMeaningByCardAndPosition,
                      theme: 'pink',
                      icon: '💖',
                      namespace: 'newLover',
                      badgeColor: 'bg-pink-500/20 text-pink-400',
                    },
                    'relationship-analysis-spread': {
                      createConfig: createRelationshipAnalysisConfig,
                      getMeaning:
                        getI18nRelationshipAnalysisMeaningByCardAndPosition,
                      theme: 'blue',
                      icon: '💙',
                      namespace: 'relationshipAnalysis',
                      badgeColor: 'bg-blue-500/20 text-blue-400',
                    },
                    'relationship-problems-spread': {
                      createConfig: createRelationshipProblemsConfig,
                      getMeaning:
                        getI18nRelationshipProblemsMeaningByCardAndPosition,
                      theme: 'pink',
                      icon: '💔',
                      namespace: 'relationshipProblems',
                      badgeColor: 'bg-pink-500/20 text-pink-400',
                    },
                    'relationship-problems': {
                      createConfig: createRelationshipProblemsConfig,
                      getMeaning:
                        getI18nRelationshipProblemsMeaningByCardAndPosition,
                      theme: 'pink',
                      icon: '💔',
                      namespace: 'relationshipProblems',
                      badgeColor: 'bg-pink-500/20 text-pink-400',
                    },
                    'situation-analysis-spread': {
                      createConfig: createSituationAnalysisConfig,
                      getMeaning:
                        getI18nSituationAnalysisMeaningByCardAndPosition,
                      theme: 'purple',
                      icon: '🔮',
                      namespace: 'situationAnalysis',
                      badgeColor: 'bg-purple-500/20 text-purple-400',
                    },
                  };

                  // spreadId'yi normalize et: eğer -spread suffix'i yoksa ekle
                  const normalizedSpreadId = spreadId.endsWith('-spread')
                    ? spreadId
                    : `${spreadId}-spread`;

                  const spreadConfig =
                    spreadConfigs[spreadId] ||
                    spreadConfigs[normalizedSpreadId];

                  // Eğer spread için config varsa BaseInterpretation kullan
                  if (spreadConfig) {
                    const config = spreadConfig.createConfig(t);
                    const isReversedArray = cards.map(
                      card => card.isReversed || false
                    );
                    const cardsArray = cards.map(card => {
                      const {
                        isReversed: _isReversed,
                        ...cardWithoutReversed
                      } = card;
                      void _isReversed;
                      return cardWithoutReversed;
                    });

                    // getCardMeaning fonksiyonu
                    const getCardMeaning = (
                      card: TarotCard
                    ): CardMeaningData | null => {
                      const position =
                        cardsArray.findIndex(c => c.id === card.id) + 1;
                      const meaning = spreadConfig.getMeaning(
                        card.name,
                        position,
                        t
                      );

                      if (!meaning) {
                        return null;
                      }

                      return {
                        upright: meaning.upright,
                        reversed: meaning.reversed,
                        context: meaning.context,
                        keywords: meaning.keywords,
                      };
                    };

                    // getPositionSpecificInterpretation fonksiyonu
                    const getPositionSpecificInterpretation = (
                      card: TarotCard,
                      position: number,
                      isReversed: boolean
                    ) => {
                      const meaning = spreadConfig.getMeaning(
                        card.name,
                        position,
                        t
                      );

                      if (!meaning) {
                        const fallback = t('tarot.common.meaningNotFound');
                        return {
                          interpretation: fallback,
                          context: '',
                          keywords: [],
                        };
                      }

                      return {
                        interpretation: isReversed
                          ? meaning.reversed
                          : meaning.upright,
                        context: meaning.context || '',
                        keywords: meaning.keywords || [],
                      };
                    };

                    // getKeywords fonksiyonu
                    const getKeywords = (
                      _meaning: CardMeaningData | null,
                      card: TarotCard
                    ): string[] => {
                      const position =
                        cardsArray.findIndex(c => c.id === card.id) + 1;
                      const meaning = spreadConfig.getMeaning(
                        card.name,
                        position,
                        t
                      );
                      return meaning?.keywords || [];
                    };

                    return (
                      <BaseInterpretation
                        cards={cardsArray}
                        isReversed={isReversedArray}
                        theme={spreadConfig.theme as any}
                        title={
                          t(
                            `${spreadConfig.namespace}.data.interpretationTitle`
                          ) ||
                          t(`${spreadConfig.namespace}.data.spreadName`) ||
                          t(`spreads.${spreadConfig.namespace}.name`) ||
                          t('tarot.page.tarotInterpretation')
                        }
                        icon={spreadConfig.icon}
                        badgeText={
                          t(`${spreadConfig.namespace}.data.badgeText`) ||
                          spreadConfig.namespace.toUpperCase()
                        }
                        badgeColor={spreadConfig.badgeColor}
                        positionsInfo={config.positionsInfo}
                        getCardMeaning={getCardMeaning}
                        getPositionSpecificInterpretation={
                          getPositionSpecificInterpretation
                        }
                        getKeywords={getKeywords}
                        showContext={true}
                      />
                    );
                  }

                  // Diğer spread'ler için LastReadingSummary kullan
                  return (
                    <LastReadingSummary
                      lastReading={{
                        cards: cards.map(card => {
                          const {
                            isReversed: _isReversed,
                            ...cardWithoutReversed
                          } = card;
                          void _isReversed;
                          return cardWithoutReversed;
                        }),
                        interpretation: completedReading.interpretation || '',
                        spreadId: spreadId,
                        reading_type: completedReading.reading_type,
                        cost_credits: completedReading.cost_credits,
                      }}
                      currentSpreadId={spreadId}
                    />
                  );
                })()
              ) : (
                <div className='admin-glass rounded-2xl p-6 border border-slate-700/50 text-center'>
                  <p className='text-gray-400'>
                    {t('tarot.page.cardInfoNotFound')}
                  </p>
                </div>
              )}

              <div className='mt-6 text-center'>
                <Link
                  href={`/${locale}/tarotokumasi`}
                  className='inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors'
                >
                  {t('tarot.page.viewAllSpreads')}
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
              {isCompleted
                ? t('tarot.page.readingCompleted')
                : t('tarot.page.error')}
            </h2>
            <p className='text-gray-300 text-base sm:text-lg mb-2'>
              {tokenErrorDetails?.message || tokenError}
            </p>
            {isCompleted && (
              <div className='space-y-2'>
                <p className='text-gray-400 text-sm'>
                  {t('tarot.page.readingCompletedSingle')}
                </p>
                {spreadId === 'single-card-spread' && (
                  <p className='text-gray-500 text-xs'>
                    {t('tarot.page.linkNoLongerAvailable')}
                  </p>
                )}
              </div>
            )}
            <Link
              href={`/${locale}/tarotokumasi`}
              className='inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors'
            >
              {t('tarot.page.viewAllSpreads')}
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
              {t('tarot.page.spreadNotFound')}
            </p>
            <Link
              href={`/${locale}/tarotokumasi`}
              className='inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors'
            >
              {t('tarot.page.viewAllSpreads')}
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
                {t('tarot.page.home')}
              </Link>
            </li>
            <li className='text-gray-500'>›</li>
            <li>
              <Link
                href={`/${locale}/tarotokumasi`}
                className='text-purple-400 hover:text-purple-300 transition-colors'
              >
                {t('tarot.page.tarot')}
              </Link>
            </li>
            <li className='text-gray-500'>›</li>
            <li className='text-gray-300 truncate max-w-[150px] sm:max-w-none'>
              {t(currentSpread.name)}
            </li>
          </ol>
        </nav>

        {/* Modern Hero Section - Ana sayfa tarzı gradient */}
        {/* Single card için bu bölüm gösterilmez */}
        {spreadId !== 'single-card-spread' && (
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
                {/* Token okumasında bu bölümü gizle */}
                {!token && (
                  <div className='mt-6 sm:mt-8 p-5 sm:p-6 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl'>
                    <h3 className='text-sm sm:text-lg font-bold text-white mb-4 sm:mb-5 flex items-center gap-2'>
                      <span className='text-xl sm:text-2xl'>🔮</span>
                      {t('tarot.page.whatYouWillDiscover')}
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
                          + {currentSpread.positions.length - 4}{' '}
                          {t('tarot.page.morePositionsToDiscover')}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

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
                  {t('tarot.page.relatedSpreads')}
                </h2>
                <Link
                  href={`/${locale}/tarotokumasi`}
                  className='inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group'
                >
                  {t('tarot.page.viewAll')}
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
                              {spread.cardCount} {t('tarot.page.card')}
                            </p>
                          </div>
                        </div>

                        <p className='text-xs sm:text-sm text-gray-400 line-clamp-2 mb-4'>
                          {t(spread.description)}
                        </p>

                        <div className='flex items-center gap-2 text-purple-400 text-xs sm:text-sm font-semibold'>
                          {t('tarot.page.startReading')}
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
                  {t('tarot.page.allTarotSpreads')}
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
  const { t } = useTranslations();

  return (
    <Suspense
      fallback={
        <div className='flex flex-col min-h-screen pb-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'>
          <main className='flex-1 px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-center'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-purple-500 mx-auto mb-4'></div>
              <p className='text-gray-300 text-base sm:text-lg'>
                {t('tarot.page.loading')}
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
