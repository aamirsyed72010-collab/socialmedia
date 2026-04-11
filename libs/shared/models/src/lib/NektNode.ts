/**
 * NektCategory: Intent-based classification for the Defragmentation Layer.
 * - COMMUNAL: Public discussions, threads, and broadcasts.
 * - VISUALS: Video content, reels, and high-impact media.
 * - SYNAPSE: Direct interactions, DMs, and threaded chat.
 */
export enum NektCategory {
  COMMUNAL = 'COMMUNAL',
  VISUALS = 'VISUALS',
  SYNAPSE = 'SYNAPSE'
}

/**
 * NektNode: The Unified Social OS data structure.
 * Replaces platform silos with a defragmented intent model.
 */
export interface NektNode {
  id: string;
  category: NektCategory;
  platform: 'reddit' | 'x' | 'instagram' | 'whatsapp' | 'discord';
  originalId: string;
  
  author: {
    handle: string;
    displayName: string;
    avatarUrl?: string;
    verified?: boolean;
  };

  content: {
    text?: string;
    html?: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'gif';
    threadRootId?: string; // For Communal thread-first layout
  };

  metrics?: {
    engagement?: number;
    priorityScore?: number; // Calculated by Gemini 3.1 Pro
  };

  timestamp: number;
  rawPayload?: any; // Preserved for deep inspection if needed
}
