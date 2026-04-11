import { genkit, z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { onCallGenkit } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';

// Unified Domain Models
import { NektCategory } from '@omni-nexus/shared-models';

// Services
import { RedditService } from './api/reddit.service';
import { XService } from './api/x.service';

// Secrets
import { redditClientId, redditClientSecret, xBearerToken, instagramAccessToken } from './utils/secrets';
const upstashUrl = defineSecret('UPSTASH_REDIS_REST_URL');
const upstashToken = defineSecret('UPSTASH_REDIS_REST_TOKEN');

// Initialize Firebase Admin
admin.initializeApp();

/**
 * Genkit 1.x Initialization
 * Configured for Gemini 3.1 Pro orchestration.
 */
const ai = genkit({
  plugins: [googleAI()],
  promptDir: 'apps/firebase-backend/src/ai',
});

const redditService = new RedditService();
const xService = new XService();

/**
 * UnifiedSocialIngestor
 * The core Defragmentation Layer flow. Maps multi-platform streams into 
 * intent-based NektNodes and prioritizes content using Gemini 3.1 Pro reasoning.
 */
const ingestorFlow = ai.defineFlow(
  {
    name: 'unifiedSocialIngestor',
    inputSchema: z.object({
      userId: z.string(),
      categories: z.array(z.nativeEnum(NektCategory)).optional(),
    }),
    outputSchema: z.object({
      nodes: z.array(z.any()),
      synapseInsights: z.string(),
    }),
  },
  async ({ userId: _userId }, { context }) => {
    const authUid = context?.auth?.uid;
    if (!authUid) throw new Error('Unauthorized');

    console.log(`[Defragmentation] Processing NektNodes for user: ${authUid}`);

    // 1. Concurrent Platform Fetching with Promise.allSettled
    const results = await Promise.allSettled([
      redditService.fetchUserFeed(authUid),
      xService.fetchUserFeed(authUid),
      // Instagram, WhatsApp, Discord services would be added here
    ]);

    // 2. Collapse Silos into a single NektNode stream
    const rawNodes = results.flatMap((res) => (res.status === 'fulfilled' ? res.value : []));

    // 3. AI Intent Orchestration (Gemini 3.1 Pro)
    // Analyze 'Synapse' (private/chat) nodes to influence 'Communal' prioritization.
    const synapseNodes = rawNodes.filter(n => n.category === NektCategory.SYNAPSE);
    const communalNodes = rawNodes.filter(n => n.category === NektCategory.COMMUNAL);

    const synthesizer = ai.prompt('summarizer');
    const { output: insights } = await synthesizer(
      { 
        platform: 'Nekt (Unified)',
        content: JSON.stringify({ synapse: synapseNodes, communal: communalNodes }) 
      },
      {
        config: {
          model: 'googleai/gemini-3.1-pro',
          thinkingConfig: {
            thinkingLevel: 'MEDIUM'
          }
        }
      }
    );

    return {
      nodes: rawNodes,
      synapseInsights: insights || 'No active synapse patterns detected.',
    };
  }
);

/**
 * Expose via Firebase Callable Function
 */
export const unifiedSocialIngestor = onCallGenkit(
  {
    authPolicy: (auth) => !!auth,
    timeoutSeconds: 300,
    secrets: [
      redditClientId, redditClientSecret, xBearerToken, instagramAccessToken,
      upstashUrl, upstashToken
    ],
  },
  ingestorFlow
);
