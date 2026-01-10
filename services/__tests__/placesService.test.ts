// Mock fetch globally
global.fetch = jest.fn();

// Create a mock for the API key
let mockApiKey = '';

jest.mock('../../src/config/secrets', () => ({
  getGooglePlacesApiKey: () => mockApiKey,
}));

// Import after mocking
import {
  searchBobaPlaces,
  getPlaceDetails,
  searchNearbyBobaPlaces,
  searchNearbyBobaShops,
} from '../placesService';

describe('placesService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockApiKey = '';
  });

  describe('searchBobaPlaces', () => {
    it('returns empty array for short queries', async () => {
      const result = await searchBobaPlaces('a', null);
      expect(result).toEqual([]);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('returns empty array when no API key', async () => {
      mockApiKey = '';
      const result = await searchBobaPlaces('boba tea', null);
      expect(result).toEqual([]);
    });

    it('returns empty array for empty query', async () => {
      const result = await searchBobaPlaces('', null);
      expect(result).toEqual([]);
    });

    it('makes API call with location when provided', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            places: [
              {
                id: 'place1',
                displayName: { text: 'Boba Guys' },
                formattedAddress: '123 Main St',
                location: { latitude: 37.77, longitude: -122.41 },
              },
            ],
          }),
      });

      const result = await searchBobaPlaces('boba', { latitude: 37.77, longitude: -122.41 });

      expect(global.fetch).toHaveBeenCalled();
      const fetchCall = (global.fetch as jest.Mock).mock.calls[0];
      expect(fetchCall[0]).toContain('places.googleapis.com');
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Boba Guys');
    });

    it('handles API errors gracefully', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            error: {
              message: 'Invalid key',
              status: 'INVALID_ARGUMENT',
            },
          }),
      });

      const result = await searchBobaPlaces('boba', null);
      expect(result).toEqual([]);
    });

    it('handles empty results', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            places: [],
          }),
      });

      const result = await searchBobaPlaces('xyznonexistent', null);
      expect(result).toEqual([]);
    });

    it('handles fetch errors', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await searchBobaPlaces('boba', null);
      expect(result).toEqual([]);
    });
  });

  describe('getPlaceDetails', () => {
    it('returns null when no API key', async () => {
      mockApiKey = '';
      const result = await getPlaceDetails('place123');
      expect(result).toBeNull();
    });

    it('returns place details on success', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            id: 'place123',
            displayName: { text: 'Boba Guys' },
            formattedAddress: '123 Main St, San Francisco, CA',
            location: {
              latitude: 37.7749,
              longitude: -122.4194,
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
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            error: {
              message: 'Not found',
              status: 'NOT_FOUND',
            },
          }),
      });

      const result = await getPlaceDetails('invalid-place');
      expect(result).toBeNull();
    });
  });

  describe('searchNearbyBobaPlaces', () => {
    it('returns empty array when no API key', async () => {
      mockApiKey = '';
      const result = await searchNearbyBobaPlaces({ latitude: 37.77, longitude: -122.41 });
      expect(result).toEqual([]);
    });

    it('returns nearby places on success', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            places: [
              {
                id: 'nearby1',
                displayName: { text: 'Nearby Boba' },
                formattedAddress: '456 Oak St',
                location: { latitude: 37.77, longitude: -122.41 },
              },
              {
                id: 'nearby2',
                displayName: { text: 'Tea House' },
                formattedAddress: '789 Pine St',
                location: { latitude: 37.78, longitude: -122.42 },
              },
            ],
          }),
      });

      const result = await searchNearbyBobaPlaces({ latitude: 37.77, longitude: -122.41 });

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Nearby Boba');
      expect(result[1].name).toBe('Tea House');
    });

    it('handles empty results', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            places: [],
          }),
      });

      const result = await searchNearbyBobaPlaces({ latitude: 37.77, longitude: -122.41 });

      expect(result).toEqual([]);
    });

    it('handles API error', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            error: {
              message: 'Error',
              status: 'ERROR',
            },
          }),
      });

      const result = await searchNearbyBobaPlaces({ latitude: 37.77, longitude: -122.41 });

      expect(result).toEqual([]);
    });
  });

  describe('searchNearbyBobaShops', () => {
    it('returns empty array when no API key', async () => {
      mockApiKey = '';
      const result = await searchNearbyBobaShops({ latitude: 37.77, longitude: -122.41 });
      expect(result).toEqual([]);
    });

    it('returns nearby boba shops with coordinates on success', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            places: [
              {
                id: 'boba1',
                displayName: { text: 'Kung Fu Tea' },
                formattedAddress: '123 Boba St',
                location: { latitude: 37.7749, longitude: -122.4194 },
              },
              {
                id: 'boba2',
                displayName: { text: 'Boba Guys' },
                formattedAddress: '456 Tea Ave',
                location: { latitude: 37.7849, longitude: -122.4094 },
              },
            ],
          }),
      });

      const result = await searchNearbyBobaShops({ latitude: 37.77, longitude: -122.41 });

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        placeId: 'boba1',
        name: 'Kung Fu Tea',
        address: '123 Boba St',
        latitude: 37.7749,
        longitude: -122.4194,
      });
      expect(result[1].latitude).toBe(37.7849);
    });

    it('filters out places without location data', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            places: [
              {
                id: 'boba1',
                displayName: { text: 'Kung Fu Tea' },
                formattedAddress: '123 Boba St',
                location: { latitude: 37.7749, longitude: -122.4194 },
              },
              {
                id: 'boba2',
                displayName: { text: 'No Location Tea' },
                formattedAddress: '456 Tea Ave',
                // No location field
              },
            ],
          }),
      });

      const result = await searchNearbyBobaShops({ latitude: 37.77, longitude: -122.41 });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Kung Fu Tea');
    });

    it('handles empty results', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            places: [],
          }),
      });

      const result = await searchNearbyBobaShops({ latitude: 37.77, longitude: -122.41 });

      expect(result).toEqual([]);
    });

    it('handles API error', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockResolvedValue({
        json: () =>
          Promise.resolve({
            error: {
              message: 'Invalid API key',
              status: 'INVALID_ARGUMENT',
            },
          }),
      });

      const result = await searchNearbyBobaShops({ latitude: 37.77, longitude: -122.41 });

      expect(result).toEqual([]);
    });

    it('handles network errors', async () => {
      mockApiKey = 'test-key';

      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await searchNearbyBobaShops({ latitude: 37.77, longitude: -122.41 });

      expect(result).toEqual([]);
    });
  });
});
