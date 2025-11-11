/**
 * Translation Cache for Email Service
 * 
 * In-memory cache for translation files to avoid reading from disk
 * on every email generation. Reduces I/O operations significantly.
 */

class TranslationCache {
  private static cache: Map<string, any> = new Map();
  private static cacheTime: Map<string, number> = new Map();
  private static readonly TTL = 5 * 60 * 1000; // 5 dakika

  /**
   * Get cached translation data for a locale
   */
  static get(locale: string): any | null {
    const cached = this.cache.get(locale);
    const cachedTime = this.cacheTime.get(locale);

    if (cached && cachedTime && Date.now() - cachedTime < this.TTL) {
      return cached;
    }

    // Cache expired or not found
    if (cached) {
      // Remove expired cache
      this.cache.delete(locale);
      this.cacheTime.delete(locale);
    }

    return null;
  }

  /**
   * Set translation data in cache
   */
  static set(locale: string, data: any): void {
    this.cache.set(locale, data);
    this.cacheTime.set(locale, Date.now());
  }

  /**
   * Clear cache for a specific locale
   */
  static clear(locale: string): void {
    this.cache.delete(locale);
    this.cacheTime.delete(locale);
  }

  /**
   * Clear all cache
   */
  static clearAll(): void {
    this.cache.clear();
    this.cacheTime.clear();
  }

  /**
   * Get cache statistics (for debugging)
   */
  static getStats(): {
    cachedLocales: string[];
    cacheSize: number;
  } {
    return {
      cachedLocales: Array.from(this.cache.keys()),
      cacheSize: this.cache.size,
    };
  }
}

export default TranslationCache;

