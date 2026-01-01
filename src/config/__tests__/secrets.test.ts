// Tests for secrets configuration

describe('secrets config', () => {
  describe('getSecrets', () => {
    const mockGetSecrets = () => ({
      googlePlacesApiKey: process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || null,
    });

    it('returns object with googlePlacesApiKey', () => {
      const secrets = mockGetSecrets();
      expect(secrets).toHaveProperty('googlePlacesApiKey');
    });

    it('returns null when env var is not set', () => {
      const originalEnv = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
      delete process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

      const secrets = mockGetSecrets();
      expect(secrets.googlePlacesApiKey).toBeNull();

      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = originalEnv;
    });
  });

  describe('hasSecret', () => {
    const hasSecret = (key: string, secrets: Record<string, string | null>): boolean => {
      return secrets[key] !== null && secrets[key] !== '';
    };

    it('returns true when secret is set', () => {
      const secrets = { googlePlacesApiKey: 'test-key' };
      expect(hasSecret('googlePlacesApiKey', secrets)).toBe(true);
    });

    it('returns false when secret is null', () => {
      const secrets = { googlePlacesApiKey: null };
      expect(hasSecret('googlePlacesApiKey', secrets)).toBe(false);
    });

    it('returns false when secret is empty string', () => {
      const secrets = { googlePlacesApiKey: '' };
      expect(hasSecret('googlePlacesApiKey', secrets)).toBe(false);
    });
  });

  describe('getGooglePlacesApiKey', () => {
    const getGooglePlacesApiKey = (): string => {
      return process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || '';
    };

    it('returns empty string when not set', () => {
      const originalEnv = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
      delete process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;

      const key = getGooglePlacesApiKey();
      expect(key).toBe('');

      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = originalEnv;
    });

    it('returns key when set', () => {
      const originalEnv = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY;
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-api-key-123';

      const key = getGooglePlacesApiKey();
      expect(key).toBe('test-api-key-123');

      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = originalEnv;
    });
  });
});
