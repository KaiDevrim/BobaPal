// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
  getLastKnownPositionAsync: jest.fn(),
  Accuracy: {
    Balanced: 3,
  },
}));

import * as Location from 'expo-location';
import {
  requestLocationPermission,
  getCurrentLocation,
  getLastKnownLocation,
} from '../locationService';

describe('locationService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestLocationPermission', () => {
    it('returns true when permission is granted', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });

      const result = await requestLocationPermission();
      expect(result).toBe(true);
    });

    it('returns false when permission is denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await requestLocationPermission();
      expect(result).toBe(false);
    });
  });

  describe('getCurrentLocation', () => {
    it('returns coordinates when location is available', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
        coords: {
          latitude: 37.7749,
          longitude: -122.4194,
        },
      });

      const result = await getCurrentLocation();

      expect(result).toEqual({
        latitude: 37.7749,
        longitude: -122.4194,
      });
    });

    it('returns null when permission is denied', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'denied',
      });

      const result = await getCurrentLocation();
      expect(result).toBeNull();
    });

    it('returns null when error occurs', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Location.getCurrentPositionAsync as jest.Mock).mockRejectedValue(
        new Error('Location error')
      );

      const result = await getCurrentLocation();
      expect(result).toBeNull();
    });
  });

  describe('getLastKnownLocation', () => {
    it('returns last known coordinates when available', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue({
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      });

      const result = await getLastKnownLocation();

      expect(result).toEqual({
        latitude: 40.7128,
        longitude: -74.006,
      });
    });

    it('falls back to getCurrentLocation when no last known', async () => {
      (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue({
        status: 'granted',
      });
      (Location.getLastKnownPositionAsync as jest.Mock).mockResolvedValue(null);
      (Location.getCurrentPositionAsync as jest.Mock).mockResolvedValue({
        coords: {
          latitude: 34.0522,
          longitude: -118.2437,
        },
      });

      const result = await getLastKnownLocation();

      expect(result).toEqual({
        latitude: 34.0522,
        longitude: -118.2437,
      });
    });
  });
});
