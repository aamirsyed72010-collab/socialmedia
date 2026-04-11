import { NektNode, NektCategory } from '@omni-nexus/shared-models';

export type RawPayload = Record<string, unknown>;

/**
 * Reddit -> NektNode (Communal/Visuals)
 */
export const redditNormalizer = {
  normalize: (raw: Record<string, unknown>): NektNode => {
    const isMedia = !!raw['post_hint'] && (raw['post_hint'] === 'image' || raw['post_hint'] === 'video');
    return {
      id: `nekt-reddit-${raw['id']}`,
      originalId: raw['id'] as string,
      platform: 'reddit' as const,
      category: isMedia ? NektCategory.VISUALS : NektCategory.COMMUNAL,
      author: {
        handle: raw['author'] as string,
        displayName: raw['author'] as string,
        avatarUrl: raw['author_icon_img'] as string,
      },
      content: {
        text: raw['title'] as string,
        mediaUrl: (raw['url_overridden_by_dest'] || raw['url']) as string,
        mediaType: raw['post_hint'] === 'video' ? 'video' : 'image',
      },
      timestamp: (raw['created_utc'] as number) * 1000,
      rawPayload: raw,
    };
  },
};

/**
 * X -> NektNode (Communal/Visuals)
 */
export const xNormalizer = {
  normalize: (raw: Record<string, unknown>): NektNode => {
    const entities = raw['entities'] as Record<string, any> | undefined;
    const hasVideo = entities?.['media']?.some((m: any) => m.type === 'video');
    const user = raw['user'] as Record<string, any> | undefined;

    return {
      id: `nekt-x-${raw['id']}`,
      originalId: raw['id'] as string,
      platform: 'x' as const,
      category: hasVideo ? NektCategory.VISUALS : NektCategory.COMMUNAL,
      author: {
        handle: user?.['screen_name'] || 'unknown',
        displayName: user?.['name'] || 'Unknown',
        avatarUrl: user?.['profile_image_url_https'],
        verified: user?.['verified'],
      },
      content: {
        text: (raw['full_text'] || raw['text'] || '') as string,
        mediaUrl: entities?.['media']?.[0]?.['media_url_https'],
        mediaType: hasVideo ? 'video' : 'image',
      },
      timestamp: new Date(raw['created_at'] as string).getTime(),
      rawPayload: raw,
    };
  },
};

/**
 * Instagram -> NektNode (Visuals)
 */
export const instagramNormalizer = {
  normalize: (raw: Record<string, unknown>): NektNode => ({
    id: `nekt-ig-${raw['id']}`,
    originalId: raw['id'] as string,
    platform: 'instagram' as const,
    category: NektCategory.VISUALS,
    author: {
      handle: raw['username'] as string,
      displayName: raw['username'] as string,
    },
    content: {
      text: (raw['caption'] || '') as string,
      mediaUrl: raw['media_url'] as string,
      mediaType: raw['media_type'] === 'VIDEO' ? 'video' : 'image',
    },
    timestamp: new Date(raw['timestamp'] as string).getTime(),
    rawPayload: raw,
  }),
};

/**
 * Discord/WhatsApp -> NektNode (Synapse)
 */
export const synapseNormalizer = {
  normalize: (platform: 'discord' | 'whatsapp', raw: Record<string, unknown>): NektNode => {
    const author = (raw['author'] || raw['sender']) as Record<string, any> | undefined;
    return {
      id: `nekt-${platform}-${raw['id']}`,
      originalId: raw['id'] as string,
      platform: platform as any,
      category: NektCategory.SYNAPSE,
      author: {
        handle: author?.['handle'] || author?.['username'],
        displayName: author?.['name'] || author?.['global_name'] || 'User',
        avatarUrl: author?.['avatar'] ? `https://cdn.discordapp.com/avatars/${author['id']}/${author['avatar']}.png` : undefined,
      },
      content: {
        text: (raw['content'] || raw['message'] || '') as string,
      },
      timestamp: new Date(raw['timestamp'] as string).getTime(),
      rawPayload: raw,
    };
  },
};

/**
 * Defragmentation Engine
 */
export function normalizeToNekt(platform: string, raw: Record<string, unknown>): NektNode {
  switch (platform.toLowerCase()) {
    case 'reddit': return redditNormalizer.normalize(raw);
    case 'x': return xNormalizer.normalize(raw);
    case 'instagram': return instagramNormalizer.normalize(raw);
    case 'discord': return synapseNormalizer.normalize('discord', raw);
    case 'whatsapp': return synapseNormalizer.normalize('whatsapp', raw);
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }
}
