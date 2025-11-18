export type ConsentPurpose = 'necessary' | 'analytics' | 'marketing' | 'advertising';

export interface ConsentPreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  advertising: boolean;
}

export interface ConsentState {
  ready: boolean;
  locale: ConsentLocale;
  preferences: ConsentPreferences;
  consentId?: string;
  version?: number;
  openManager?: () => void;
  showPreferences?: () => void;
}

export type ConsentLocale = 'tr' | 'en' | 'sr';

export interface ConsentLogPayload {
  consentId: string;
  locale: ConsentLocale;
  version: number;
  preferences: ConsentPreferences;
  timestamp: string;
}




