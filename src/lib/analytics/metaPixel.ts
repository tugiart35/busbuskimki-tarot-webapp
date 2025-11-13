/**
 * Client-side helpers for interacting with the Meta Pixel.
 */

import { getConsentState } from '@/lib/consent/store';

interface TrackMetaLeadEventOptions {
  eventId: string;
  contentName?: string;
  value?: number;
  currency?: string;
  customData?: Record<string, unknown>;
}

const DEFAULT_LEAD_VALUE = 0;
const DEFAULT_LEAD_CURRENCY = 'TRY';

export function generateMetaEventId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `meta_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function trackMetaLeadEvent({
  eventId,
  contentName,
  value = DEFAULT_LEAD_VALUE,
  currency = DEFAULT_LEAD_CURRENCY,
  customData = {},
}: TrackMetaLeadEventOptions): void {
  if (typeof window === 'undefined') {
    return;
  }

  const state = getConsentState();
  const { marketing, advertising } = state.preferences;
  if (!marketing && !advertising) {
    return;
  }

  const fbq = (window as typeof window & { fbq?: (...args: unknown[]) => void })
    .fbq;

  if (!fbq) {
    return;
  }

  const eventData: Record<string, unknown> = {
    value,
    currency,
    ...customData,
  };

  if (contentName) {
    eventData.content_name = contentName;
  }

  fbq('track', 'Lead', eventData, {
    eventID: eventId,
  });
}

