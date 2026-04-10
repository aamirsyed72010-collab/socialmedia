export type PlatformType = 'reddit' | 'x' | 'instagram' | 'whatsapp' | 'discord';

export interface OmniPost {
  id: string;                      // Globally Unique Identifier
  platform: PlatformType;          // Discriminator to render correct UI Card Type
  originalId: string;              // ID native to the platform
  author: {
    handle: string;
    displayName: string;
    avatarUrl?: string;
    verified?: boolean;
  };
  content: {
    text: string;
    mediaUrls?: string[];          // Visuals (Aspect-ratio adjustments for Instagram)
    aiSummary?: string;            // Filled by Firebase AI Logic for long threads
  };
  metrics: {
    likes?: number;
    shares?: number;
    comments?: number;
  };
  timestamp: Date | number;
  interactionState?: 'read' | 'unread' | 'acted';
  rawPayload: unknown;             // Original data for deep integrations
}
