'use client';

import React, { useCallback, useMemo, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { useCountryDetection } from '@/hooks/useCountryDetection';
import { useConsent } from '@/hooks/useConsent';
import type {
  PersonalInfo,
  PartnerInfo,
  Questions,
  FormErrors,
} from '../hooks/useTarotFormState';
import { TarotConfig } from '../types/tarot-config.types';
import { getThemeClasses } from './theme-utils';
import { QuestionSection } from './QuestionSection';

export interface BaseTarotFormProps {
  config: TarotConfig;
  isOpen: boolean;
  onClose: () => void;
  personalInfo: PersonalInfo;
  partnerInfo?: PartnerInfo;
  communicationMethod: 'email' | 'whatsapp';
  questions: Questions;
  formErrors: FormErrors;
  isSaving: boolean;
  onUpdatePersonalInfo: (
    _field:
      | 'name'
      | 'surname'
      | 'birthDate'
      | 'birthDateUnknown'
      | 'relationshipStatus'
      | 'email'
      | 'phone'
      | 'countryCode',
    _value: string | boolean
  ) => void;
  onUpdatePartnerInfo?: (
    _field: 'name' | 'birthDate' | 'birthDateUnknown',
    _value: string | boolean
  ) => void;
  onUpdateCommunicationMethod: (_method: 'email' | 'whatsapp') => void;
  onUpdateQuestion: (
    _field: 'concern' | 'understanding' | 'emotional',
    _value: string
  ) => void;
  onSaveForm: () => void;
  hasPartner?: boolean; // Single card için partner bilgisi toggle
  onToggleHasPartner?: (_value: boolean) => void; // Single card için partner toggle
  className?: string;
  variant?: 'modal' | 'inline';
  questionLabels?: {
    concern?: string;
    understanding?: string;
    emotional?: string;
  };
}

export default function BaseTarotForm({
  config,
  isOpen,
  onClose,
  personalInfo,
  partnerInfo,
  communicationMethod,
  questions,
  formErrors,
  isSaving,
  onUpdatePersonalInfo,
  onUpdatePartnerInfo,
  onUpdateCommunicationMethod,
  onUpdateQuestion,
  onSaveForm,
  className = '',
  variant = 'modal',
  questionLabels,
  hasPartner = false,
  onToggleHasPartner,
}: BaseTarotFormProps) {
  const { t } = useTranslations();
  const themeClasses = getThemeClasses(config.theme);
  const formKeys = config.i18nKeys.form;
  const { countryInfo, isLoading: countryLoading } = useCountryDetection();
  const isSingleCard =
    config.isSingleCard ||
    config.cardCount === 1 ||
    config.spreadId === 'single-card';

  const partnerInfoSpreads = useMemo(
    () => [
      'love',
      'new-lover',
      'relationship-analysis',
      'relationship-problems',
      'marriage',
    ],
    []
  );

  const shouldShowPartnerSection =
    (config.requiresPartnerInfo ||
      isSingleCard ||
      partnerInfoSpreads.includes(config.spreadId)) &&
    partnerInfo &&
    onUpdatePartnerInfo;

  const shouldShowPartnerToggle =
    (isSingleCard ||
      config.requiresPartnerInfo ||
      partnerInfoSpreads.includes(config.spreadId)) &&
    onToggleHasPartner;

  const partnerToggleLabelKey =
    partnerInfoSpreads.includes(config.spreadId) && config.translationNamespace
      ? `${config.translationNamespace}.form.hasPartner`
      : formKeys.hasPartner || 'spreads.singleCard.form.hasPartner';

  // Otomatik ülke kodu ayarla
  useEffect(() => {
    if (countryInfo && !personalInfo.countryCode) {
      onUpdatePersonalInfo('countryCode', countryInfo.phoneCode);
    }
  }, [countryInfo, personalInfo.countryCode, onUpdatePersonalInfo]);

  const placeholders = useMemo(
    () => formKeys.placeholders ?? {},
    [formKeys.placeholders]
  );

  const translate = useCallback(
    (key: string, fallback?: string) => {
      const result = t(key);
      if (result === key && typeof fallback === 'string') {
        return fallback;
      }
      return result;
    },
    [t]
  );

  const getPlaceholder = useCallback(
    (key?: string) => {
      if (!key) {
        return '';
      }
      const result = t(key);
      return result === key ? '' : result;
    },
    [t]
  );

  const consent = useConsent();
  const consentReady = consent.ready;
  const marketingAllowed =
    consent.preferences.marketing || consent.preferences.advertising;
  const consentBlocked = !consentReady || !marketingAllowed;

  const consentMessage = useMemo(() => {
    if (!consentReady) {
      return translate(
        `${config.translationNamespace}.messages.consentPending`,
        'Lütfen gizlilik tercihini seçin.'
      );
    }

    if (!marketingAllowed) {
      return translate(
        `${config.translationNamespace}.messages.consentRequired`,
        'Devam etmek için pazarlama izni vermelisiniz.'
      );
    }

    return null;
  }, [consentReady, marketingAllowed, translate, config.translationNamespace]);

  const handleClose = useCallback(() => {
    const hasUserInput =
      personalInfo.name ||
      personalInfo.email ||
      personalInfo.phone ||
      (config.requiresPartnerInfo &&
        partnerInfo &&
        (partnerInfo.name ||
          partnerInfo.birthDate ||
          partnerInfo.birthDateUnknown)) ||
      questions.concern ||
      questions.understanding ||
      questions.emotional;

    if (!hasUserInput) {
      onClose();
      return;
    }

    const confirmationMessage = translate(
      `${config.translationNamespace}.messages.formUnsavedWarning`,
      'Form dolduruldu ancak kaydedilmedi. Çıkmak istediğinize emin misiniz?'
    );

    if (window.confirm(confirmationMessage)) {
      onClose();
    }
  }, [
    config.translationNamespace,
    onClose,
    personalInfo,
    partnerInfo,
    questions,
    config.requiresPartnerInfo,
    translate,
  ]);

  if (!isOpen) {
    return null;
  }

  const modalClass =
    variant === 'modal'
      ? 'bg-slate-900/95 border shadow-2xl w-full max-w-sm sm:max-w-md max-h-[82vh] sm:max-h-[90vh]'
      : 'bg-slate-900/70 border w-full';

  const formContent = (
    <div
      className={`${modalClass} ${themeClasses.border} rounded-2xl flex flex-col ${className}`}
    >
      <div
        className={`flex items-center justify-between px-4 py-3 sm:p-6 border-b ${themeClasses.headerBorder} flex-shrink-0`}
      >
        <div className='flex items-center'>
          <div
            className={`w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center ${themeClasses.iconBg} rounded-full mr-3 shadow-lg`}
          >
            <span className={`text-xl ${themeClasses.iconText}`}>
              {config.icon}
            </span>
          </div>
          <h2 className={`${themeClasses.titleText} text-base sm:text-lg font-semibold`}>
            {translate(formKeys.personalInfo)}
          </h2>
        </div>
        <button
          onClick={handleClose}
          className={`text-gray-400 ${themeClasses.buttonHover} transition-colors p-2 rounded-lg hover:text-white`}
          title={translate('common.close', 'Kapat')}
        >
          <svg
            className='w-5 h-5'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      </div>

      <div className='flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4'>
        <div className='space-y-4'>
          <div className='space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0'>
            <div>
              <label
                className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
              >
                {translate(formKeys.firstName)} *
              </label>
              <input
                type='text'
                value={personalInfo.name}
                onChange={event =>
                  onUpdatePersonalInfo('name', event.target.value)
                }
                placeholder={getPlaceholder(placeholders.firstName)}
                className={`w-full px-3 py-2.5 bg-slate-800/80 border ${
                  formErrors.name ? 'border-red-500' : themeClasses.inputBorder
                } rounded-lg text-white placeholder-gray-400 focus:outline-none ${themeClasses.focusRing} transition-all`}
              />
              {formErrors.name && (
                <p className='text-red-400 text-xs mt-1'>{formErrors.name}</p>
              )}
            </div>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
            >
              {translate(formKeys.birthDate)} *
            </label>
            <div className='space-y-2'>
              <input
                type='date'
                value={personalInfo.birthDate}
                onChange={event =>
                  onUpdatePersonalInfo('birthDate', event.target.value)
                }
                disabled={personalInfo.birthDateUnknown}
                className={`w-full px-3 py-2.5 h-11 text-sm appearance-none bg-slate-800/80 border ${
                  formErrors.birthDate
                    ? 'border-red-500'
                    : themeClasses.inputBorder
                } rounded-lg text-white focus:outline-none ${themeClasses.focusRing} transition-all ${
                  personalInfo.birthDateUnknown
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              />
              <div className='flex items-center'>
                <input
                  type='checkbox'
                  id='birthDateUnknown'
                  checked={personalInfo.birthDateUnknown}
                  onChange={event =>
                    onUpdatePersonalInfo(
                      'birthDateUnknown',
                      event.target.checked
                    )
                  }
                  className='w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2'
                />
                <label
                  htmlFor='birthDateUnknown'
                  className={`ml-2 text-sm ${themeClasses.labelText} cursor-pointer`}
                >
                  {translate(formKeys.birthDateUnknown)}
                </label>
              </div>
            </div>
            {formErrors.birthDate && (
              <p className='text-red-400 text-xs mt-1'>
                {formErrors.birthDate}
              </p>
            )}
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
            >
              {translate(formKeys.relationshipStatus)}
            </label>
            <select
              value={personalInfo.relationshipStatus}
              onChange={event =>
                onUpdatePersonalInfo('relationshipStatus', event.target.value)
              }
              className={`w-full px-4 py-3 bg-slate-800/80 border ${
                formErrors.relationshipStatus
                  ? 'border-red-500'
                  : themeClasses.inputBorder
              } rounded-lg text-white focus:outline-none ${themeClasses.focusRing} transition-all`}
            >
              <option value=''>
                {translate(formKeys.selectRelationshipStatus)}
              </option>
              <option value='single'>
                {translate(formKeys.relationshipStatusOptions.single)}
              </option>
              <option value='in_relationship'>
                {translate(formKeys.relationshipStatusOptions.in_relationship)}
              </option>
              <option value='married'>
                {translate(formKeys.relationshipStatusOptions.married)}
              </option>
              <option value='separated'>
                {translate(formKeys.relationshipStatusOptions.separated)}
              </option>
              <option value='divorced'>
                {translate(formKeys.relationshipStatusOptions.divorced)}
              </option>
              <option value='widowed'>
                {translate(formKeys.relationshipStatusOptions.widowed)}
              </option>
              <option value='prefer_not_to_say'>
                {translate(
                  formKeys.relationshipStatusOptions.prefer_not_to_say
                )}
              </option>
            </select>
            {formErrors.relationshipStatus && (
              <p className='text-red-400 text-xs mt-1'>
                {formErrors.relationshipStatus}
              </p>
            )}
          </div>

          {shouldShowPartnerSection && (
            <div
              className={`space-y-4 pt-4 border-t ${themeClasses.sectionBorder}`}
            >
              {shouldShowPartnerToggle && (
                <div className='flex items-center mb-4'>
                  <input
                    type='checkbox'
                    id='hasPartner'
                    checked={hasPartner}
                    onChange={event => onToggleHasPartner(event.target.checked)}
                    className='w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2'
                  />
                  <label
                    htmlFor='hasPartner'
                    className={`ml-2 text-sm ${themeClasses.labelText} cursor-pointer`}
                  >
                    {translate(partnerToggleLabelKey)}
                  </label>
                </div>
              )}

              {hasPartner && (
                <>
                  <h3
                    className={`${themeClasses.titleText} text-base font-semibold`}
                  >
                    {translate(formKeys.partnerInfo)}
                  </h3>

                  <div>
                    <label
                      className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
                    >
                      {translate(formKeys.partnerName)}
                    </label>
                    <input
                      type='text'
                      value={partnerInfo.name}
                      onChange={event =>
                        onUpdatePartnerInfo('name', event.target.value)
                      }
                      className={`w-full px-4 py-3 bg-slate-800/80 border ${
                        formErrors.partnerName
                          ? 'border-red-500'
                          : themeClasses.inputBorder
                      } rounded-lg text-white placeholder-gray-400 focus:outline-none ${themeClasses.focusRing} transition-all`}
                    />
                    {formErrors.partnerName && (
                      <p className='text-red-400 text-xs mt-1'>
                        {formErrors.partnerName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
                    >
                      {translate(formKeys.partnerBirthDate)}
                    </label>
                    <div className='space-y-2'>
                      <input
                        type='date'
                        value={partnerInfo.birthDate}
                        onChange={event =>
                          onUpdatePartnerInfo('birthDate', event.target.value)
                        }
                        disabled={partnerInfo.birthDateUnknown}
                        className={`w-full px-4 py-3 bg-slate-800/80 border ${
                          formErrors.partnerBirthDate
                            ? 'border-red-500'
                            : themeClasses.inputBorder
                        } rounded-lg text-white focus:outline-none ${themeClasses.focusRing} transition-all ${
                          partnerInfo.birthDateUnknown
                            ? 'opacity-50 cursor-not-allowed'
                            : ''
                        }`}
                      />
                      <div className='flex items-center'>
                        <input
                          type='checkbox'
                          id='partnerBirthDateUnknown'
                          checked={partnerInfo.birthDateUnknown}
                          onChange={event =>
                            onUpdatePartnerInfo(
                              'birthDateUnknown',
                              event.target.checked
                            )
                          }
                          className='w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2'
                        />
                        <label
                          htmlFor='partnerBirthDateUnknown'
                          className={`ml-2 text-sm ${themeClasses.labelText} cursor-pointer`}
                        >
                          {translate(formKeys.partnerBirthDateUnknown)}
                        </label>
                      </div>
                    </div>
                    {formErrors.partnerBirthDate && (
                      <p className='text-red-400 text-xs mt-1'>
                        {formErrors.partnerBirthDate}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

          <div className='space-y-4'>
            <label
              className={`block text-sm font-medium ${themeClasses.labelText} mb-3`}
            >
              {translate(formKeys.communicationMethod)} *
            </label>

            <div className='grid grid-cols-1 gap-3'>
              <button
                type='button'
                onClick={() => onUpdateCommunicationMethod('email')}
                className={`relative p-4 rounded-lg border transition-all duration-200 text-left ${
                  communicationMethod === 'email'
                    ? 'border-blue-500 bg-blue-500/5'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-700/50'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      communicationMethod === 'email'
                        ? 'bg-blue-500'
                        : 'bg-gray-600'
                    }`}
                  >
                    <svg
                      className='w-4 h-4 text-white'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z' />
                      <path d='M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z' />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <div
                      className={`text-sm font-medium ${
                        communicationMethod === 'email'
                          ? 'text-blue-400'
                          : 'text-gray-200'
                      }`}
                    >
                      {translate(formKeys.emailCommunication)}
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      communicationMethod === 'email'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-500'
                    }`}
                  >
                    {communicationMethod === 'email' && (
                      <div
                        className='w-full h-full rounded-full bg-white'
                        style={{ transform: 'scale(0.5)' }}
                      ></div>
                    )}
                  </div>
                </div>
              </button>

              <button
                type='button'
                onClick={() => onUpdateCommunicationMethod('whatsapp')}
                className={`relative p-4 rounded-lg border transition-all duration-200 text-left ${
                  communicationMethod === 'whatsapp'
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-700/50'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <div
                    className={`w-8 h-8 rounded-md flex items-center justify-center ${
                      communicationMethod === 'whatsapp'
                        ? 'bg-green-500'
                        : 'bg-gray-600'
                    }`}
                  >
                    <svg
                      className='w-4 h-4 text-white'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488' />
                    </svg>
                  </div>
                  <div className='flex-1'>
                    <div
                      className={`text-sm font-medium ${
                        communicationMethod === 'whatsapp'
                          ? 'text-green-400'
                          : 'text-gray-200'
                      }`}
                    >
                      {translate(formKeys.whatsappCommunication)}
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 ${
                      communicationMethod === 'whatsapp'
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-500'
                    }`}
                  >
                    {communicationMethod === 'whatsapp' && (
                      <div
                        className='w-full h-full rounded-full bg-white'
                        style={{ transform: 'scale(0.5)' }}
                      ></div>
                    )}
                  </div>
                </div>
              </button>
            </div>
          </div>

          {communicationMethod === 'email' && (
            <div className='space-y-3 animate-in slide-in-from-top-2 duration-300'>
              <label
                className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
              >
                {translate(formKeys.email)} *
              </label>

              <div className='relative'>
                <input
                  type='email'
                  value={personalInfo.email}
                  onChange={event =>
                    onUpdatePersonalInfo('email', event.target.value)
                  }
                  placeholder={getPlaceholder(placeholders.email)}
                  className={`w-full px-4 py-3 bg-gray-800/50 border ${
                    formErrors.email
                      ? 'border-red-500 focus:border-red-400'
                      : 'border-gray-600 focus:border-blue-500'
                  } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all duration-200`}
                />
              </div>

              {formErrors.email && (
                <div className='flex items-center gap-2 text-red-400 text-sm'>
                  <svg
                    className='w-4 h-4 flex-shrink-0'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span>{formErrors.email}</span>
                </div>
              )}
            </div>
          )}

          {communicationMethod === 'whatsapp' && (
            <div className='space-y-3 animate-in slide-in-from-top-2 duration-300'>
              <label
                className={`block text-sm font-medium ${themeClasses.labelText} mb-2`}
              >
                {translate(formKeys.phone)} *
              </label>

              <div className='flex gap-2'>
                <div className='flex-shrink-0'>
                  <select
                    value={
                      personalInfo.countryCode ||
                      countryInfo?.phoneCode ||
                      '+90'
                    }
                    onChange={event =>
                      onUpdatePersonalInfo('countryCode', event.target.value)
                    }
                    className={`px-3 py-3 bg-gray-800/50 border border-gray-600 focus:border-green-500 rounded-lg text-white focus:outline-none focus:ring-1 focus:ring-green-500/30 transition-all duration-200 text-sm ${
                      countryLoading ? 'opacity-50' : ''
                    }`}
                    disabled={countryLoading}
                  >
                    {countryInfo && (
                      <option
                        value={countryInfo.phoneCode}
                        className='bg-green-600'
                      >
                        🎯 {countryInfo.phoneCode} ({countryInfo.country})
                      </option>
                    )}
                    <option value='+90'>🇹🇷 +90</option>
                    <option value='+1'>🇺🇸 +1</option>
                    <option value='+44'>🇬🇧 +44</option>
                    <option value='+49'>🇩🇪 +49</option>
                    <option value='+33'>🇫🇷 +33</option>
                    <option value='+39'>🇮🇹 +39</option>
                    <option value='+34'>🇪🇸 +34</option>
                    <option value='+31'>🇳🇱 +31</option>
                    <option value='+32'>🇧🇪 +32</option>
                    <option value='+41'>🇨🇭 +41</option>
                    <option value='+43'>🇦🇹 +43</option>
                    <option value='+46'>🇸🇪 +46</option>
                    <option value='+47'>🇳🇴 +47</option>
                    <option value='+45'>🇩🇰 +45</option>
                    <option value='+358'>🇫🇮 +358</option>
                    <option value='+7'>🇷🇺 +7</option>
                    <option value='+86'>🇨🇳 +86</option>
                    <option value='+81'>🇯🇵 +81</option>
                    <option value='+82'>🇰🇷 +82</option>
                    <option value='+91'>🇮🇳 +91</option>
                    <option value='+55'>🇧🇷 +55</option>
                    <option value='+54'>🇦🇷 +54</option>
                    <option value='+52'>🇲🇽 +52</option>
                    <option value='+971'>🇦🇪 +971</option>
                    <option value='+966'>🇸🇦 +966</option>
                    <option value='+974'>🇶🇦 +974</option>
                    <option value='+965'>🇰🇼 +965</option>
                    <option value='+973'>🇧🇭 +973</option>
                    <option value='+968'>🇴🇲 +968</option>
                    <option value='+20'>🇪🇬 +20</option>
                    <option value='+212'>🇲🇦 +212</option>
                    <option value='+216'>🇹🇳 +216</option>
                    <option value='+213'>🇩🇿 +213</option>
                    <option value='+218'>🇱🇾 +218</option>
                    <option value='+249'>🇸🇩 +249</option>
                    <option value='+27'>🇿🇦 +27</option>
                    <option value='+234'>🇳🇬 +234</option>
                    <option value='+254'>🇰🇪 +254</option>
                    <option value='+233'>🇬🇭 +233</option>
                    <option value='+220'>🇬🇲 +220</option>
                    <option value='+221'>🇸🇳 +221</option>
                    <option value='+223'>🇲🇱 +223</option>
                    <option value='+226'>🇧🇫 +226</option>
                    <option value='+227'>🇳🇪 +227</option>
                    <option value='+228'>🇹🇬 +228</option>
                    <option value='+229'>🇧🇯 +229</option>
                    <option value='+230'>🇲🇺 +230</option>
                    <option value='+231'>🇱🇷 +231</option>
                    <option value='+232'>🇸🇱 +232</option>
                    <option value='+235'>🇹🇩 +235</option>
                    <option value='+236'>🇨🇫 +236</option>
                    <option value='+237'>🇨🇲 +237</option>
                    <option value='+238'>🇨🇻 +238</option>
                    <option value='+239'>🇸🇹 +239</option>
                    <option value='+240'>🇬🇶 +240</option>
                    <option value='+241'>🇬🇦 +241</option>
                    <option value='+242'>🇨🇬 +242</option>
                    <option value='+243'>🇨🇩 +243</option>
                    <option value='+244'>🇦🇴 +244</option>
                    <option value='+245'>🇬🇼 +245</option>
                    <option value='+246'>🇮🇴 +246</option>
                    <option value='+247'>🇦🇨 +247</option>
                    <option value='+248'>🇸🇨 +248</option>
                    <option value='+250'>🇷🇼 +250</option>
                    <option value='+251'>🇪🇹 +251</option>
                    <option value='+252'>🇸🇴 +252</option>
                    <option value='+253'>🇩🇯 +253</option>
                    <option value='+255'>🇹🇿 +255</option>
                    <option value='+256'>🇺🇬 +256</option>
                    <option value='+257'>🇧🇮 +257</option>
                    <option value='+258'>🇲🇿 +258</option>
                    <option value='+260'>🇿🇲 +260</option>
                    <option value='+261'>🇲🇬 +261</option>
                    <option value='+262'>🇷🇪 +262</option>
                    <option value='+263'>🇿🇼 +263</option>
                    <option value='+264'>🇳🇦 +264</option>
                    <option value='+265'>🇲🇼 +265</option>
                    <option value='+266'>🇱🇸 +266</option>
                    <option value='+267'>🇧🇼 +267</option>
                    <option value='+268'>🇸🇿 +268</option>
                    <option value='+269'>🇰🇲 +269</option>
                    <option value='+290'>🇸🇭 +290</option>
                    <option value='+291'>🇪🇷 +291</option>
                    <option value='+297'>🇦🇼 +297</option>
                    <option value='+298'>🇫🇴 +298</option>
                    <option value='+299'>🇬🇱 +299</option>
                  </select>
                </div>
                <div className='flex-1'>
                  <input
                    type='tel'
                    value={personalInfo.phone}
                    onChange={event =>
                      onUpdatePersonalInfo('phone', event.target.value)
                    }
                    placeholder={getPlaceholder(placeholders.phone)}
                    className={`w-full px-4 py-3 bg-gray-800/50 border ${
                      formErrors.phone
                        ? 'border-red-500 focus:border-red-400'
                        : 'border-gray-600 focus:border-green-500'
                    } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-green-500/30 transition-all duration-200`}
                  />
                </div>
              </div>

              {formErrors.phone && (
                <div className='flex items-center gap-2 text-red-400 text-sm'>
                  <svg
                    className='w-4 h-4 flex-shrink-0'
                    fill='currentColor'
                    viewBox='0 0 20 20'
                  >
                    <path
                      fillRule='evenodd'
                      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z'
                      clipRule='evenodd'
                    />
                  </svg>
                  <span>{formErrors.phone}</span>
                </div>
              )}
            </div>
          )}

          <div
            className={`space-y-4 pt-4 border-t ${themeClasses.sectionBorder}`}
          >
            <h3 className={`${themeClasses.titleText} text-base font-semibold`}>
              {translate(formKeys.questions)}
            </h3>
            <QuestionSection
              isSingleCard={isSingleCard}
              formKeys={formKeys}
              questionLabels={questionLabels}
              themeClasses={themeClasses}
              questions={questions}
              formErrors={formErrors}
              placeholders={placeholders}
              getPlaceholder={getPlaceholder}
              translate={translate}
              onUpdateQuestion={onUpdateQuestion}
            />
          </div>

          {formErrors.general && (
            <div className='bg-red-900/20 border border-red-500/50 rounded-lg p-3'>
              <p className='text-red-400 text-sm'>{formErrors.general}</p>
            </div>
          )}
        </div>
      </div>

      <div
        className={`px-4 py-4 sm:p-6 border-t ${themeClasses.sectionBorder} flex-shrink-0`}
        style={{ paddingBottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
      >
        <button
          onClick={onSaveForm}
          disabled={isSaving || consentBlocked}
          className={`w-full ${themeClasses.buttonBg} ${themeClasses.buttonHover} text-white font-semibold py-3.5 px-5 rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-base`}
        >
          {isSaving ? (
            <div className='flex items-center justify-center'>
              <div className='w-5 h-5 border-2 border-white border-opacity-30 border-t-white rounded-full animate-spin mr-2'></div>
              {translate(formKeys.saving, 'Kaydediliyor...')}
            </div>
          ) : (
            translate(
              formKeys.saveAndOpen || 'spreads.singleCard.form.saveAndOpen',
              'Formu Kaydet ve Kartları Aç 🎴'
            )
          )}
        </button>
        {consentMessage ? (
          <p className='text-xs text-amber-300 text-center mt-3'>
            {consentMessage}
          </p>
        ) : null}
      </div>
    </div>
  );

  if (variant === 'inline') {
    return formContent;
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm p-3 sm:p-4'
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
      onClick={event => {
        if (event.target === event.currentTarget) {
          handleClose();
        }
      }}
    >
      {formContent}
    </div>
  );
}
