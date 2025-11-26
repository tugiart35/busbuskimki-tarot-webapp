import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { supabase } from '@/lib/supabase/client';
import {
  ensureMetaClickId,
  getMetaCookieValues,
} from '@/lib/analytics/cookies';
import {
  generateMetaEventId,
  trackMetaLeadEvent,
} from '@/lib/analytics/metaPixel';
import { getOrCreateExternalId } from '@/lib/analytics/externalId';
import { getConsentState } from '@/lib/consent/store';
import type { ConsentPreferences } from '@/lib/consent/types';
import { READING_TYPES } from '@/types/tarot';
import type { TarotConfig } from '../types/tarot-config.types';
import type {
  ModalStates,
  PersonalInfo,
  PartnerInfo,
  Questions,
} from '../hooks/useTarotFormState';

export interface CreditStatusSummary {
  creditStatus: {
    requiredCredits: number;
  };
}

export interface DetailedFormSubmissionMessages {
  loginRequired: string;
  tokenFlowSaveError: string;
  guestDataNotStored: string;
}

export interface DetailedFormSubmissionDataKeys {
  spreadName: string;
  spreadTitle: string;
}

interface SaveReadingSuccess {
  success: true;
  id?: string | null;
  userId?: string | null;
  message?: string;
}

interface SaveReadingFailure {
  success: false;
  error?: string;
}

export type SaveReadingResult = SaveReadingSuccess | SaveReadingFailure;

export interface DetailedFormSubmissionDeps {
  sessionToken: string | null;
  userId: string | null;
  showToast: (_message: string, _type: 'success' | 'error' | 'info') => void;
  translate: (_key: string, _fallback?: string) => string;
  messages: DetailedFormSubmissionMessages;
  dataKeys: DetailedFormSubmissionDataKeys;
  validateDetailedForm: () => boolean;
  setModalStates: Dispatch<SetStateAction<ModalStates>>;
  setSelectedReadingType: (_value: string | null) => void;
  setSaving: (_value: boolean) => void;
  setDetailedFormSaved: (_value: boolean) => void;
  personalInfo: PersonalInfo;
  partnerInfo: PartnerInfo;
  communicationMethod: 'email' | 'whatsapp';
  questions: Questions;
  config: TarotConfig;
  hasPartner: boolean;
  partnerInfoSpreads: string[];
  detailedCredits: CreditStatusSummary;
  writtenCredits: CreditStatusSummary;
  selectedReadingType: string | null;
  metaLeadRef: MutableRefObject<MetaLeadContext | null>;
}

export interface DetailedFormSubmissionHandlers {
  handleSaveDetailedFormClick: () => void;
  closeInfoModal: () => void;
  cancelInfoModal: () => void;
  saveDetailedForm: () => Promise<void>;
  saveReadingToSupabase: (_readingData: any) => Promise<SaveReadingResult>;
}

export interface MetaLeadContext {
  eventId: string;
  eventTime: number;
  fbp: string | null;
  fbc: string | null;
  eventSourceUrl?: string;
  contentName?: string;
  customData?: Record<string, unknown>;
}

const META_LEAD_DEFAULT_CURRENCY = 'TRY';
const META_LEAD_DEFAULT_VALUE = 0;

export function createDetailedFormSubmission({
  sessionToken,
  userId,
  showToast,
  translate,
  messages,
  dataKeys,
  validateDetailedForm,
  setModalStates,
  setSelectedReadingType,
  setSaving,
  setDetailedFormSaved,
  personalInfo,
  partnerInfo,
  communicationMethod,
  questions,
  config,
  hasPartner,
  partnerInfoSpreads,
  detailedCredits,
  writtenCredits,
  selectedReadingType,
  metaLeadRef,
}: DetailedFormSubmissionDeps): DetailedFormSubmissionHandlers {
  const buildMetaLeadContext = async (): Promise<MetaLeadContext | null> => {
    if (typeof window === 'undefined') {
      return null;
    }

    const ensuredFbc = ensureMetaClickId();

    // Try to get fbp cookie with retry logic
    let fbp = getMetaCookieValues().fbp;

    // If fbp is missing, wait briefly and retry (Meta Pixel may still be initializing)
    if (!fbp) {
      await new Promise(resolve => setTimeout(resolve, 200));
      fbp = getMetaCookieValues().fbp;
    }

    // If still missing, generate a fallback fbp cookie
    if (!fbp) {
      fbp = `fb.1.${Date.now()}.${Math.random().toString(36).substring(2, 15)}`;
      // Set cookie for future use (90 days like Meta's default)
      const maxAgeSeconds = 60 * 60 * 24 * 90;
      document.cookie = `_fbp=${fbp}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
    }

    const { fbc } = getMetaCookieValues();

    return {
      eventId: generateMetaEventId(),
      eventTime: Math.floor(Date.now() / 1000),
      fbp,
      fbc: ensuredFbc || fbc,
      eventSourceUrl: window.location.href,
    };
  };

  const handleSaveDetailedFormClick = () => {
    if (!validateDetailedForm()) {
      return;
    }

    // Token okumasında kredi onay modalı gösterme, direkt kaydet
    // Çünkü token okumasında kredi düşmüyoruz
    if (sessionToken) {
      saveDetailedForm();
      return;
    }

    // Normal akışta kredi onay modalını göster
    setModalStates(prev => ({ ...prev, showCreditConfirm: true }));
  };

  const closeInfoModal = () => {
    setModalStates(prev => ({ ...prev, showInfoModal: false }));
  };

  const cancelInfoModal = () => {
    setModalStates(prev => ({ ...prev, showInfoModal: false }));
    setSelectedReadingType(null);
  };

  const saveDetailedForm = async () => {
    if (!sessionToken && !userId) {
      showToast(translate(messages.loginRequired), 'error');
      setModalStates(prev => ({
        ...prev,
        showCreditConfirm: false,
        isSaving: false,
      }));
      return;
    }

    setSaving(true);
    try {
      setDetailedFormSaved(true);
      setModalStates(prev => ({ ...prev, showCreditConfirm: false }));

      if (!metaLeadRef.current) {
        metaLeadRef.current = await buildMetaLeadContext();
      }

      if (metaLeadRef.current) {
        const shouldIncludePartnerInfo =
          config.requiresPartnerInfo ||
          (config.isSingleCard && hasPartner) ||
          (partnerInfoSpreads.includes(config.spreadId) && hasPartner);

        const contentName = translate(dataKeys.spreadName);
        metaLeadRef.current.contentName = contentName;
        const serviceType =
          config.spreadId || config.translationNamespace || 'unknown_service';
        const baseCustomData: Record<string, unknown> = {
          communication_method: communicationMethod,
          spread_id: config.spreadId,
          service_type: serviceType,
          locale: config.translationNamespace,
          relationship_status: personalInfo.relationshipStatus || undefined,
          lead_country: personalInfo.countryCode || undefined,
          birth_date_known: !personalInfo.birthDateUnknown,
          partner_name:
            shouldIncludePartnerInfo && partnerInfo.name
              ? partnerInfo.name
              : undefined,
          partner_birth_date_provided:
            shouldIncludePartnerInfo &&
            !partnerInfo.birthDateUnknown &&
            !!partnerInfo.birthDate,
        };
        metaLeadRef.current.customData = baseCustomData;

        trackMetaLeadEvent({
          eventId: metaLeadRef.current.eventId,
          contentName,
          value: META_LEAD_DEFAULT_VALUE,
          currency: META_LEAD_DEFAULT_CURRENCY,
          customData: baseCustomData,
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const sendMetaLeadForAuthenticatedUser = async () => {
    if (!metaLeadRef.current) {
      return;
    }

    const shouldIncludePartnerInfo =
      config.requiresPartnerInfo ||
      (config.isSingleCard && hasPartner) ||
      (partnerInfoSpreads.includes(config.spreadId) && hasPartner);

    // Fetch user metadata to get fb_login_id if available
    let fbLoginId: string | undefined;
    if (userId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.app_metadata?.provider === 'facebook' && user?.identities) {
        const fbIdentity = user.identities.find((id: { provider: string; id: string }) => id.provider === 'facebook');
        if (fbIdentity?.id) {
          fbLoginId = fbIdentity.id;
        }
      }
    }

    // Get or create persistent external ID for all users (authenticated and guest)
    const externalId = getOrCreateExternalId(userId);

    const personalInfoPayload = {
      ...personalInfo,
      externalId,
      fbLoginId,
    };

    try {
      const response = await fetch('/api/meta/lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metaPixel: {
            eventId: metaLeadRef.current.eventId,
            eventTime: metaLeadRef.current.eventTime,
            fbp: metaLeadRef.current.fbp,
            fbc: metaLeadRef.current.fbc,
            eventSourceUrl: metaLeadRef.current.eventSourceUrl,
            contentName: metaLeadRef.current.contentName,
            customData: metaLeadRef.current.customData,
          },
          personalInfo: personalInfoPayload,
          partnerInfo: shouldIncludePartnerInfo ? partnerInfo : undefined,
          communicationMethod,
          consent: buildConsentSnapshot(),
        }),
      });

      if (!response.ok) {
        console.warn('Meta CAPI lead endpoint responded with error');
      }
    } catch (error) {
      console.warn('Meta CAPI lead endpoint failed', error);
    }
  };

  const saveReadingToSupabase = async (readingData: any) => {
    try {
      if (sessionToken) {
        try {
          const formPayload = {
            personalInfo,
            ...(config.requiresPartnerInfo ||
              (config.isSingleCard && hasPartner) ||
              (partnerInfoSpreads.includes(config.spreadId) && hasPartner)
              ? { partnerInfo }
              : {}),
            communicationMethod,
            userQuestions: questions,
          };
          const shouldIncludePartnerInfo =
            config.requiresPartnerInfo ||
            (config.isSingleCard && hasPartner) ||
            (partnerInfoSpreads.includes(config.spreadId) && hasPartner);

          const saveResponse = await fetch(
            '/api/reading-sessions/save-reading',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                token: sessionToken,
                readingData: {
                  ...readingData,
                  spread_name: translate(dataKeys.spreadName),
                  spreadName: translate(dataKeys.spreadName),
                },
                formPayload,
                communicationMethod,
                personalInfo,
                partnerInfo: shouldIncludePartnerInfo ? partnerInfo : undefined,
                consent: buildConsentSnapshot(),
                metaPixel: metaLeadRef.current
                  ? {
                    eventId: metaLeadRef.current.eventId,
                    eventTime: metaLeadRef.current.eventTime,
                    fbp: metaLeadRef.current.fbp,
                    fbc: metaLeadRef.current.fbc,
                    eventSourceUrl: metaLeadRef.current.eventSourceUrl,
                    contentName: metaLeadRef.current.contentName,
                    customData: metaLeadRef.current.customData,
                  }
                  : undefined,
              }),
            }
          );

          const saveResult = await saveResponse.json();

          if (!saveResponse.ok || !saveResult.success) {
            throw new Error(
              saveResult.error || translate(messages.tokenFlowSaveError)
            );
          }

          metaLeadRef.current = null;

          return {
            success: true,
            id: saveResult.id,
            userId: null,
          } as SaveReadingResult;
        } catch (error) {
          return {
            success: false,
            error:
              error instanceof Error
                ? error.message
                : translate(messages.tokenFlowSaveError),
          };
        }
      }

      if (!userId) {
        return {
          success: true,
          id: 'guest-session',
          userId: 'guest',
          message: translate(messages.guestDataNotStored),
        } as SaveReadingResult;
      }

      const costCredits =
        selectedReadingType === READING_TYPES.DETAILED
          ? detailedCredits.creditStatus.requiredCredits
          : selectedReadingType === READING_TYPES.WRITTEN
            ? writtenCredits.creditStatus.requiredCredits
            : 0;

      const enhancedMetadata = {
        ...readingData.metadata,
        communicationMethod,
        personalInfo: {
          ...personalInfo,
          phoneProvided: !!personalInfo.phone,
        },
      };

      const rpcParams = {
        p_user_id: userId,
        p_reading_type: readingData.readingType,
        p_spread_name: translate(dataKeys.spreadName),
        p_title: readingData.title || translate(dataKeys.spreadTitle),
        p_interpretation: readingData.interpretation,
        p_cards: readingData.cards.selectedCards,
        p_questions: readingData.questions,
        p_cost_credits: costCredits,
        p_metadata: enhancedMetadata,
        p_idempotency_key: `reading_${userId}_${readingData.timestamp}`,
      };

      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        'fn_create_reading_with_debit',
        rpcParams
      );

      if (rpcResult?.id) {
        await supabase
          .from('readings')
          .update({
            contact_method: communicationMethod,
            phone:
              communicationMethod === 'whatsapp' ? personalInfo.phone : null,
          })
          .eq('id', rpcResult.id);

        if (sessionToken) {
          try {
            const validateResponse = await fetch(
              `/api/reading-sessions/validate?token=${sessionToken}`
            );
            const validateData = await validateResponse.json();

            if (validateData.sessionId) {
              const formPayload = {
                personalInfo,
                ...(config.requiresPartnerInfo ||
                  (config.isSingleCard && hasPartner) ||
                  (partnerInfoSpreads.includes(config.spreadId) && hasPartner)
                  ? { partnerInfo }
                  : {}),
                communicationMethod,
                userQuestions: questions,
              };

              await supabase.from('reading_form_responses').upsert(
                {
                  session_id: validateData.sessionId,
                  payload: formPayload,
                  completed_at: new Date().toISOString(),
                },
                {
                  onConflict: 'session_id',
                }
              );
            }
          } catch {
            // Sessizce devam et
          }
        }
      }

      if (rpcError) {
        throw rpcError;
      }

      if (rpcResult?.id) {
        fetch('/api/admin/notify-reading-completed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            readingId: rpcResult.id,
          }),
        }).catch(() => {
          // Admin bildirimi başarısız olsa bile devam et
        });

        if (metaLeadRef.current) {
          await sendMetaLeadForAuthenticatedUser();
        }
      }

      metaLeadRef.current = null;

      return {
        success: true,
        id: rpcResult?.id,
        userId,
      } as SaveReadingResult;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      };
    }
  };

  return {
    handleSaveDetailedFormClick,
    closeInfoModal,
    cancelInfoModal,
    saveDetailedForm,
    saveReadingToSupabase,
  };
}

function buildConsentSnapshot():
  | {
    consentId: string;
    version?: number;
    preferences: ConsentPreferences;
  }
  | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const state = getConsentState();
  if (!state.ready || !state.consentId) {
    return undefined;
  }

  const { consentId, version, preferences } = state;

  const snapshot: {
    consentId: string;
    version?: number;
    preferences: ConsentPreferences;
  } = {
    consentId,
    preferences,
  };

  if (typeof version === 'number') {
    snapshot.version = version;
  }

  return snapshot;
}
