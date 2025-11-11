'use client';

import { useState, useCallback } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

export interface PersonalInfo {
  name: string;
  surname: string;
  birthDate: string;
  birthDateUnknown: boolean;
  relationshipStatus: string;
  email: string;
  phone: string;
  countryCode: string;
}

export interface PartnerInfo {
  name: string;
  birthDate: string;
  birthDateUnknown: boolean;
}

export interface Questions {
  concern: string;
  understanding: string;
  emotional: string;
  mainQuestion?: string; // Single card için tek soru
}

export interface FormErrors {
  name: string;
  surname: string;
  birthDate: string;
  relationshipStatus: string;
  email: string;
  phone: string;
  countryCode: string;
  concern: string;
  understanding: string;
  emotional: string;
  partnerName: string;
  partnerBirthDate: string;
  general: string;
}

export interface ModalStates {
  isSaving: boolean;
  showCreditConfirm: boolean;
  detailedFormSaved: boolean;
  showInfoModal: boolean;
  isSavingReading: boolean;
  showSuccessModal: boolean;
}

export interface ValidationKeys {
  nameMinLength: string;
  surnameMinLength: string;
  birthDateRequired: string;
  relationshipStatusRequired: string;
  partnerNameRequired: string;
  partnerBirthDateRequired: string;
  emailInvalid: string;
  questionMinLength: string;
}

export interface UseTarotFormStateProps {
  validationKeys: ValidationKeys;
  requiresPartnerInfo?: boolean;
  isSingleCard?: boolean; // Single card spread flag
}

export interface UseTarotFormStateReturn {
  // State
  personalInfo: PersonalInfo;
  partnerInfo: PartnerInfo;
  communicationMethod: 'email' | 'whatsapp';
  questions: Questions;
  formErrors: FormErrors;
  modalStates: ModalStates;
  hasPartner: boolean; // Single card için partner bilgisi toggle

  // Actions
  updatePersonalInfo: (
    _field: keyof PersonalInfo,
    _value: string | boolean
  ) => void;
  updatePartnerInfo: (
    _field: keyof PartnerInfo,
    _value: string | boolean
  ) => void;
  updateCommunicationMethod: (_method: 'email' | 'whatsapp') => void;
  updateQuestion: (_field: keyof Questions, _value: string) => void;
  toggleHasPartner: (_value: boolean) => void; // Single card için partner toggle
  setPersonalInfo: React.Dispatch<React.SetStateAction<PersonalInfo>>;
  setPartnerInfo: React.Dispatch<React.SetStateAction<PartnerInfo>>;
  setQuestions: React.Dispatch<React.SetStateAction<Questions>>;
  setFormErrors: React.Dispatch<React.SetStateAction<FormErrors>>;
  setModalStates: React.Dispatch<React.SetStateAction<ModalStates>>;

  // Validation
  validateDetailedForm: () => boolean;

  // Modal helpers
  closeInfoModal: () => void;
  closeCreditConfirm: () => void;
  closeSuccessModal: () => void;
  setSaving: (_isSaving: boolean) => void;
  setSavingReading: (_isSavingReading: boolean) => void;
  setDetailedFormSaved: (_saved: boolean) => void;
}

export function useTarotFormState({
  validationKeys,
  requiresPartnerInfo = false,
  isSingleCard = false,
}: UseTarotFormStateProps): UseTarotFormStateReturn {
  const [hasPartner, setHasPartner] = useState<boolean>(false);
  const { t } = useTranslations();

  // Form state
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    surname: '',
    birthDate: '',
    birthDateUnknown: false,
    relationshipStatus: '',
    email: '',
    phone: '',
    countryCode: '',
  });

  const [partnerInfo, setPartnerInfo] = useState<PartnerInfo>({
    name: '',
    birthDate: '',
    birthDateUnknown: false,
  });

  const [communicationMethod, setCommunicationMethod] = useState<
    'email' | 'whatsapp'
  >('email');

  const [questions, setQuestions] = useState<Questions>({
    concern: '',
    understanding: '',
    emotional: '',
    mainQuestion: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({
    name: '',
    surname: '',
    birthDate: '',
    relationshipStatus: '',
    email: '',
    phone: '',
    countryCode: '',
    concern: '',
    understanding: '',
    emotional: '',
    partnerName: '',
    partnerBirthDate: '',
    general: '',
  });

  const [modalStates, setModalStates] = useState<ModalStates>({
    isSaving: false,
    showCreditConfirm: false,
    detailedFormSaved: false,
    showInfoModal: false,
    isSavingReading: false,
    showSuccessModal: false,
  });

  // Form update functions
  const updatePersonalInfo = useCallback(
    (field: keyof PersonalInfo, value: string | boolean) => {
      setPersonalInfo(prev => ({ ...prev, [field]: value }));
      setFormErrors(errors => ({ ...errors, [field]: '', general: '' }));

      // Eğer "doğum tarihimi bilmiyorum" seçildiyse, doğum tarihini temizle
      if (field === 'birthDateUnknown' && value === true) {
        setPersonalInfo(prev => ({ ...prev, birthDate: '' }));
        setFormErrors(errors => ({ ...errors, birthDate: '' }));
      }
    },
    []
  );

  const updatePartnerInfo = useCallback(
    (field: keyof PartnerInfo, value: string | boolean) => {
      setPartnerInfo(prev => {
        const next = { ...prev, [field]: value } as PartnerInfo;
        if (field === 'birthDateUnknown' && value === true) {
          next.birthDate = '';
        }
        return next;
      });

      setFormErrors(errors => ({
        ...errors,
        general: '',
        ...(field === 'name' ? { partnerName: '' } : {}),
        ...(field === 'birthDate' || field === 'birthDateUnknown'
          ? { partnerBirthDate: '' }
          : {}),
      }));
    },
    []
  );

  const updateQuestion = useCallback(
    (field: keyof Questions, value: string) => {
      setQuestions(prev => ({ ...prev, [field]: value }));
      setFormErrors(errors => ({ ...errors, [field]: '', general: '' }));
    },
    []
  );

  // Validation function
  const validateDetailedForm = useCallback(() => {
    const errors: { [key: string]: string } = {};
    let hasError = false;

    // Name validation
    if (!personalInfo.name.trim() || personalInfo.name.trim().length < 3) {
      errors.name = t(validationKeys.nameMinLength);
      hasError = true;
    }

    // Surname validation - Kaldırıldı, artık formda surname alanı yok

    // Birth date validation - Eğer "bilmiyorum" seçilmediyse zorunlu
    if (!personalInfo.birthDateUnknown && !personalInfo.birthDate) {
      errors.birthDate = t(validationKeys.birthDateRequired);
      hasError = true;
    }

    // Relationship status validation - Artık zorunlu değil, opsiyonel alan

    // Partner bilgileri validasyonu - requiresPartnerInfo true ise zorunlu, değilse hasPartner true ise zorunlu
    if (requiresPartnerInfo || hasPartner) {
      if (!partnerInfo.name.trim()) {
        errors.partnerName = t(validationKeys.partnerNameRequired);
        hasError = true;
      }
      if (!partnerInfo.birthDateUnknown && !partnerInfo.birthDate) {
        errors.partnerBirthDate = t(validationKeys.partnerBirthDateRequired);
        hasError = true;
      }
    }

    // Email validation (Email seçilirse gerekli)
    if (communicationMethod === 'email') {
      if (!personalInfo.email.trim()) {
        errors.email = 'E-posta adresi gerekli';
        hasError = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email)) {
        errors.email = t(validationKeys.emailInvalid);
        hasError = true;
      }
    }

    // Phone validation (WhatsApp seçildiyse gerekli)
    if (communicationMethod === 'whatsapp') {
      if (!personalInfo.phone.trim()) {
        errors.phone = t('validation.phoneRequired');
        hasError = true;
      } else if (
        !/^\+?[1-9]\d{1,14}$/.test(personalInfo.phone.replace(/\s/g, ''))
      ) {
        errors.phone = t('validation.phone');
        hasError = true;
      }
    }

    // Questions validation
    if (isSingleCard) {
      // Single card için sadece concern (mainQuestion) kontrolü
      if (!questions.concern.trim() || questions.concern.trim().length < 10) {
        errors.concern = t(validationKeys.questionMinLength);
        hasError = true;
      }
    } else {
      // Normal spread için 3 soru kontrolü
      if (!questions.concern.trim() || questions.concern.trim().length < 10) {
        errors.concern = t(validationKeys.questionMinLength);
        hasError = true;
      }

      if (
        !questions.understanding.trim() ||
        questions.understanding.trim().length < 10
      ) {
        errors.understanding = t(validationKeys.questionMinLength);
        hasError = true;
      }

      if (!questions.emotional.trim() || questions.emotional.trim().length < 10) {
        errors.emotional = t(validationKeys.questionMinLength);
        hasError = true;
      }
    }

    setFormErrors(prev => ({ ...prev, ...errors }));
    return !hasError;
  }, [
    personalInfo,
    partnerInfo,
    hasPartner,
    questions,
    communicationMethod,
    validationKeys,
    requiresPartnerInfo,
    isSingleCard,
    t,
  ]);

  // Partner bilgisi toggle fonksiyonu
  const toggleHasPartner = useCallback(
    (value: boolean) => {
      setHasPartner(value);
      if (!value) {
        // Partner bilgisi kapatıldığında temizle
        setPartnerInfo({
          name: '',
          birthDate: '',
          birthDateUnknown: false,
        });
        setFormErrors(prev => ({
          ...prev,
          partnerName: '',
          partnerBirthDate: '',
        }));
      }
    },
    []
  );

  // Modal helper functions
  const closeInfoModal = useCallback(() => {
    setModalStates(prev => ({ ...prev, showInfoModal: false }));
  }, []);

  const closeCreditConfirm = useCallback(() => {
    setModalStates(prev => ({ ...prev, showCreditConfirm: false }));
  }, []);

  const closeSuccessModal = useCallback(() => {
    setModalStates(prev => ({ ...prev, showSuccessModal: false }));
  }, []);

  const setSaving = useCallback((isSaving: boolean) => {
    setModalStates(prev => ({ ...prev, isSaving }));
  }, []);

  const setSavingReading = useCallback((isSavingReading: boolean) => {
    setModalStates(prev => ({ ...prev, isSavingReading }));
  }, []);

  const setDetailedFormSaved = useCallback((saved: boolean) => {
    setModalStates(prev => ({ ...prev, detailedFormSaved: saved }));
  }, []);

  const updateCommunicationMethod = useCallback(
    (method: 'email' | 'whatsapp') => {
      setCommunicationMethod(method);
      // E-posta seçilirse telefon alanını, WhatsApp seçilirse e-posta alanını temizle
      if (method === 'email') {
        setPersonalInfo(prev => ({ ...prev, phone: '' }));
        setFormErrors(prev => ({ ...prev, phone: '' }));
      } else if (method === 'whatsapp') {
        setPersonalInfo(prev => ({ ...prev, email: '' }));
        setFormErrors(prev => ({ ...prev, email: '' }));
      }
    },
    []
  );

  return {
    // State
    personalInfo,
    partnerInfo,
    communicationMethod,
    questions,
    formErrors,
    modalStates,
    hasPartner,

    // Actions
    updatePersonalInfo,
    updatePartnerInfo,
    updateCommunicationMethod,
    updateQuestion,
    toggleHasPartner,
    setPersonalInfo,
    setPartnerInfo,
    setQuestions,
    setFormErrors,
    setModalStates,

    // Validation
    validateDetailedForm,

    // Modal helpers
    closeInfoModal,
    closeCreditConfirm,
    closeSuccessModal,
    setSaving,
    setSavingReading,
    setDetailedFormSaved,
  };
}
