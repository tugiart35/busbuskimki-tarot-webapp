'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Script from 'next/script';
import {
  markConsentReady,
  registerConsentLocaleSetter,
  setConsentManagerControls,
  setConsentPreferences,
  updateConsentState,
} from '@/lib/consent/store';
import {
  initGoogleConsentDefaults,
  applyGoogleConsent,
} from '@/lib/consent/googleConsentBridge';
import { applyMetaConsent } from '@/lib/consent/metaConsentBridge';
import type {
  ConsentLocale,
  ConsentPreferences,
  ConsentState,
} from '@/lib/consent/types';

const CMP_VERSION = 1;
const CMP_SCRIPT_SRC = 'https://cdn.kiprotect.com/klaro/latest/klaro.js';
const CMP_STYLE_HREF = 'https://cdn.kiprotect.com/klaro/latest/klaro.css';
const CONSENT_ID_STORAGE_KEY = 'tara-tarot.consent-id';

declare global {
  interface Window {
    klaro?: {
      getManager?: () => KlaroManager | undefined;
      setConfig?: (config: KlaroConfig) => void;
      setLanguage?: (lang: string) => void;
      show?: (view?: string) => void;
    };
    klaroConfig?: KlaroConfig;
  }
}

interface KlaroManager {
  watch(callback: () => void): string;
  removeWatcher?(id: string): void;
  getConsents?(): KlaroConsents;
  getState?(): { consents?: KlaroConsents };
  consents?: KlaroConsents;
  update?(): void;
}

interface KlaroConsents {
  purposes?: Record<string, boolean>;
  services?: Record<string, boolean>;
}

interface KlaroConfig {
  version: number;
  elementID: string;
  storageMethod: 'cookie' | 'localStorage';
  cookieName: string;
  lang: ConsentLocale;
  privacyPolicy?: string;
  styling?: {
    theme?: string[];
  };
  translations: Record<string, unknown>;
  purposes: Record<
    string,
    {
      title: string;
      description: string;
    }
  >;
  services: Array<{
    name: string;
    title: string;
    purposes: string[];
    default?: boolean;
    required?: boolean;
    cookies?: string[];
  }>;
}

const DEFAULT_LOCALE: ConsentLocale = 'en';

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  advertising: false,
};

function createConsentId(): string {
  if (typeof window === 'undefined') {
    return `consent_${Date.now()}`;
  }

  try {
    const stored = window.localStorage.getItem(CONSENT_ID_STORAGE_KEY);
    if (stored) {
      return stored;
    }

    const id =
      typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
        ? crypto.randomUUID()
        : `consent_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    window.localStorage.setItem(CONSENT_ID_STORAGE_KEY, id);
    return id;
  } catch {
    return `consent_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 10)}`;
  }
}

function ensureStylesheet(): void {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById('klaro-stylesheet')) {
    return;
  }

  const link = document.createElement('link');
  link.id = 'klaro-stylesheet';
  link.rel = 'stylesheet';
  link.href = CMP_STYLE_HREF;
  document.head.appendChild(link);
}

function normalizeConsents(consents?: KlaroConsents): ConsentPreferences {
  const purposes = consents?.purposes ?? {};

  return {
    necessary: true,
    analytics: purposes.analytics ?? false,
    marketing: purposes.marketing ?? false,
    advertising: purposes.advertising ?? false,
  };
}

function resolveManagerConsents(
  manager: KlaroManager | undefined
): KlaroConsents | undefined {
  if (!manager) {
    return undefined;
  }

  if (typeof manager.getConsents === 'function') {
    try {
      return manager.getConsents();
    } catch (error) {
      console.warn('Failed to read Klaro consents via getConsents()', error);
    }
  }

  if (typeof manager.getState === 'function') {
    const state = manager.getState();
    if (state?.consents) {
      return state.consents;
    }
  }

  if (manager.consents) {
    return manager.consents;
  }

  return undefined;
}

function buildKlaroConfig(locale: ConsentLocale): KlaroConfig {
  const translations = getTranslations();

  return {
    version: CMP_VERSION,
    elementID: 'klaro',
    storageMethod: 'localStorage',
    cookieName: 'tara-tarot-cmp',
    lang: locale,
    privacyPolicy: `/${locale}/legal/privacy-policy`,
    styling: {
      theme: ['dark', 'bottom'],
    },
    translations,
    purposes: {
      necessary: {
        title: translations[locale]?.purposes?.necessary?.title ?? 'Necessary',
        description:
          translations[locale]?.purposes?.necessary?.description ??
          'Required for the website to function.',
      },
      analytics: {
        title:
          translations[locale]?.purposes?.analytics?.title ?? 'Analytics & Performance',
        description:
          translations[locale]?.purposes?.analytics?.description ??
          'Helps us understand usage and improve the site.',
      },
      marketing: {
        title:
          translations[locale]?.purposes?.marketing?.title ?? 'Marketing',
        description:
          translations[locale]?.purposes?.marketing?.description ??
          'Enables personalised experiences and cross-channel measurement.',
      },
      advertising: {
        title:
          translations[locale]?.purposes?.advertising?.title ??
          'Advertising & Monetisation',
        description:
          translations[locale]?.purposes?.advertising?.description ??
          'Required for Google Ads and AdSense monetisation.',
      },
    },
    services: [
      {
        name: 'google-analytics',
        title: 'Google Analytics 4',
        purposes: ['analytics'],
        cookies: ['_ga', '_gid', '_ga_*'],
      },
      {
        name: 'google-ads',
        title: 'Google Ads & Consent Mode',
        purposes: ['advertising'],
        cookies: ['_gcl_au', '_gac_*'],
      },
      {
        name: 'google-adsense',
        title: 'Google AdSense',
        purposes: ['advertising'],
      },
      {
        name: 'meta-pixel',
        title: 'Meta Pixel & Conversion API',
        purposes: ['marketing', 'advertising'],
      },
    ],
  };
}

function getTranslations(): Record<
  ConsentLocale,
  Record<string, any>
> {
  return {
    en: {
      consentNotice: {
        title: 'Your privacy matters',
        description:
          'We use cookies to personalise content, measure traffic, and deliver ads. Choose which categories you allow. You can change your choice at any time.',
        learnMore: 'Manage preferences',
      },
      consentModal: {
        title: 'Privacy preferences',
        description:
          'Select the purposes we can use your data for. Necessary cookies are always active.',
      },
      purposes: {
        necessary: {
          title: 'Strictly necessary',
          description:
            'Essential for security, authentication, and basic features.',
        },
        analytics: {
          title: 'Analytics & Performance',
          description:
            'Helps us understand how visitors use the site so we can improve it.',
        },
        marketing: {
          title: 'Marketing',
          description:
            'Enables personalised communication across Meta properties.',
        },
        advertising: {
          title: 'Advertising & Monetisation',
          description:
            'Allows Google Ads and AdSense to deliver relevant advertising.',
        },
      },
      ok: 'Accept all',
      save: 'Save preferences',
      decline: 'Reject non-essential',
    },
    tr: {
      consentNotice: {
        title: 'Gizliliğiniz önemli',
        description:
          'İçeriği kişiselleştirmek, trafiği ölçmek ve reklam sunmak için çerezler kullanıyoruz. Hangi kategorilere izin vereceğinizi seçebilirsiniz. Tercihinizi dilediğiniz zamanda değiştirebilirsiniz.',
        learnMore: 'Tercihleri yönet',
      },
      consentModal: {
        title: 'Gizlilik tercihleri',
        description:
          'Verilerinizi hangi amaçlarla kullanabileceğimizi seçin. Zorunlu çerezler her zaman aktiftir.',
      },
      purposes: {
        necessary: {
          title: 'Zorunlu',
          description:
            'Güvenlik, kimlik doğrulama ve temel işlevler için gereklidir.',
        },
        analytics: {
          title: 'Analitik & Performans',
          description:
            'Siteyi nasıl kullandığınızı anlamamıza ve geliştirmemize yardımcı olur.',
        },
        marketing: {
          title: 'Pazarlama',
          description:
            'Meta kanallarında kişiselleştirilmiş iletişim sağlar.',
        },
        advertising: {
          title: 'Reklam & Gelir',
          description:
            'Google Ads ve AdSense üzerinden uygun reklamların sunulmasını sağlar.',
        },
      },
      ok: 'Tümünü kabul et',
      save: 'Tercihleri kaydet',
      decline: 'Gereksizleri reddet',
    },
    sr: {
      consentNotice: {
        title: 'Vaša privatnost je važna',
        description:
          'Koristimo kolačiće za personalizaciju sadržaja, merenje saobraćaja i prikaz oglasa. Izaberite koje kategorije dozvoljavate. Uvek možete promeniti odluku.',
        learnMore: 'Upravljaj podešavanjima',
      },
      consentModal: {
        title: 'Podešavanja privatnosti',
        description:
          'Odaberite svrhe za koje možemo koristiti vaše podatke. Neophodni kolačići su uvek aktivni.',
      },
      purposes: {
        necessary: {
          title: 'Neophodno',
          description:
            'Obezbeđuje sigurnost, autentifikaciju i osnovne funkcije.',
        },
        analytics: {
          title: 'Analitika & Performanse',
          description:
            'Pomaže nam da razumemo kako koristite sajt i da ga unapredimo.',
        },
        marketing: {
          title: 'Marketing',
          description:
            'Omogućava personalizovanu komunikaciju na Meta platformama.',
        },
        advertising: {
          title: 'Oglasi & Monetizacija',
          description:
            'Dozvoljava Google Ads i AdSense servisima da prikazuju relevantne oglase.',
        },
      },
      ok: 'Prihvati sve',
      save: 'Sačuvaj podešavanja',
      decline: 'Odbij neophodne',
    },
  };
}

async function logConsentUpdate(
  state: ConsentState,
  preferences: ConsentPreferences
): Promise<void> {
  if (typeof window === 'undefined') {
    return;
  }

  if (!state.consentId) {
    return;
  }

  try {
    await fetch('/api/consent-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        consentId: state.consentId,
        locale: state.locale,
        version: state.version ?? CMP_VERSION,
        preferences,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch (error) {
    console.warn('Consent log request failed', error);
  }
}

interface CMPProviderProps {
  initialLocale?: ConsentLocale;
  children: React.ReactNode;
}

export function CMPProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: CMPProviderProps) {
  const [scriptRequested, setScriptRequested] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [locale, setLocale] = useState<ConsentLocale>(initialLocale);
  const consentStateRef = useRef<ConsentState>({
    ready: false,
    locale: initialLocale,
    preferences: DEFAULT_PREFERENCES,
    version: CMP_VERSION,
  });
  const lastLogSignature = useRef<string | null>(null);

  useEffect(() => {
    registerConsentLocaleSetter(setLocale);
  }, []);

  useEffect(() => {
    ensureStylesheet();
    initGoogleConsentDefaults();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.klaroConfig = buildKlaroConfig(locale);
    updateConsentState({
      locale,
      version: CMP_VERSION,
    });

    if (!scriptRequested) {
      setScriptRequested(true);
    } else {
      window.klaro?.setConfig?.(window.klaroConfig as KlaroConfig);
      window.klaro?.setLanguage?.(locale);
      window.klaro?.getManager?.()?.update?.();
    }
  }, [locale, scriptRequested]);

  useEffect(() => {
    if (!scriptLoaded || typeof window === 'undefined') {
      return;
    }

    const consentId = createConsentId();
    updateConsentState({
      consentId,
    });

    const manager = window.klaro?.getManager?.();
    if (!manager) {
      return;
    }

    const apply = () => {
      const consents = resolveManagerConsents(manager);
      if (!consents) {
        console.warn('Klaro manager consents unavailable, falling back to defaults');
      }
      const normalized = normalizeConsents(consents);
      setConsentPreferences(normalized);
      updateConsentState({
        preferences: normalized,
      });
      consentStateRef.current = {
        ...consentStateRef.current,
        ready: true,
        locale,
        version: CMP_VERSION,
        consentId,
        preferences: normalized,
      };
      applyGoogleConsent(normalized);
      applyMetaConsent(normalized);
      markConsentReady(true);

      const signature = JSON.stringify({
        consentId,
        locale,
        preferences: normalized,
      });

      if (signature !== lastLogSignature.current) {
        lastLogSignature.current = signature;
        void logConsentUpdate(consentStateRef.current, normalized);
      }
    };

    apply();
    const watcherId = manager.watch(apply);

    setConsentManagerControls({
      openManager: () => window.klaro?.show?.(),
      showPreferences: () => window.klaro?.show?.('config'),
    });

    return () => {
      manager.removeWatcher?.(watcherId);
    };
  }, [scriptLoaded, locale]);

  const scripts = useMemo(() => {
    if (!scriptRequested) {
      return null;
    }

    return (
      <Script
        id='klaro-script'
        src={CMP_SCRIPT_SRC}
        strategy='afterInteractive'
        onLoad={() => setScriptLoaded(true)}
      />
    );
  }, [scriptRequested]);

  return (
    <>
      {scripts}
      {children}
    </>
  );
}

