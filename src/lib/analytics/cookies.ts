/**
 * Cookie helpers for Meta Pixel integrations.
 * These helpers are client-side only and will no-op during SSR.
 */

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null;
  }

  const escapedName = name.replace(/([.*+?^${}()|\[\]\\])/g, '\\$1');
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${escapedName}=([^;]*)`)
  );

  if (!match || match[1] === undefined) {
    return null;
  }

  return decodeURIComponent(match[1]);
}

export function getMetaCookieValues(): {
  fbp: string | null;
  fbc: string | null;
} {
  return {
    fbp: getCookie('_fbp'),
    fbc: getCookie('_fbc'),
  };
}

/**
 * Ensures `_fbc` cookie is set when fbclid is present in the URL.
 * Returns the `_fbc` value if available/created, otherwise null.
 */
export function ensureMetaClickId(): string | null {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return null;
  }

  const existingFbc = getCookie('_fbc');
  // If already have _fbc and no fbclid in URL, keep existing value
  const params = new URLSearchParams(window.location.search);
  const fbclid = params.get('fbclid');
  if (!fbclid) {
    return existingFbc;
  }

  // If fbclid exists but _fbc missing, create one in Meta format
  if (!existingFbc) {
    const newFbc = `fb.1.${Date.now()}.${fbclid}`;
    // 90 days expiry similar to Meta defaults
    const maxAgeSeconds = 60 * 60 * 24 * 90;
    document.cookie = `_fbc=${newFbc}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax`;
    return newFbc;
  }

  return existingFbc;
}
