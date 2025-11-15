import { logger } from '@/lib/logger';
import { hashForMeta, hashPhoneForMeta } from './metaHash';

export interface MetaPixelPayload {
  eventId: string;
  eventTime?: number;
  eventSourceUrl?: string;
  fbp?: string | null;
  fbc?: string | null;
  contentName?: string;
  customData?: Record<string, unknown>;
}

interface MetaLeadPersonalInfo {
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  birthDate?: string;
  birthDateUnknown?: boolean;
  relationshipStatus?: string;
}

interface MetaLeadPartnerInfo {
  name?: string;
  birthDate?: string;
  birthDateUnknown?: boolean;
}

interface SendMetaLeadEventOptions {
  pixel: MetaPixelPayload;
  personalInfo?: MetaLeadPersonalInfo | null;
  partnerInfo?: MetaLeadPartnerInfo | null;
  communicationMethod?: 'email' | 'whatsapp';
  clientIp?: string | null;
  userAgent?: string | null;
}

const META_EVENT_NAME = 'Lead';
const META_ACTION_SOURCE = 'website';
const DEFAULT_CONTENT_NAME = 'Tarot Lead';
const DEFAULT_CURRENCY = 'TRY';
const DEFAULT_VALUE = 0;

const META_API_VERSION = 'v18.0';

export async function sendMetaLeadEvent({
  pixel,
  personalInfo,
  partnerInfo,
  communicationMethod,
  clientIp,
  userAgent,
}: SendMetaLeadEventOptions): Promise<void> {
  const pixelId =
    process.env.META_PIXEL_ID || process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;

  if (!pixelId || !accessToken || !pixel?.eventId) {
    return;
  }

  try {
    const eventTime = pixel.eventTime ?? Math.floor(Date.now() / 1000);
    const eventSourceUrl =
      pixel.eventSourceUrl || process.env.NEXT_PUBLIC_SITE_URL || undefined;

    const emailHash = hashForMeta(personalInfo?.email);
    const phoneHash = hashPhoneForMeta(personalInfo?.phone);
    const firstNameHash = hashForMeta(personalInfo?.name);
    const lastNameHash = hashForMeta(personalInfo?.surname);
    const birthDateValue =
      personalInfo?.birthDate && !personalInfo.birthDateUnknown
        ? personalInfo.birthDate.replace(/\D/g, '')
        : undefined;
    const birthDateHash = hashForMeta(birthDateValue);
    const countryHash = hashForMeta(personalInfo?.countryCode);

    const userData: Record<string, unknown> = {};

    if (emailHash) {
      userData.em = [emailHash];
    }

    if (phoneHash) {
      userData.ph = [phoneHash];
    }

    if (firstNameHash) {
      userData.fn = firstNameHash;
    }

    if (lastNameHash) {
      userData.ln = lastNameHash;
    }

    if (birthDateHash) {
      userData.db = birthDateHash;
    }

    if (countryHash) {
      userData.country = countryHash;
    }

    if (pixel.fbp) {
      userData.fbp = pixel.fbp;
    }

    if (pixel.fbc) {
      userData.fbc = pixel.fbc;
    }

    if (clientIp) {
      userData.client_ip_address = clientIp;
    }

    if (userAgent) {
      userData.client_user_agent = userAgent;
    }

    const customData: Record<string, unknown> = {
      currency: DEFAULT_CURRENCY,
      value: DEFAULT_VALUE,
      ...(pixel.customData || {}),
    };

    if (customData['content_name'] === undefined) {
      customData['content_name'] = pixel.contentName || DEFAULT_CONTENT_NAME;
    }

    if (customData['content_category'] === undefined) {
      customData['content_category'] = communicationMethod;
    }

    if (customData['relationship_status'] === undefined) {
      customData['relationship_status'] = personalInfo?.relationshipStatus;
    }

    if (partnerInfo?.name) {
      customData.partner_name = partnerInfo.name;
    }

    if (
      partnerInfo?.birthDate &&
      !partnerInfo.birthDateUnknown &&
      partnerInfo.birthDate.trim()
    ) {
      customData.partner_birth_date = partnerInfo.birthDate;
    }

    const payload: Record<string, unknown> = {
      data: [
        {
          event_name: META_EVENT_NAME,
          event_time: eventTime,
          action_source: META_ACTION_SOURCE,
          event_source_url: eventSourceUrl,
          event_id: pixel.eventId,
          user_data: userData,
          custom_data: customData,
        },
      ],
    };

    const testEventCode = process.env.META_TEST_EVENT_CODE;
    if (testEventCode) {
      payload.test_event_code = testEventCode;
    }

    const response = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => undefined);
      logger.warn('Meta CAPI response is not ok', {
        status: response.status,
        statusText: response.statusText,
        errorPayload,
      });
    }
  } catch (error) {
    logger.warn('Meta CAPI lead event failed', error);
  }
}

