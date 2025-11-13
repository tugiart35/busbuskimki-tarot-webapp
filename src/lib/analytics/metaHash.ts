import crypto from 'crypto';

/**
 * Normalizes and hashes data according to Meta's Conversions API requirements.
 * Returns undefined when the provided value is empty after normalization.
 */
export function hashForMeta(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }

  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export function hashPhoneForMeta(value?: string | null): string | undefined {
  if (!value) {
    return undefined;
  }

  const digitsOnly = value.replace(/\D/g, '');
  if (!digitsOnly) {
    return undefined;
  }

  return hashForMeta(digitsOnly);
}

