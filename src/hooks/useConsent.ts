'use client';

import { useSyncExternalStore } from 'react';
import {
  getConsentState,
  setConsentLocale,
  subscribe,
} from '@/lib/consent/store';
import type { ConsentLocale, ConsentState } from '@/lib/consent/types';

export function useConsent(): ConsentState {
  return useSyncExternalStore(subscribe, getConsentState, getConsentState);
}

export function useConsentLocaleSetter(): (locale: ConsentLocale) => void {
  return setConsentLocale;
}

export function useConsentManager() {
  const state = useConsent();
  return {
    open: state.openManager,
    showPreferences: state.showPreferences,
  };
}

