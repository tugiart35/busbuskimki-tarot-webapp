import type { ConsentPreferences } from './types';

type GtagFunction = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFunction;
  }
}

const CONSENT_FIELDS = {
  ad_storage: 'ad_storage',
  analytics_storage: 'analytics_storage',
  ad_user_data: 'ad_user_data',
  ad_personalization: 'ad_personalization',
} as const;

function ensureGtag(): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }

  if (typeof window.gtag !== 'function') {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
  }
}

function toSignal(value: boolean): 'granted' | 'denied' {
  return value ? 'granted' : 'denied';
}

export function initGoogleConsentDefaults(): void {
  if (typeof window === 'undefined') {
    return;
  }

  ensureGtag();

  window.gtag?.('consent', 'default', {
    [CONSENT_FIELDS.ad_storage]: 'denied',
    [CONSENT_FIELDS.analytics_storage]: 'denied',
    [CONSENT_FIELDS.ad_user_data]: 'denied',
    [CONSENT_FIELDS.ad_personalization]: 'denied',
  });
}

let lastConsentSignature: string | null = null;

export function applyGoogleConsent(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') {
    return;
  }

  ensureGtag();

  const payload = {
    [CONSENT_FIELDS.analytics_storage]: toSignal(preferences.analytics),
    [CONSENT_FIELDS.ad_storage]: toSignal(preferences.advertising),
    [CONSENT_FIELDS.ad_user_data]: toSignal(preferences.advertising),
    [CONSENT_FIELDS.ad_personalization]: toSignal(preferences.advertising),
  };

  const signature = JSON.stringify(payload);
  if (signature === lastConsentSignature) {
    return;
  }

  lastConsentSignature = signature;
  window.gtag?.('consent', 'update', payload);
}









