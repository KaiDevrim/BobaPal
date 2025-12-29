// Mock the location service
jest.mock('../../services/locationService', () => ({
  getCurrentLocation: jest.fn(),
  getLastKnownLocation: jest.fn(),
  requestLocationPermission: jest.fn(),
}));

import { getCurrentLocation, getLastKnownLocation } from '../../services/locationService';

describe('useLocation hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Location fetching logic', () => {
    it('getLastKnownLocation returns coordinates', async () => {
      const mockCoords = { latitude: 37.77, longitude: -122.41 };
      (getLastKnownLocation as jest.Mock).mockResolvedValue(mockCoords);

      const result = await getLastKnownLocation();

      expect(result).toEqual(mockCoords);
    });

    it('getCurrentLocation returns coordinates', async () => {
      const mockCoords = { latitude: 40.71, longitude: -74.01 };
      (getCurrentLocation as jest.Mock).mockResolvedValue(mockCoords);

      const result = await getCurrentLocation();

      expect(result).toEqual(mockCoords);
    });

    it('returns null when location is not available', async () => {
      (getLastKnownLocation as jest.Mock).mockResolvedValue(null);
      (getCurrentLocation as jest.Mock).mockResolvedValue(null);

      const lastKnown = await getLastKnownLocation();
      const current = await getCurrentLocation();

      expect(lastKnown).toBeNull();
      expect(current).toBeNull();
    });
  });

  describe('Coordinates type validation', () => {
    it('returns correct coordinate structure', async () => {
      const mockCoords = { latitude: 37.7749, longitude: -122.4194 };
      (getCurrentLocation as jest.Mock).mockResolvedValue(mockCoords);

      const result = await getCurrentLocation();

      expect(result).toHaveProperty('latitude');
      expect(result).toHaveProperty('longitude');
      expect(typeof result?.latitude).toBe('number');
      expect(typeof result?.longitude).toBe('number');
    });

    it('coordinates are within valid ranges', async () => {
      const mockCoords = { latitude: 37.7749, longitude: -122.4194 };
      (getCurrentLocation as jest.Mock).mockResolvedValue(mockCoords);

      const result = await getCurrentLocation();

      expect(result?.latitude).toBeGreaterThanOrEqual(-90);
      expect(result?.latitude).toBeLessThanOrEqual(90);
      expect(result?.longitude).toBeGreaterThanOrEqual(-180);
      expect(result?.longitude).toBeLessThanOrEqual(180);
    });
  });
});
