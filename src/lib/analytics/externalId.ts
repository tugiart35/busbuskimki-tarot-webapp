/**
 * Client-side utility for generating and managing persistent user identifiers.
 * Used for Meta CAPI external_id to improve event matching quality.
 */

const STORAGE_KEY = 'meta_external_id';
const ID_PREFIX = 'guest_';

/**
 * Gets or creates a persistent external ID for the current user.
 * For authenticated users, returns their userId.
 * For guest users, generates and stores a persistent ID in localStorage.
 * 
 * @param userId - Optional authenticated user ID
 * @returns Persistent external ID
 */
export function getOrCreateExternalId(userId?: string | null): string {
    // If user is authenticated, use their userId
    if (userId) {
        return userId;
    }

    // For guest users, check localStorage for existing ID
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            let existingId = localStorage.getItem(STORAGE_KEY);

            if (existingId) {
                return existingId;
            }

            // Generate new persistent ID for guest user
            const timestamp = Date.now();
            const random = Math.random().toString(36).substring(2, 15);
            const newId = `${ID_PREFIX}${timestamp}_${random}`;

            localStorage.setItem(STORAGE_KEY, newId);
            return newId;
        } catch (error) {
            // If localStorage is not available (privacy mode, etc.), generate session-only ID
            console.warn('localStorage not available, using session-only ID:', error);
        }
    }

    // Fallback: generate session-only ID
    return `${ID_PREFIX}session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
}

/**
 * Clears the stored external ID (useful for logout or privacy compliance).
 */
export function clearExternalId(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.warn('Failed to clear external ID:', error);
        }
    }
}
