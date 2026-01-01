/**
 * App Secrets Configuration
 *
 * Secrets are loaded from EAS Secrets during builds.
 * For local development, you can create a .env.local file (gitignored).
 *
 * To add secrets to EAS:
 * ```bash
 * eas secret:create --name SECRET_NAME --scope project
 * ```
 *
 * Available secrets:
 * - EXPO_PUBLIC_GOOGLE_PLACES_API_KEY: Google Places API for store autocomplete
 */

interface AppSecrets {
  googlePlacesApiKey: string | null;
}

/**
 * Get app secrets from environment variables
 * Returns null for missing secrets (graceful degradation)
 */
export const getSecrets = (): AppSecrets => ({
  googlePlacesApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || null,
});

/**
 * Check if a specific secret is configured
 */
export const hasSecret = (key: keyof AppSecrets): boolean => {
  const secrets = getSecrets();
  return secrets[key] !== null && secrets[key] !== '';
};

/**
 * Get Google Places API key
 * Returns empty string if not configured (API calls will gracefully fail)
 */
export const getGooglePlacesApiKey = (): string => {
  const key = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';

  // Debug logging - remove in production
  if (__DEV__) {
    if (!key) {
      console.warn('⚠️ EXPO_PUBLIC_GOOGLE_PLACES_API_KEY is not set');
      console.log('📋 Available env vars with EXPO_PUBLIC:',
        Object.keys(process.env).filter(k => k.startsWith('EXPO_PUBLIC_'))
      );
    } else {
      console.log('✅ Google Places API key loaded, length:', key.length);
    }
  }

  return key;
};
