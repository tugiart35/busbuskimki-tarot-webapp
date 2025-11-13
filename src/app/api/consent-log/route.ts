import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import crypto from 'crypto';
import { logger } from '@/lib/logger';

const CONSENT_SCHEMA = z.object({
  consentId: z.string().min(8),
  locale: z.enum(['tr', 'en', 'sr']),
  version: z.number().int().min(1),
  preferences: z.object({
    necessary: z.boolean(),
    analytics: z.boolean(),
    marketing: z.boolean(),
    advertising: z.boolean(),
  }),
  timestamp: z
    .string()
    .refine(value => !Number.isNaN(Date.parse(value)), 'Invalid timestamp'),
});

function createHash(value: string): string {
  const salt = process.env.CONSENT_IP_SALT || '';
  return crypto.createHash('sha256').update(`${value}|${salt}`).digest('hex');
}

export async function POST(request: Request) {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Server misconfiguration' },
      { status: 500 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid JSON payload' },
      { status: 400 }
    );
  }

  const parseResult = CONSENT_SCHEMA.safeParse(payload);

  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parseResult.error.flatten() },
      { status: 422 }
    );
  }

  const data = parseResult.data;

  const ip =
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    null;
  const clientIp =
    ip
      ?.split(',')
      .map(part => part.trim())
      .find(Boolean) ?? null;
  const hashedIp = clientIp ? createHash(clientIp) : null;
  const userAgent = request.headers.get('user-agent') || null;
  const region = request.headers.get('x-vercel-ip-country') || null;

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

  const { error } = await supabaseAdmin.from('consent_logs').insert({
    consent_id: data.consentId,
    locale: data.locale,
    version: data.version,
    preferences: data.preferences,
    recorded_at: data.timestamp,
    hashed_ip: hashedIp,
    user_agent: userAgent,
    region,
  });

  if (error) {
    logger.error('Failed to persist consent log', error, {
      action: 'consent_log_insert',
      resource: 'consent_logs',
    });
    return NextResponse.json(
      { error: 'Failed to persist consent log' },
      { status: 500 }
    );
  }

  return NextResponse.json({ status: 'ok' });
}
