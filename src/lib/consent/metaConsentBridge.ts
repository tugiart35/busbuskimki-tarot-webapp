import type { ConsentPreferences } from './types';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

let lastGranted = false;

export function applyMetaConsent(preferences: ConsentPreferences): void {
  if (typeof window === 'undefined') {
    return;
  }

  const fbq = window.fbq;
  if (typeof fbq !== 'function') {
    return;
  }

  const shouldGrant = preferences.marketing || preferences.advertising;
  if (shouldGrant === lastGranted) {
    return;
  }

  lastGranted = shouldGrant;
  fbq('consent', shouldGrant ? 'grant' : 'revoke');
}









