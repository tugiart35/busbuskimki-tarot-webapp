'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useAuth } from '@/hooks/auth/useAuth';
import BaseTarotModal from '@/features/tarot/shared/ui/BaseTarotModal';
import { TarotTheme } from '@/features/tarot/shared/types/tarot-modal.types';
import {
  getReferralInfo,
  type ReferralInfo,
} from '@/lib/referral/referral-service';
// Ad Watch özelliği deaktif - gelecekte kullanılabilir
// import { earnCreditFromAd } from '@/lib/credits/earn-credits-service';
// import AdSenseAd from '@/components/ads/AdSenseAd';
// import { hasAdSenseConsent } from '@/lib/adsense/adsense-manager';

interface EarnCreditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreditEarned: () => void;
  theme?: TarotTheme;
}

// Ad Watch özelliği deaktif - sadece Referral sekmesi aktif
// type TabType = 'referral' | 'ad';

export default function EarnCreditModal({
  isOpen,
  onClose,
  onCreditEarned: _onCreditEarned,
  theme = 'purple',
}: EarnCreditModalProps) {
  const { t } = useTranslations();
  const { user } = useAuth();
  const [referralInfo, setReferralInfo] = useState<ReferralInfo | null>(null);
  const [loadingReferral, setLoadingReferral] = useState(false);
  const [referralError, setReferralError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  // Ad Watch özelliği deaktif - gelecekte kullanılabilir
  // const [adLoaded, setAdLoaded] = useState(false);
  // const [watchTime, setWatchTime] = useState(30);
  // const [isWatching, setIsWatching] = useState(false);
  // const [adError, setAdError] = useState(false);
  // const [earningCredit, setEarningCredit] = useState(false);
  // const timerRef = useRef<NodeJS.Timeout | null>(null);
  // const adContainerRef = useRef<HTMLDivElement>(null);

  // Load referral info function - defined before useEffect
  const loadReferralInfo = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoadingReferral(true);
    setReferralError(null);
    try {
      const info = await getReferralInfo(user.id);
      if (!info) {
        setReferralError(
          t('earnCredit.modal.referral.copyError', {
            defaultValue:
              'Referral bilgisi yüklenemedi. Lütfen tekrar deneyin.',
          })
        );
      } else {
        setReferralInfo(info);
      }
    } catch (error) {
      setReferralError(
        t('earnCredit.modal.referral.copyError', {
          defaultValue: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        })
      );
    } finally {
      setLoadingReferral(false);
    }
  }, [user, t]);

  // Load referral info when modal opens and user is available
  useEffect(() => {
    if (isOpen && user) {
      loadReferralInfo();
    }
  }, [isOpen, user, loadReferralInfo]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCopied(false);
      setReferralError(null);
      // Ad Watch özelliği deaktif - gelecekte kullanılabilir
      // setAdLoaded(false);
      // setWatchTime(30);
      // setIsWatching(false);
      // setAdError(false);
      // setEarningCredit(false);
      // if (timerRef.current) {
      //   clearInterval(timerRef.current);
      //   timerRef.current = null;
      // }
    }
  }, [isOpen]);

  const handleCopyLink = async () => {
    if (!referralInfo) {
      return;
    }
    try {
      await navigator.clipboard.writeText(referralInfo.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {}
  };

  const handleShareLink = async () => {
    if (!referralInfo) {
      return;
    }
    try {
      if (navigator.share) {
        await navigator.share({
          title: t('earnCredit.modal.referral.title'),
          text: t('earnCredit.modal.referral.description'),
          url: referralInfo.referralLink,
        });
      } else {
        // Fallback to copy
        handleCopyLink();
      }
    } catch (error) {
      // User cancelled or error - ignore
    }
  };

  // Ad Watch özelliği deaktif - gelecekte kullanılabilir
  // // Handle ad watch timer
  // useEffect(() => {
  //   if (activeTab === 'ad' && adLoaded && !isWatching && hasAdSenseConsent() && !earningCredit) {
  //     // Start watching when ad is loaded - wait 2 seconds for ad to render
  //     const startTimer = setTimeout(() => {
  //       setIsWatching(true);
  //       setWatchTime(30);

  //       timerRef.current = setInterval(() => {
  //         setWatchTime(prev => {
  //           if (prev <= 1) {
  //             // Timer completed, earn credit
  //             if (timerRef.current) {
  //               clearInterval(timerRef.current);
  //               timerRef.current = null;
  //             }
  //             handleEarnCreditFromAd();
  //             return 0;
  //           }
  //           return prev - 1;
  //         });
  //       }, 1000);
  //     }, 2000);

  //     return () => {
  //       clearTimeout(startTimer);
  //       if (timerRef.current) {
  //         clearInterval(timerRef.current);
  //         timerRef.current = null;
  //       }
  //     };
  //   }

  //   return () => {
  //     if (timerRef.current) {
  //       clearInterval(timerRef.current);
  //       timerRef.current = null;
  //     }
  //   };
  // }, [activeTab, adLoaded, isWatching, earningCredit]);

  // const handleEarnCreditFromAd = async () => {
  //   if (!user || earningCredit) return;
  //   setEarningCredit(true);
  //   try {
  //     const result = await earnCreditFromAd(user.id);
  //     if (result.success) {
  //       // Credit earned successfully
  //       setTimeout(() => {
  //         onCreditEarned();
  //         onClose();
  //       }, 1000);
  //     } else {
  //       setAdError(true);
  //       setEarningCredit(false);
  //     }
  //   } catch (error) {
  //     console.error('Error earning credit from ad:', error);
  //     setAdError(true);
  //     setEarningCredit(false);
  //   }
  // };

  // // Monitor ad container for ad loading
  // useEffect(() => {
  //   if (activeTab === 'ad' && adContainerRef.current && hasAdSenseConsent()) {
  //     // Check if ad is loaded by observing the container
  //     const observer = new MutationObserver(() => {
  //       const adElement = adContainerRef.current?.querySelector('.adsbygoogle');
  //       if (adElement && !adLoaded) {
  //         // Ad element exists, consider it loaded after a delay
  //         setTimeout(() => {
  //           setAdLoaded(true);
  //           setAdError(false);
  //         }, 1000);
  //       }
  //     });

  //     observer.observe(adContainerRef.current, {
  //       childList: true,
  //       subtree: true,
  //     });

  //     // Also check immediately
  //     const adElement = adContainerRef.current?.querySelector('.adsbygoogle');
  //     if (adElement) {
  //       setTimeout(() => {
  //         setAdLoaded(true);
  //         setAdError(false);
  //       }, 1000);
  //     }

  //     // Timeout for ad loading error
  //     const errorTimeout = setTimeout(() => {
  //       if (!adLoaded) {
  //         setAdError(true);
  //       }
  //     }, 10000);

  //     return () => {
  //       observer.disconnect();
  //       clearTimeout(errorTimeout);
  //     };
  //   }
  //   return undefined;
  // }, [activeTab, adLoaded]);

  // Tab navigation kaldırıldı - sadece Referral sekmesi aktif
  // const themeClasses = {
  //   referral: {
  //     button: `px-4 py-2 rounded-lg font-semibold transition-colors ${
  //       activeTab === 'referral'
  //         ? 'bg-purple-600 text-white'
  //         : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
  //     }`,
  //   },
  //   ad: {
  //     button: `px-4 py-2 rounded-lg font-semibold transition-colors ${
  //       activeTab === 'ad'
  //         ? 'bg-purple-600 text-white'
  //         : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
  //     }`,
  //   },
  // };

  return (
    <BaseTarotModal
      isOpen={isOpen}
      onClose={onClose}
      theme={theme}
      icon='💳'
      titleKey='earnCredit.modal.title'
      maxWidth='lg'
    >
      <div className='flex flex-col space-y-4'>
        {/* Description */}
        <p className='text-gray-300 text-sm'>
          {t('earnCredit.modal.description')}
        </p>

        {/* Tab navigation kaldırıldı - sadece Referral sekmesi aktif */}
        {/* <div className='flex gap-2 border-b border-slate-700'>
          <button
            type='button'
            onClick={() => setActiveTab('referral')}
            className={themeClasses.referral.button}
          >
            {t('earnCredit.modal.referral.title')}
          </button>
          <button
            type='button'
            onClick={() => setActiveTab('ad')}
            className={themeClasses.ad.button}
          >
            {t('earnCredit.modal.ad.title')}
          </button>
        </div> */}

        {/* Referral Content - Artık tek sekme */}
        <div className='space-y-4'>
          <div>
            <h3 className='text-purple-300 font-semibold mb-2'>
              {t('earnCredit.modal.referral.title')}
            </h3>
            <p className='text-gray-400 text-sm mb-4'>
              {t('earnCredit.modal.referral.description')}
            </p>
          </div>

          {loadingReferral ? (
            <div className='flex items-center justify-center py-8'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500'></div>
            </div>
          ) : referralInfo ? (
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-300 mb-2'>
                  {t('earnCredit.modal.referral.linkLabel')}
                </label>
                <div className='flex gap-2'>
                  <input
                    type='text'
                    readOnly
                    value={referralInfo.referralLink}
                    className='flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-gray-300 text-sm'
                  />
                  <button
                    type='button'
                    onClick={handleCopyLink}
                    className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors'
                  >
                    {copied
                      ? t('earnCredit.modal.referral.copied')
                      : t('earnCredit.modal.referral.copyButton')}
                  </button>
                  {'share' in navigator &&
                    typeof navigator.share === 'function' && (
                      <button
                        type='button'
                        onClick={handleShareLink}
                        className='px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors'
                      >
                        {t('earnCredit.modal.referral.shareButton')}
                      </button>
                    )}
                </div>
              </div>

              <div className='bg-slate-800/50 border border-slate-700 rounded-lg p-4'>
                <h4 className='text-purple-300 font-semibold mb-2'>
                  {t('earnCredit.modal.referral.howItWorks')}
                </h4>
                <p className='text-gray-400 text-sm'>
                  {t('earnCredit.modal.referral.howItWorksText')}
                </p>
              </div>
            </div>
          ) : referralError ? (
            <div className='text-center py-8'>
              <p className='text-red-400 mb-4'>{referralError}</p>
              <button
                type='button'
                onClick={loadReferralInfo}
                className='px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors'
              >
                Tekrar Dene
              </button>
            </div>
          ) : (
            <div className='text-center py-8 text-gray-400'>
              Referral bilgisi yüklenemedi.
            </div>
          )}
        </div>

        {/* Ad Watch Tab Content - DEAKTİF EDİLDİ */}
        {/* {activeTab === 'ad' && (
          <div className='space-y-4'>
            <div>
              <h3 className='text-purple-300 font-semibold mb-2'>
                {t('earnCredit.modal.ad.title')}
              </h3>
              <p className='text-gray-400 text-sm mb-4'>
                {t('earnCredit.modal.ad.description')}
              </p>
            </div>

            {!hasAdSenseConsent() ? (
              <div className='bg-slate-800/50 border border-slate-700 rounded-lg p-6 text-center'>
                <p className='text-gray-400 text-sm'>
                  {t('earnCredit.modal.ad.noConsent')}
                </p>
              </div>
            ) : (
              <div className='space-y-4'>
                <div
                  ref={adContainerRef}
                  className='bg-slate-800/50 border border-slate-700 rounded-lg p-4 min-h-[250px] flex items-center justify-center'
                >
                  {process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true' ? (
                    <>
                      {!adLoaded && !adError && (
                        <div className='text-center'>
                          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2'></div>
                          <p className='text-gray-400 text-sm'>
                            {t('earnCredit.modal.ad.watching')}
                          </p>
                        </div>
                      )}
                      <AdSenseAd
                        slot={process.env.NEXT_PUBLIC_ADSENSE_CREDIT_SLOT || '4872873137'}
                        format='rectangle'
                        responsive={true}
                        className='w-full'
                      />
                    </>
                  ) : (
                    <div className='text-center p-4'>
                      <p className='text-gray-400 text-sm'>
                        {t('earnCredit.modal.ad.description')}
                      </p>
                    </div>
                  )}
                </div>

                {isWatching && watchTime > 0 && (
                  <div className='text-center'>
                    <p className='text-purple-300 font-semibold mb-2'>
                      {t('earnCredit.modal.ad.watching')}
                    </p>
                    <p className='text-gray-400 text-sm'>
                      {t('earnCredit.modal.ad.watchTime', {
                        seconds: watchTime,
                      })}
                    </p>
                    <div className='mt-4 w-full bg-slate-700 rounded-full h-2'>
                      <div
                        className='bg-purple-600 h-2 rounded-full transition-all duration-1000'
                        style={{
                          width: `${((30 - watchTime) / 30) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                )}

                {earningCredit && (
                  <div className='text-center py-4'>
                    <p className='text-green-400 font-semibold'>
                      {t('earnCredit.modal.ad.success')}
                    </p>
                  </div>
                )}

                {adError && (
                  <div className='bg-red-900/20 border border-red-700 rounded-lg p-4 text-center'>
                    <p className='text-red-400 text-sm'>
                      {t('earnCredit.modal.ad.error')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )} */}
      </div>
    </BaseTarotModal>
  );
}
