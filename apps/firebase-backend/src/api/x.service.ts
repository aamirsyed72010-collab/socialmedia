import { NektNode } from '@omni-nexus/shared-models';
import { normalizeToNekt } from '@omni-nexus/shared-normalizers';
import { RedisCacheService } from '../cache/redis.service';
import { getSecrets } from '../utils/secrets';

export class XService {

  /**
   * fetchUserFeed: Ingests X (Twitter) v2 timeline data.
   * Leverages distributed caching to protect against strict X rate limits.
   */
  async fetchUserFeed(userId: string): Promise<NektNode[]> {
    const cachedData = await RedisCacheService.checkCache<NektNode[]>('x', userId);

    if (cachedData) {
      console.log(`[XService] Cache hit for user: ${userId}`);
      return cachedData;
    }

    const { x: _x } = getSecrets();
    console.log(`[XService] Cache miss. Fetching from X v2 API.`);

    // Placeholder for actual X API Call
    const rawTweets: unknown[] = [];
    const normalized = (rawTweets as any[]).map(t => normalizeToNekt('x', t));

    // X has very tight rate limits, so we cache for 20 mins (1200s)
    await RedisCacheService.setCache('x', userId, normalized, 1200);

    return normalized;
  }
}
