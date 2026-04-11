import * as admin from 'firebase-admin';

/**
 * CacheService: Handles API rate-limiting and persistence for social data.
 * Adheres to 2026 standards for serverless caching using Firestore as a 
 * distributed cache layer to handle platform-wide rate limits.
 */
export class CacheService {
  private static CACHE_COLLECTION = 'omni_cache';

  /**
   * Retrieves a cached value if it hasn't expired.
   */
  async get<T>(key: string): Promise<T | null> {
    const doc = await admin.firestore().collection(CacheService.CACHE_COLLECTION).doc(key).get();
    
    if (!doc.exists) return null;

    const data = doc.data();
    const now = Date.now();

    if (data?.expiresAt && data.expiresAt < now) {
      console.log(`[Cache] Key expired: ${key}`);
      // Asynchronous cleanup: don't block the retrieval
      doc.ref.delete().catch(err => console.error('Cache cleanup error:', err));
      return null;
    }

    return data?.content as T;
  }

  /**
   * Stores a value in the cache with a specific TTL.
   */
  async set(key: string, content: unknown, ttlMs: number): Promise<void> {
    const expiresAt = Date.now() + ttlMs;
    await admin.firestore().collection(CacheService.CACHE_COLLECTION).doc(key).set({
      content,
      expiresAt,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }

  /**
   * Generates a stable cache key based on account and platform parameters.
   */
  generateKey(platform: string, userId: string, params = ''): string {
    return `${platform}_${userId}_${params}`;
  }

  /**
   * checkCache: High-level convenience method to verify and retrieve 
   * platform-specific cached data for a user.
   */
  async checkCache<T>(platform: string, userId: string): Promise<T | null> {
    const key = this.generateKey(platform, userId);
    return this.get<T>(key);
  }
}
