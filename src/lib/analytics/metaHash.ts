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

/**
 * Hashes phone number for Meta CAPI in E.164 format.
 * Meta requires phone numbers with country code for proper matching.
 * 
 * @param phone - Phone number (may include formatting)
 * @param countryCode - Country code with + prefix (e.g., '+90')
 * @returns Hashed phone number in E.164 format, or undefined if invalid
 */
export function hashPhoneForMeta(
  phone?: string | null,
  countryCode?: string | null
): string | undefined {
  if (!phone) {
    return undefined;
  }

  // Remove all non-digit characters from phone
  const digitsOnly = phone.replace(/\D/g, '');
  if (!digitsOnly) {
    return undefined;
  }

  // If country code is provided, ensure it's included
  let e164Phone = digitsOnly;

  if (countryCode) {
    // Remove + and any non-digits from country code
    const countryDigits = countryCode.replace(/\D/g, '');

    // If phone doesn't start with country code, prepend it
    if (countryDigits && !digitsOnly.startsWith(countryDigits)) {
      e164Phone = countryDigits + digitsOnly;
    }
  }

  return hashForMeta(e164Phone);
}

