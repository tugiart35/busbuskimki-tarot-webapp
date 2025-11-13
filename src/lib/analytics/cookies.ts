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
