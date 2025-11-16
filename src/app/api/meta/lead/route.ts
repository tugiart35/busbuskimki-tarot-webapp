import { NextRequest, NextResponse } from 'next/server';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  sendMetaLeadEvent,
  type MetaPixelPayload,
} from '@/lib/analytics/metaCapi';
import type { ConsentPreferences } from '@/lib/consent/types';
import { logger } from '@/lib/logger';

interface ConsentSnapshot {
  consentId: string;
  version?: number;
  preferences?: ConsentPreferences;
}

interface LeadRequestBody {
  metaPixel?: MetaPixelPayload;
  personalInfo?: {
    name?: string;
    surname?: string;
    email?: string;
    phone?: string;
    countryCode?: string;
    birthDate?: string;
    birthDateUnknown?: boolean;
    relationshipStatus?: string;
    externalId?: string;
    city?: string;
    state?: string;
    zip?: string;
  } | null;
  partnerInfo?: {
    name?: string;
    birthDate?: string;
    birthDateUnknown?: boolean;
  } | null;
  communicationMethod?: 'email' | 'whatsapp';
  consent?: ConsentSnapshot;
}

function extractClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(',');
    if (firstIp && firstIp.trim()) {
      return firstIp.trim();
    }
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  // Next.js may expose request.ip depending on runtime
  // @ts-expect-error - not yet typed on NextRequest
  return typeof request.ip === 'string' ? request.ip : null;
}

async function resolveConsentPreferences(
  supabaseAdmin: SupabaseClient,
  snapshot?: ConsentSnapshot
): Promise<ConsentPreferences | undefined> {
  if (!snapshot?.consentId) {
    return snapshot?.preferences;
  }

  const { data, error } = await supabaseAdmin
    .from('consent_logs')
    .select('preferences')
    .eq('consent_id', snapshot.consentId)
    .order('recorded_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    logger.warn('Consent log lookup failed', error, {
      action: 'fetch_latest_consent',
      metadata: { consentId: snapshot.consentId },
    });
    return snapshot.preferences;
  }

  const preferences =
    (data?.preferences as ConsentPreferences | undefined) ??
    snapshot.preferences;

  return preferences;
}

async function determineMetaConsent(
  supabaseAdmin: SupabaseClient,
  snapshot?: ConsentSnapshot
): Promise<boolean> {
  try {
    const preferences = await resolveConsentPreferences(
      supabaseAdmin,
      snapshot
    );
    if (!preferences) {
      return false;
    }
    return Boolean(preferences.marketing || preferences.advertising);
  } catch (error) {
    logger.warn('Meta consent resolution failed', error, {
      action: 'resolve_meta_consent',
    });
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as LeadRequestBody;
    const {
      metaPixel,
      personalInfo,
      partnerInfo,
      communicationMethod,
      consent,
    } = body;

    if (!metaPixel?.eventId) {
      return NextResponse.json(
        { success: false, error: 'meta_pixel_missing' },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const consentAllowsMeta = await determineMetaConsent(
      supabaseAdmin,
      consent
    );
    if (!consentAllowsMeta) {
      logger.info('Meta CAPI skipped due to missing consent (auth flow)', {
        action: 'meta_capi_lead_event_skipped',
        resource: 'meta_lead',
        metadata: {
          consentId: consent?.consentId ?? null,
        },
      });
      return NextResponse.json({
        success: false,
        skipped: true,
        reason: 'consent',
      });
    }

    const clientIp = extractClientIp(request);
    const userAgent = request.headers.get('user-agent') || null;

    // Ensure communicationMethod is not undefined
    if (communicationMethod === undefined) {
      return NextResponse.json(
        { success: false, error: 'communication_method_missing' },
        { status: 400 }
      );
    }

    await sendMetaLeadEvent({
      pixel: metaPixel,
      personalInfo: personalInfo ?? null,
      partnerInfo: partnerInfo ?? null,
      communicationMethod, // Now guaranteed to be 'email' or 'whatsapp'
      clientIp,
      userAgent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.warn('Meta lead endpoint failed', error, {
      action: 'meta_lead_event',
      resource: 'meta_lead',
    });
    return NextResponse.json(
      { success: false, error: 'meta_lead_failed' },
      { status: 500 }
    );
  }
}
