import type { ConsentLocale, ConsentPreferences, ConsentState } from './types';

type Listener = () => void;

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  advertising: false,
};

let state: ConsentState = {
  ready: false,
  locale: 'en',
  preferences: DEFAULT_PREFERENCES,
};

const listeners = new Set<Listener>();
let localeSetter: ((locale: ConsentLocale) => void) | null = null;

export function getConsentState(): ConsentState {
  return state;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notify(): void {
  listeners.forEach(listener => {
    try {
      listener();
    } catch (error) {
      console.error('Consent store listener error', error);
    }
  });
}

function mergePreferences(
  current: ConsentPreferences,
  next?: Partial<ConsentPreferences>
): ConsentPreferences {
  if (!next) {
    return current;
  }

  return {
    ...current,
    ...next,
  };
}

export function updateConsentState(partial: Partial<ConsentState>): void {
  state = {
    ...state,
    ...partial,
    preferences: mergePreferences(state.preferences, partial.preferences),
  };
  notify();
}

export function setConsentPreferences(preferences: ConsentPreferences): void {
  state = {
    ...state,
    preferences,
  };
  notify();
}

export function markConsentReady(ready: boolean): void {
  if (state.ready === ready) {
    return;
  }
  state = {
    ...state,
    ready,
  };
  notify();
}

export function registerConsentLocaleSetter(
  setter: (locale: ConsentLocale) => void
): void {
  localeSetter = setter;
}

export function setConsentLocale(locale: ConsentLocale): void {
  if (state.locale === locale) {
    return;
  }
  state = {
    ...state,
    locale,
  };
  notify();
  localeSetter?.(locale);
}

export function setConsentManagerControls(controls: {
  openManager?: () => void;
  showPreferences?: () => void;
}): void {
  state = {
    ...state,
    ...controls,
  };
  notify();
}

