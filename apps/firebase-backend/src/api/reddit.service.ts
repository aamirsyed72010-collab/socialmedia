import * as jwt from 'jsonwebtoken';
import { NektNode } from '@omni-nexus/shared-models';
import { normalizeToNekt } from '@omni-nexus/shared-normalizers';
import { RedisCacheService } from '../cache/redis.service';
import { getSecrets } from '../utils/secrets';

export class RedditService {

  /**
   * Generates a signed state token for secure OAuth flow.
   * Uses REDDIT_CLIENT_SECRET from Secret Manager.
   */
  static generateStateToken(userId: string): string {
    const { reddit } = getSecrets();
    return jwt.sign({ uid: userId }, reddit.clientSecret, { expiresIn: '15m' });
  }

  /**
   * Verifies the state token returned from Reddit.
   */
  static verifyStateToken(token: string, expectedUserId: string): boolean {
    const { reddit } = getSecrets();
    try {
      const decoded = jwt.verify(token, reddit.clientSecret) as { uid: string };
      return decoded.uid === expectedUserId;
    } catch {
      return false;
    }
  }

  /**
   * fetchUserFeed: Retrieves normalized posts with multi-tier caching.
   * Checks Firestore distributed cache before hitting external API.
   */
  async fetchUserFeed(userId: string): Promise<NektNode[]> {
    const cachedData = await RedisCacheService.checkCache<NektNode[]>('reddit', userId);

    if (cachedData) {
      console.log(`[RedditService] Cache hit for user: ${userId}`);
      return cachedData;
    }

    console.log(`[RedditService] Cache miss. Fetching from Reddit API.`);
    
    // Placeholder for actual Reddit API Call
    const rawPosts: unknown[] = []; 
    const normalized = (rawPosts as any[]).map(p => normalizeToNekt('reddit', p));

    // Cache the result for 15 minutes (900s)
    await RedisCacheService.setCache('reddit', userId, normalized, 900);

    return normalized;
  }
}
