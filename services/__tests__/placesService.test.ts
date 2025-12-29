// Mock fetch globally
global.fetch = jest.fn();

// Store original env
const originalEnv = process.env;

describe('placesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('searchBobaPlaces', () => {
    it('returns empty array for short queries', async () => {
      const { searchBobaPlaces } = require('../placesService');
      const result = await searchBobaPlaces('a', null);
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns empty array when no API key', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = '';
      const { searchBobaPlaces } = require('../placesService');
      const result = await searchBobaPlaces('boba tea', null);
      expect(result).toEqual([]);
    });

    it('returns empty array for empty query', async () => {
      const { searchBobaPlaces } = require('../placesService');
      const result = await searchBobaPlaces('', null);
      expect(result).toEqual([]);
    });

    it('makes API call with location when provided', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      jest.resetModules();
      const { searchBobaPlaces } = require('../placesService');

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'OK',
            predictions: [
              {
                place_id: 'place1',
                structured_formatting: {
                  main_text: 'Boba Guys',
                  secondary_text: '123 Main St',
                },
              },
            ],
          }),
      });

      const result = await searchBobaPlaces('boba', { latitude: 37.77, longitude: -122.41 });

      expect(global.fetch).toHaveBeenCalled();
      expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain('location=37.77,-122.41');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Boba Guys');
    });

    it('handles API errors gracefully', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      jest.resetModules();
      const { searchBobaPlaces } = require('../placesService');

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'REQUEST_DENIED',
            error_message: 'Invalid key',
          }),
      });

      const result = await searchBobaPlaces('boba', null);
      expect(result).toEqual([]);
    });

    it('handles ZERO_RESULTS status', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      jest.resetModules();
      const { searchBobaPlaces } = require('../placesService');

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'ZERO_RESULTS',
            predictions: [],
          }),
      });

      const result = await searchBobaPlaces('xyznonexistent', null);
      expect(result).toEqual([]);
    });

    it('handles fetch errors', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      jest.resetModules();
      const { searchBobaPlaces } = require('../placesService');

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await searchBobaPlaces('boba', null);
      expect(result).toEqual([]);
    });
  });

  describe('getPlaceDetails', () => {
    it('returns null when no API key', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = '';
      jest.resetModules();
      const { getPlaceDetails } = require('../placesService');
      const result = await getPlaceDetails('place123');
      expect(result).toBeNull();
    });

    it('returns place details on success', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      jest.resetModules();
      const { getPlaceDetails } = require('../placesService');

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'OK',
            result: {
              name: 'Boba Guys',
              formatted_address: '123 Main St, San Francisco, CA',
              geometry: {
                location: {
                  lat: 37.7749,
                  lng: -122.4194,
                },
              },
            },
          }),
      });

      const result = await getPlaceDetails('place123');

      expect(result).toEqual({
        placeId: 'place123',
        name: 'Boba Guys',
        address: '123 Main St, San Francisco, CA',
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('returns null on API error', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      jest.resetModules();
      const { getPlaceDetails } = require('../placesService');

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'NOT_FOUND',
          }),
      });

      const result = await getPlaceDetails('invalid-place');
      expect(result).toBeNull();
    });
  });

  describe('searchNearbyBobaPlaces', () => {
    it('returns empty array when no API key', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = '';
      jest.resetModules();
      const { searchNearbyBobaPlaces } = require('../placesService');
      const result = await searchNearbyBobaPlaces({ latitude: 37.77, longitude: -122.41 });
      expect(result).toEqual([]);
    });

    it('returns nearby places on success', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      jest.resetModules();
      const { searchNearbyBobaPlaces } = require('../placesService');

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'OK',
            results: [
              {
                place_id: 'nearby1',
                name: 'Nearby Boba',
                vicinity: '456 Oak St',
              },
              {
                place_id: 'nearby2',
                name: 'Tea House',
                vicinity: '789 Pine St',
              },
            ],
          }),
      });

      const result = await searchNearbyBobaPlaces({ latitude: 37.77, longitude: -122.41 });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Nearby Boba');
      expect(result[1].name).toBe('Tea House');
    });

    it('limits results to 10', async () => {
      process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY = 'test-key';
      jest.resetModules();
      const { searchNearbyBobaPlaces } = require('../placesService');

      const manyResults = Array.from({ length: 20 }, (_, i) => ({
        place_id: `place${i}`,
        name: `Place ${i}`,
        vicinity: `Address ${i}`,
      }));

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            status: 'OK',
            results: manyResults,
          }),
      });

      const result = await searchNearbyBobaPlaces({ latitude: 37.77, longitude: -122.41 });

      // Should limit to 10 even if API returns more
      expect(result.length).toBeLessThanOrEqual(10);
    });
  });
});

