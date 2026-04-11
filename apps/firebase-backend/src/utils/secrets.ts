import { defineSecret } from 'firebase-functions/params';

/**
 * OmniNexus Secret Management
 * Uses Firebase Secret Manager to securely handle social API tokens.
 * This ensures no process.env or hardcoded keys in the repository.
 */
export const redditClientId = defineSecret('REDDIT_CLIENT_ID');
export const redditClientSecret = defineSecret('REDDIT_CLIENT_SECRET');
export const xBearerToken = defineSecret('X_BEARER_TOKEN');
export const instagramAccessToken = defineSecret('INSTAGRAM_ACCESS_TOKEN');

export function getSecrets() {
  return {
    reddit: {
      clientId: redditClientId.value(),
      clientSecret: redditClientSecret.value(),
    },
    x: {
      bearerToken: xBearerToken.value(),
    },
    instagram: {
      accessToken: instagramAccessToken.value(),
    },
  };
}
