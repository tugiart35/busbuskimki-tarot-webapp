import FingerprintJS from '@fingerprintjs/fingerprintjs';

let fingerprintPromise: Promise<string> | null = null;

/**
 * Get browser fingerprint for anonymous user tracking
 * Uses FingerprintJS to generate a unique identifier
 */
export async function getFingerprint(): Promise<string> {
  // Return cached promise if already initializing/initialized
  if (fingerprintPromise) {
    return fingerprintPromise;
  }

  fingerprintPromise = (async () => {
    try {
      // Initialize FingerprintJS
      const fp = await FingerprintJS.load();

      // Get visitor identifier
      const result = await fp.get();

      return result.visitorId;
    } catch (error) {
      console.error('Error generating fingerprint:', error);

      // Fallback to a simple client-side ID stored in localStorage
      const fallbackKey = 'user_fallback_id';
      let fallbackId = localStorage.getItem(fallbackKey);

      if (!fallbackId) {
        fallbackId = `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        localStorage.setItem(fallbackKey, fallbackId);
      }

      return fallbackId;
    }
  })();

  return fingerprintPromise;
}

/**
 * Reset fingerprint cache (useful for testing)
 */
export function resetFingerprint() {
  fingerprintPromise = null;
}
