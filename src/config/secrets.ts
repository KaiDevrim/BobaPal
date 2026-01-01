/**
 * App Secrets Configuration
 *
 * Secrets are loaded from multiple sources in priority order:
 * 1. EAS Secrets (injected at build time via app.config.js -> Constants.expoConfig.extra)
 * 2. EXPO_PUBLIC_ environment variables (for local development)
 *
 * To add secrets to EAS:
 * ```bash
 * eas secret:create --name GOOGLE_PLACES_API_KEY --scope project
 * ```
 *
 * For local development, create .env.local:
 * ```
 * EXPO_PUBLIC_GOOGLE_PLACES_API_KEY=your-api-key
 * ```
 */

import Constants from 'expo-constants';

interface AppSecrets {
  googlePlacesApiKey: string | null;
}

/**
 * Get app secrets from expo config (EAS) or environment variables (local)
 * Returns null for missing secrets (graceful degradation)
 */
export const getSecrets = (): AppSecrets => ({
  googlePlacesApiKey:
    Constants.expoConfig?.extra?.googlePlacesApiKey ||
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ||
    null,
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
  // Priority: EAS secret (via expo config) > EXPO_PUBLIC_ env var
  const key =
    Constants.expoConfig?.extra?.googlePlacesApiKey ||
    process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ||
    '';

  // Only warn once in development if key is missing
  if (__DEV__ && !key) {
    console.warn('⚠️ GOOGLE_PLACES_API_KEY is not set');
  }

  return key;
};
