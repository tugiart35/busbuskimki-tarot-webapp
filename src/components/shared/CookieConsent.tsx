'use client';

import React, { useState, useEffect } from 'react';
import { FaCookie, FaTimes, FaCog } from 'react-icons/fa';
import { useTranslations } from '@/hooks/useTranslations';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

const COOKIE_CONSENT_KEY = 'busbuskimki_cookie_consent';
const COOKIE_PREFERENCES_KEY = 'busbuskimki_cookie_preferences';

export default function CookieConsent() {
  const { t } = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      setIsVisible(true);
    } else {
      const savedPreferences = localStorage.getItem(COOKIE_PREFERENCES_KEY);
      if (savedPreferences) {
        setPreferences(JSON.parse(savedPreferences));
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted: CookiePreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
    };
    saveConsent(allAccepted);
  };

  const handleRejectAll = () => {
    const onlyNecessary: CookiePreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
    };
    saveConsent(onlyNecessary);
  };

  const handleSavePreferences = () => {
    saveConsent(preferences);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(prefs));
    setIsVisible(false);
    setShowSettings(false);

    // Trigger analytics based on preferences
    if (prefs.analytics) {
      // Enable analytics
      console.log('Analytics enabled');
    }
    if (prefs.marketing) {
      // Enable marketing cookies
      console.log('Marketing cookies enabled');
    }
  };

  if (!isVisible) return null;

  return (
    <div className='fixed bottom-4 right-4 z-50 max-w-md w-full pointer-events-auto'>
      {/* Cookie Banner */}
      <div className='relative w-full'>
        <div className='bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-purple-800/95 backdrop-blur-xl rounded-2xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 overflow-hidden'>
          {/* Mystical Background Effects */}
          <div className='absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5'></div>
          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500'></div>

          <div className='relative z-10 p-4 sm:p-5'>
            {!showSettings ? (
              // Main Banner
              <div>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-center space-x-2'>
                    <div className='p-2 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-lg backdrop-blur-sm border border-purple-500/30'>
                      <FaCookie className='w-5 h-5 text-purple-300' />
                    </div>
                    <h2 className='text-lg font-bold bg-gradient-to-r from-golden-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent'>
                      {t('cookieConsent.title')}
                    </h2>
                  </div>
                  <button
                    onClick={() => setIsVisible(false)}
                    className='p-1.5 text-gray-400 hover:text-white transition-colors'
                    aria-label={t('cookieConsent.close')}
                  >
                    <FaTimes className='w-4 h-4' />
                  </button>
                </div>

                <p className='text-gray-300 text-sm mb-4 leading-relaxed'>
                  {t('cookieConsent.description')}
                </p>

                <div className='flex flex-col gap-2'>
                  <button
                    onClick={handleAcceptAll}
                    className='w-full px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-semibold rounded-lg transition-all duration-300 shadow-lg shadow-purple-500/30'
                  >
                    {t('cookieConsent.acceptAll')}
                  </button>
                  <div className='flex gap-2'>
                    <button
                      onClick={handleRejectAll}
                      className='flex-1 px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-sm font-semibold rounded-lg transition-all duration-300'
                    >
                      {t('cookieConsent.rejectAll')}
                    </button>
                    <button
                      onClick={() => setShowSettings(true)}
                      className='flex items-center justify-center gap-1.5 px-4 py-2 bg-transparent border border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-purple-200 text-sm font-semibold rounded-lg transition-all duration-300'
                    >
                      <FaCog className='w-3.5 h-3.5' />
                      {t('cookieConsent.settings')}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Settings Panel
              <div>
                <div className='flex items-center justify-between mb-6'>
                  <h2 className='text-2xl font-bold bg-gradient-to-r from-golden-400 via-purple-300 to-indigo-300 bg-clip-text text-transparent'>
                    {t('cookieConsent.settingsTitle')}
                  </h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className='p-2 text-gray-400 hover:text-white transition-colors'
                    aria-label={t('cookieConsent.back')}
                  >
                    <FaTimes className='w-5 h-5' />
                  </button>
                </div>

                <div className='space-y-4 mb-6'>
                  {/* Necessary Cookies */}
                  <div className='p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-blue-300 mb-1'>
                          {t('cookieConsent.necessary')}
                        </h3>
                        <p className='text-sm text-gray-400'>
                          {t('cookieConsent.necessaryDesc')}
                        </p>
                      </div>
                      <div className='ml-4'>
                        <span className='px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-semibold rounded-full'>
                          {t('cookieConsent.required')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className='p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl border border-purple-500/20'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-purple-300 mb-1'>
                          {t('cookieConsent.analytics')}
                        </h3>
                        <p className='text-sm text-gray-400'>
                          {t('cookieConsent.analyticsDesc')}
                        </p>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer ml-4'>
                        <input
                          type='checkbox'
                          checked={preferences.analytics}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              analytics: e.target.checked,
                            })
                          }
                          className='sr-only peer'
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className='p-4 bg-gradient-to-r from-pink-500/10 to-rose-500/10 rounded-xl border border-pink-500/20'>
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold text-pink-300 mb-1'>
                          {t('cookieConsent.marketing')}
                        </h3>
                        <p className='text-sm text-gray-400'>
                          {t('cookieConsent.marketingDesc')}
                        </p>
                      </div>
                      <label className='relative inline-flex items-center cursor-pointer ml-4'>
                        <input
                          type='checkbox'
                          checked={preferences.marketing}
                          onChange={(e) =>
                            setPreferences({
                              ...preferences,
                              marketing: e.target.checked,
                            })
                          }
                          className='sr-only peer'
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className='flex flex-col sm:flex-row gap-3'>
                  <button
                    onClick={handleSavePreferences}
                    className='flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/30'
                  >
                    {t('cookieConsent.savePreferences')}
                  </button>
                  <button
                    onClick={() => setShowSettings(false)}
                    className='px-6 py-3 bg-transparent border-2 border-purple-500/50 hover:border-purple-400 text-purple-300 hover:text-purple-200 font-semibold rounded-xl transition-all duration-300'
                  >
                    {t('cookieConsent.cancel')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
