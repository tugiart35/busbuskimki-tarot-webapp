'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  markConsentReady,
  registerConsentLocaleSetter,
  setConsentManagerControls,
  setConsentPreferences,
  updateConsentState,
} from '@/lib/consent/store';
import {
  applyGoogleConsent,
  initGoogleConsentDefaults,
} from '@/lib/consent/googleConsentBridge';
import { applyMetaConsent } from '@/lib/consent/metaConsentBridge';
import type {
  ConsentLocale,
  ConsentPreferences,
  ConsentState,
} from '@/lib/consent/types';
import { logger } from '@/lib/logger';

const CMP_VERSION = 2;
const CONSENT_ID_STORAGE_KEY = 'tara-tarot.consent-id';
const CONSENT_STORAGE_KEY = 'tara-tarot.consent.v2';

const DEFAULT_LOCALE: ConsentLocale = 'en';

const DEFAULT_PREFERENCES: ConsentPreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  advertising: false,
};

type OptionalPurpose = 'analytics' | 'marketing' | 'advertising';

interface StoredConsent {
  id: string;
  version: number;
  locale: ConsentLocale;
  preferences: ConsentPreferences;
  timestamp: string;
}

type ConsentView = 'notice' | 'preferences';

function detectLocaleFromPath(pathname: string): ConsentLocale | null {
  const segment = pathname.split('/')[1];
  if (segment === 'tr' || segment === 'en' || segment === 'sr') {
    return segment;
  }
  return null;
}

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
    return `consent_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  }
}

function loadStoredConsent(): StoredConsent | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as StoredConsent | undefined;
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    if (parsed.version !== CMP_VERSION) {
      return null;
    }

    if (
      !parsed.id ||
      !parsed.preferences ||
      typeof parsed.locale !== 'string' ||
      typeof parsed.timestamp !== 'string'
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function persistStoredConsent(consent: StoredConsent): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Ignore persistence failures (e.g. Safari private mode)
  }
}

function getTranslations(): Record<
  ConsentLocale,
  {
    consentNotice: {
      title: string;
      description: string;
      learnMore: string;
    };
    consentModal: {
      title: string;
      description: string;
    };
    purposes: Record<
      keyof ConsentPreferences,
      {
        title: string;
        description: string;
      }
    >;
    ok: string;
    save: string;
    decline: string;
  }
> {
  return {
    en: {
      consentNotice: {
        title: 'We honour your privacy',
        description:
          'We use cookies to personalise your Büşbüşkimki journey, understand traffic, and support respectful ads. Choose the energy you welcome—you can return and adjust it whenever your path shifts.',
        learnMore: 'Adjust preferences',
      },
      consentModal: {
        title: 'Tune your privacy',
        description:
          'Select the intentions we may use while essential cookies stay active to keep the site secure and flowing.',
      },
      purposes: {
        necessary: {
          title: 'Always on',
          description:
            'Keeps the site safe, signs you in, and remembers essential settings.',
        },
        analytics: {
          title: 'Insight & clarity',
          description:
            'Helps us understand which readings resonate so we can improve your experience.',
        },
        marketing: {
          title: 'Sacred whispers',
          description:
            'Lets us share personalised messages across Meta spaces when you invite them.',
        },
        advertising: {
          title: 'Abundance & support',
          description:
            'Allows respectful ads (Google Ads & AdSense) that help Büşbüşkimki stay sustainable.',
        },
      },
      ok: 'Accept all',
      save: 'Save choices',
      decline: 'Reject non-essential',
    },
    tr: {
      consentNotice: {
        title: 'Mahremiyetinize özen gösteriyoruz',
        description:
          'Büşbüşkimki yolculuğunuzu yumuşatmak, trafiği anlamak ve ölçülü reklamlar sunmak için çerezler kullanıyoruz. Hangi enerjilere izin vereceğinizi seçin; yolunuz değiştiğinde dilediğiniz an güncelleyebilirsiniz.',
        learnMore: 'Tercihleri düzenle',
      },
      consentModal: {
        title: 'Gizlilik ayarını seç',
        description:
          'Sitenin güvenle çalışması için gerekli çerezler açık kalırken hangi amaçlara onay verdiğinizi belirleyin.',
      },
      purposes: {
        necessary: {
          title: 'Her zaman açık',
          description:
            'Siteyi güvenli tutar, giriş yapmanızı sağlar ve temel ayarları hatırlar.',
        },
        analytics: {
          title: 'İçgörü ve akış',
          description:
            'Hangi içeriklerin yankılandığını görüp deneyiminizi iyileştirmemize yardımcı olur.',
        },
        marketing: {
          title: 'Şifacı mesajlar',
          description:
            'Meta kanallarında size özel davetler ve mesajlar paylaşmamızı sağlar.',
        },
        advertising: {
          title: 'Bereketli destek',
          description:
            'Büşbüşkimki’nin sürdürülebilir kalması için ölçülü Google Ads ve AdSense reklamlarını etkinleştirir.',
        },
      },
      ok: 'Hepsini kabul et',
      save: 'Tercihleri kaydet',
      decline: 'Gereksizleri reddet',
    },
    sr: {
      consentNotice: {
        title: 'Poštujemo vašu privatnost',
        description:
          'Koristimo kolačiće da uskladimo vaše Büşbüşkimki putovanje, razumemo saobraćaj i prikažemo pažljivo odabrane oglase. Izaberite energiju koju prihvatate – odluku možete promeniti kad god poželite.',
        learnMore: 'Podesi preferencije',
      },
      consentModal: {
        title: 'Prilagodite privatnost',
        description:
          'Odaberite svrhe koje su vam udobne dok neophodni kolačići ostaju aktivni radi bezbednog sajta.',
      },
      purposes: {
        necessary: {
          title: 'Uvek aktivno',
          description:
            'Održava sajt bezbednim, pamti prijave i osnovna podešavanja.',
        },
        analytics: {
          title: 'Uvid i jasnoća',
          description:
            'Pomaže nam da razumemo koji sadržaj vas inspiriše kako bismo poboljšali iskustvo.',
        },
        marketing: {
          title: 'Isceljujuće poruke',
          description:
            'Omogućava personalizovane poruke na Meta platformama kada to dozvolite.',
        },
        advertising: {
          title: 'Podrška i obilje',
          description:
            'Uključuje pažljivo birane oglase (Google Ads i AdSense) koji pomažu Büşbüşkimki priču da živi.',
        },
      },
      ok: 'Prihvati sve',
      save: 'Sačuvaj izbor',
      decline: 'Odbij neesencijalne',
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
    logger.warn('Consent log request failed', error, {
      action: 'consent_log',
      resource: 'consent-dialog',
    });
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
  const [locale, setLocale] = useState<ConsentLocale>(initialLocale);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [dialogView, setDialogView] = useState<ConsentView>('notice');
  const [isHydrated, setHydrated] = useState(false);
  const [pendingPreferences, setPendingPreferences] =
    useState<ConsentPreferences>(DEFAULT_PREFERENCES);

  const translations = useMemo(() => getTranslations(), []);

  const consentStateRef = useRef<ConsentState>({
    ready: false,
    locale: initialLocale,
    preferences: DEFAULT_PREFERENCES,
    version: CMP_VERSION,
  });

  const consentIdRef = useRef<string | null>(null);
  const lastLogSignature = useRef<string | null>(null);

  useEffect(() => {
    registerConsentLocaleSetter(setLocale);
  }, []);

  useEffect(() => {
    initGoogleConsentDefaults();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const detected =
      detectLocaleFromPath(window.location.pathname) ?? initialLocale;
    if (detected !== locale) {
      setLocale(detected);
    }
  }, [initialLocale, locale]);

  const openConsent = useCallback((view: ConsentView = 'notice') => {
    setPendingPreferences(consentStateRef.current.preferences);
    setDialogView(view);
    setDialogOpen(true);
  }, []);

  useEffect(() => {
    setConsentManagerControls({
      openManager: () => openConsent('notice'),
      showPreferences: () => openConsent('preferences'),
    });
  }, [openConsent]);

  const applyConsent = useCallback(
    (
      preferences: ConsentPreferences,
      options: { persist?: boolean; log?: boolean } = {}
    ) => {
      const consentId =
        consentIdRef.current ?? (consentIdRef.current = createConsentId());

      const nextState: ConsentState = {
        ready: true,
        locale,
        preferences,
        version: CMP_VERSION,
        consentId,
      };

      consentStateRef.current = nextState;
      setConsentPreferences(preferences);
      updateConsentState(nextState);
      applyGoogleConsent(preferences);
      applyMetaConsent(preferences);
      markConsentReady(true);

      if (options.persist !== false) {
        persistStoredConsent({
          id: consentId,
          locale,
          preferences,
          version: CMP_VERSION,
          timestamp: new Date().toISOString(),
        });
      }

      const signature = JSON.stringify({
        consentId,
        locale,
        preferences,
        version: CMP_VERSION,
      });

      if (options.log !== false && signature !== lastLogSignature.current) {
        lastLogSignature.current = signature;
        void logConsentUpdate(nextState, preferences);
      }
    },
    [locale]
  );

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const stored = loadStoredConsent();
    const consentId = stored?.id ?? createConsentId();
    consentIdRef.current = consentId;

    const initialPreferences = stored?.preferences ?? DEFAULT_PREFERENCES;
    const isReady = Boolean(stored);

    consentStateRef.current = {
      ready: isReady,
      locale,
      preferences: initialPreferences,
      version: CMP_VERSION,
      consentId,
    };

    updateConsentState(consentStateRef.current);

    if (stored) {
      applyConsent(initialPreferences, {
        persist: false,
        log: false,
      });
      setPendingPreferences(initialPreferences);
      setDialogOpen(false);
    } else {
      markConsentReady(false);
      setPendingPreferences(DEFAULT_PREFERENCES);
      setDialogView('notice');
      setDialogOpen(true);
    }

    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyConsent]);

  useEffect(() => {
    consentStateRef.current = {
      ...consentStateRef.current,
      locale,
    };
    updateConsentState({
      locale,
    });
  }, [locale]);

  const handleAcceptAll = useCallback(() => {
    applyConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      advertising: true,
    });
    setDialogOpen(false);
  }, [applyConsent]);

  const handleRejectNonEssential = useCallback(() => {
    applyConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      advertising: false,
    });
    setDialogOpen(false);
  }, [applyConsent]);

  const handleSavePreferences = useCallback(
    (preferences: ConsentPreferences) => {
      applyConsent(preferences);
      setDialogOpen(false);
    },
    [applyConsent]
  );

  const handleShowPreferences = useCallback(() => {
    setDialogView('preferences');
  }, []);

  const handleBackToNotice = useCallback(() => {
    setDialogView('notice');
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  return (
    <>
      {children}
      {isHydrated && (
        <ConsentDialog
          isOpen={isDialogOpen}
          view={dialogView}
          locale={locale}
          translations={translations}
          preferences={pendingPreferences}
          onUpdatePreferences={setPendingPreferences}
          onAcceptAll={handleAcceptAll}
          onRejectNonEssential={handleRejectNonEssential}
          onSavePreferences={handleSavePreferences}
          onShowPreferences={handleShowPreferences}
          onBackToNotice={handleBackToNotice}
          onDismiss={handleCloseDialog}
        />
      )}
    </>
  );
}

interface ConsentDialogProps {
  isOpen: boolean;
  view: ConsentView;
  locale: ConsentLocale;
  translations: ReturnType<typeof getTranslations>;
  preferences: ConsentPreferences;
  onUpdatePreferences: (_next: ConsentPreferences) => void;
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onSavePreferences: (_preferences: ConsentPreferences) => void;
  onShowPreferences: () => void;
  onBackToNotice: () => void;
  onDismiss: () => void;
}

function ConsentDialog({
  isOpen,
  view,
  locale,
  translations,
  preferences,
  onUpdatePreferences,
  onAcceptAll,
  onRejectNonEssential,
  onSavePreferences,
  onShowPreferences,
  onBackToNotice,
  onDismiss,
}: ConsentDialogProps) {
  const strings = translations[locale] ?? translations.en;
  const [localPreferences, setLocalPreferences] =
    useState<ConsentPreferences>(preferences);

  useEffect(() => {
    if (isOpen) {
      setLocalPreferences(preferences);
    }
  }, [isOpen, preferences, view]);

  useEffect(() => {
    onUpdatePreferences(localPreferences);
  }, [localPreferences, onUpdatePreferences]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4'>
      <div className='w-full max-w-lg rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-white/10 shadow-2xl text-white overflow-hidden'>
        <div className='px-6 py-6 space-y-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 shadow-inner'>
              <span className='text-xl'>🕯️</span>
            </div>
            <div>
              <h2 className='text-xl font-semibold tracking-wide'>
                {view === 'notice'
                  ? strings.consentNotice.title
                  : strings.consentModal.title}
              </h2>
              <p className='text-sm text-white/70'>
                {view === 'notice'
                  ? strings.consentNotice.description
                  : strings.consentModal.description}
              </p>
            </div>
          </div>

          {view === 'notice' ? (
            <NoticeActions
              onAcceptAll={onAcceptAll}
              onRejectNonEssential={onRejectNonEssential}
              onShowPreferences={onShowPreferences}
              strings={strings}
            />
          ) : (
            <PreferencesView
              locale={locale}
              strings={strings}
              preferences={localPreferences}
              onPreferencesChange={setLocalPreferences}
              onAcceptAll={onAcceptAll}
              onSave={() => onSavePreferences(localPreferences)}
              onBack={onBackToNotice}
            />
          )}
        </div>

        <button
          type='button'
          onClick={onDismiss}
          className='w-full px-6 py-3 text-center text-sm text-white/60 hover:text-white/90 transition border-t border-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
        >
          ✨{' '}
          {locale === 'tr'
            ? 'Kararı sonra ver'
            : locale === 'sr'
              ? 'Sačuvaj odluku za kasnije'
              : 'Decide later'}
        </button>
      </div>
    </div>
  );
}

interface NoticeActionsProps {
  strings: ReturnType<typeof getTranslations>['en'];
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onShowPreferences: () => void;
}

function NoticeActions({
  strings,
  onAcceptAll,
  onRejectNonEssential,
  onShowPreferences,
}: NoticeActionsProps) {
  return (
    <div className='space-y-3'>
      <button
        type='button'
        onClick={onShowPreferences}
        className='w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/60 transition'
      >
        {strings.consentNotice.learnMore}
      </button>
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3'>
        <button
          type='button'
          onClick={onRejectNonEssential}
          className='flex-1 rounded-2xl border border-white/15 px-4 py-3 text-sm font-semibold text-white/70 hover:text-white hover:border-white/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
        >
          {strings.decline}
        </button>
        <button
          type='button'
          onClick={onAcceptAll}
          className='flex-1 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg hover:from-purple-300 hover:to-pink-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200/70'
        >
          {strings.ok}
        </button>
      </div>
    </div>
  );
}

interface PreferencesViewProps {
  locale: ConsentLocale;
  strings: ReturnType<typeof getTranslations>['en'];
  preferences: ConsentPreferences;
  onPreferencesChange: (_preferences: ConsentPreferences) => void;
  onAcceptAll: () => void;
  onSave: () => void;
  onBack: () => void;
}

function PreferencesView({
  locale,
  strings,
  preferences,
  onPreferencesChange,
  onAcceptAll,
  onSave,
  onBack,
}: PreferencesViewProps) {
  const optionalPurposes: OptionalPurpose[] = [
    'analytics',
    'marketing',
    'advertising',
  ];

  const toggle = (purpose: OptionalPurpose) => {
    onPreferencesChange({
      ...preferences,
      [purpose]: !preferences[purpose],
    });
  };

  return (
    <div className='space-y-4'>
      <div className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3'>
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-sm font-semibold text-white'>
              {strings.purposes.necessary.title}
            </p>
            <p className='text-xs text-white/70'>
              {strings.purposes.necessary.description}
            </p>
          </div>
          <div className='flex h-8 w-16 items-center justify-center rounded-xl bg-white/10 text-xs font-semibold text-white/70'>
            {locale === 'tr'
              ? 'Zorunlu'
              : locale === 'sr'
                ? 'Obavezno'
                : 'Required'}
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        {optionalPurposes.map(purpose => (
          <button
            key={purpose}
            type='button'
            className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
              preferences[purpose]
                ? 'border-purple-300/60 bg-purple-500/10 shadow-lg shadow-purple-500/10'
                : 'border-white/10 bg-white/5 hover:bg-white/10'
            }`}
            onClick={() => toggle(purpose)}
            aria-pressed={preferences[purpose]}
          >
            <div className='flex items-start justify-between gap-3'>
              <div>
                <p className='text-sm font-semibold text-white'>
                  {strings.purposes[purpose].title}
                </p>
                <p className='text-xs text-white/70'>
                  {strings.purposes[purpose].description}
                </p>
              </div>
              <span
                className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
                  preferences[purpose]
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400'
                    : 'bg-white/20'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
                    preferences[purpose] ? 'left-5' : 'left-0.5'
                  }`}
                />
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2'>
        <button
          type='button'
          onClick={onBack}
          className='w-full sm:w-auto rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-white/70 hover:text-white hover:border-white/40 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
        >
          {locale === 'tr' ? 'Geri dön' : locale === 'sr' ? 'Nazad' : 'Back'}
        </button>
        <div className='flex flex-1 flex-col sm:flex-row gap-3'>
          <button
            type='button'
            onClick={onAcceptAll}
            className='flex-1 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40'
          >
            {strings.ok}
          </button>
          <button
            type='button'
            onClick={onSave}
            className='flex-1 rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 px-4 py-3 text-sm font-semibold text-slate-950 shadow-lg hover:from-purple-300 hover:to-pink-300 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-200/70'
          >
            {strings.save}
          </button>
        </div>
      </div>
    </div>
  );
}
