import { Redis } from '@upstash/redis';
import { defineSecret } from 'firebase-functions/params';

/**
 * Secrets for Upstash Redis.
 * Requires firebase functions:secrets:set UPSTASH_REDIS_REST_URL
 * and firebase functions:secrets:set UPSTASH_REDIS_REST_TOKEN
 */
const upstashUrl = defineSecret('UPSTASH_REDIS_REST_URL');
const upstashToken = defineSecret('UPSTASH_REDIS_REST_TOKEN');

/**
 * RedisCacheService: Implementation of Redis-backed TTL caching.
 * Leverages Upstash REST SDK for serverless-native performance in Cloud Functions.
 */
export class RedisCacheService {
  private static instance: Redis;

  private static get client(): Redis {
    if (!this.instance) {
      this.instance = new Redis({
        url: upstashUrl.value(),
        token: upstashToken.value(),
      });
    }
    return this.instance;
  }

  /**
   * get: Retrieves a value from Redis.
   */
  static async get<T>(key: string): Promise<T | null> {
    try {
      return await this.client.get<T>(key);
    } catch (error) {
      console.error('[RedisCache] Get error:', error);
      return null;
    }
  }

  /**
   * set: Stores a value with a specific TTL (in seconds).
   */
  static async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await this.client.set(key, value, { ex: ttlSeconds });
    } catch (error) {
      console.error('[RedisCache] Set error:', error);
    }
  }

  /**
   * checkCache: Unified method to check platform/user cache.
   */
  static async checkCache<T>(platform: string, userId: string): Promise<T | null> {
    const key = `nekt:cache:${platform}:${userId}`;
    return this.get<T>(key);
  }

  /**
   * setCache: Unified method to set platform/user cache.
   */
  static async setCache(platform: string, userId: string, data: unknown, ttlSeconds: number): Promise<void> {
    const key = `nekt:cache:${platform}:${userId}`;
    await this.set(key, data, ttlSeconds);
  }
}
