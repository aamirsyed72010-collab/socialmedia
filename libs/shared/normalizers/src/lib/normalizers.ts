import { OmniPost } from '@omni-nexus/shared-models';

export type RawPayload = any;

export interface Normalizer<T = RawPayload> {
  normalize(raw: T): OmniPost;
}

/**
 * Reddit Normalizer
 */
export const redditNormalizer: Normalizer = {
  normalize: (raw) => ({
    id: `reddit-${raw.id}`,
    platform: 'reddit',
    originalId: raw.id,
    author: {
      handle: raw.author,
      displayName: raw.author,
      avatarUrl: raw.author_icon_img,
    },
    content: {
      text: `${raw.title}${raw.selftext ? '\n\n' + raw.selftext : ''}`,
      mediaUrls: [], // Logic to extract reddit media
    },
    metrics: {
      likes: raw.ups,
      shares: raw.num_crossposts,
      comments: raw.num_comments,
    },
    timestamp: raw.created_utc * 1000,
    rawPayload: raw,
  }),
};

/**
 * X (Twitter) Normalizer
 */
export const xNormalizer: Normalizer = {
  normalize: (raw) => ({
    id: `x-${raw.id}`,
    platform: 'x',
    originalId: raw.id,
    author: {
      handle: raw.user?.screen_name || 'unknown',
      displayName: raw.user?.name || 'Unknown User',
      avatarUrl: raw.user?.profile_image_url_https,
      verified: raw.user?.verified,
    },
    content: {
      text: raw.text || raw.full_text || '',
      mediaUrls: raw.entities?.media?.map((m: any) => m.media_url_https) || [],
    },
    metrics: {
      likes: raw.favorite_count,
      shares: raw.retweet_count,
    },
    timestamp: new Date(raw.created_at).getTime(),
    rawPayload: raw,
  }),
};

/**
 * Instagram Normalizer
 */
export const instagramNormalizer: Normalizer = {
  normalize: (raw) => ({
    id: `ig-${raw.id}`,
    platform: 'instagram',
    originalId: raw.id,
    author: {
      handle: raw.username,
      displayName: raw.username,
    },
    content: {
      text: raw.caption || '',
      mediaUrls: [raw.media_url, ...(raw.children?.data?.map((c: any) => c.media_url) || [])].filter(Boolean),
    },
    metrics: {
      likes: raw.like_count,
      comments: raw.comments_count,
    },
    timestamp: new Date(raw.timestamp).getTime(),
    rawPayload: raw,
  }),
};

/**
 * Discord Normalizer
 */
export const discordNormalizer: Normalizer = {
  normalize: (raw) => ({
    id: `discord-${raw.id}`,
    platform: 'discord',
    originalId: raw.id,
    author: {
      handle: raw.author?.username,
      displayName: raw.author?.global_name || raw.author?.username,
      avatarUrl: raw.author?.avatar ? `https://cdn.discordapp.com/avatars/${raw.author.id}/${raw.author.avatar}.png` : undefined,
    },
    content: {
      text: raw.content || '',
      mediaUrls: raw.attachments?.map((a: any) => a.url) || [],
    },
    metrics: {},
    timestamp: new Date(raw.timestamp).getTime(),
    rawPayload: raw,
  }),
};

/**
 * Unified Normalization Engine
 */
export function normalizePost(platform: string, raw: any): OmniPost {
  switch (platform.toLowerCase()) {
    case 'reddit': return redditNormalizer.normalize(raw);
    case 'x': return xNormalizer.normalize(raw);
    case 'instagram': return instagramNormalizer.normalize(raw);
    case 'discord': return discordNormalizer.normalize(raw);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
