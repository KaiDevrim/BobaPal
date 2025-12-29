import {
  getCachedImageUrl,
  clearImageCache,
  removeFromCache,
  getCacheStats,
  cleanExpiredCache,
  prefetchImages,
} from '../imageCacheService';

// Mock the storage service
jest.mock('../storageService', () => ({
  getImageUrl: jest.fn(),
}));

// Mock expo-image
jest.mock('expo-image', () => ({
  Image: {
    prefetch: jest.fn(() => Promise.resolve()),
  },
}));

import { getImageUrl } from '../storageService';
import { Image } from 'expo-image';

describe('imageCacheService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    clearImageCache();
  });

  describe('getCachedImageUrl', () => {
    it('returns null when s3Key is null', async () => {
      const result = await getCachedImageUrl(null);
      expect(result).toBeNull();
      expect(getImageUrl).not.toHaveBeenCalled();
    });

    it('fetches URL from storage service on first call', async () => {
      const mockUrl = 'https://example.com/image.jpg';
      (getImageUrl as jest.Mock).mockResolvedValue(mockUrl);

      const result = await getCachedImageUrl('test-key');

      expect(result).toBe(mockUrl);
      expect(getImageUrl).toHaveBeenCalledWith('test-key');
    });

    it('returns cached URL on subsequent calls', async () => {
      const mockUrl = 'https://example.com/image.jpg';
      (getImageUrl as jest.Mock).mockResolvedValue(mockUrl);

      // First call
      await getCachedImageUrl('test-key');

      // Second call - should use cache
      const result = await getCachedImageUrl('test-key');

      expect(result).toBe(mockUrl);
      expect(getImageUrl).toHaveBeenCalledTimes(1);
    });

    it('returns null when getImageUrl throws error', async () => {
      (getImageUrl as jest.Mock).mockRejectedValue(new Error('Failed'));

      const result = await getCachedImageUrl('error-key');

      expect(result).toBeNull();
    });
  });

  describe('clearImageCache', () => {
    it('clears all cached URLs', async () => {
      const mockUrl = 'https://example.com/image.jpg';
      (getImageUrl as jest.Mock).mockResolvedValue(mockUrl);

      // Cache a URL
      await getCachedImageUrl('test-key');

      // Clear cache
      clearImageCache();

      // Should fetch again
      await getCachedImageUrl('test-key');

      expect(getImageUrl).toHaveBeenCalledTimes(2);
    });
  });

  describe('removeFromCache', () => {
    it('removes specific key from cache', async () => {
      const mockUrl = 'https://example.com/image.jpg';
      (getImageUrl as jest.Mock).mockResolvedValue(mockUrl);

      // Cache a URL
      await getCachedImageUrl('test-key');

      // Remove from cache
      const removed = removeFromCache('test-key');
      expect(removed).toBe(true);

      // Should fetch again
      await getCachedImageUrl('test-key');

      expect(getImageUrl).toHaveBeenCalledTimes(2);
    });

    it('returns false when key does not exist', () => {
      const removed = removeFromCache('non-existent-key');
      expect(removed).toBe(false);
    });
  });

  describe('getCacheStats', () => {
    it('returns cache statistics', async () => {
      const mockUrl = 'https://example.com/image.jpg';
      (getImageUrl as jest.Mock).mockResolvedValue(mockUrl);

      // First call - miss
      await getCachedImageUrl('test-key');

      // Second call - hit
      await getCachedImageUrl('test-key');

      const stats = getCacheStats();

      expect(stats.hits).toBe(1);
      expect(stats.misses).toBe(1);
      expect(stats.size).toBe(1);
    });
  });

  describe('prefetchImages', () => {
    it('fetches URLs and prefetches images', async () => {
      const mockUrl1 = 'https://example.com/image1.jpg';
      const mockUrl2 = 'https://example.com/image2.jpg';
      (getImageUrl as jest.Mock)
        .mockResolvedValueOnce(mockUrl1)
        .mockResolvedValueOnce(mockUrl2);

      await prefetchImages(['key1', 'key2']);

      expect(getImageUrl).toHaveBeenCalledTimes(2);
      expect(Image.prefetch).toHaveBeenCalledWith([mockUrl1, mockUrl2]);
    });

    it('filters out null keys', async () => {
      const mockUrl = 'https://example.com/image.jpg';
      (getImageUrl as jest.Mock).mockResolvedValue(mockUrl);

      await prefetchImages([null, 'key1', null, 'key2', null]);

      expect(getImageUrl).toHaveBeenCalledTimes(2);
    });

    it('handles empty array', async () => {
      await prefetchImages([]);

      expect(getImageUrl).not.toHaveBeenCalled();
      expect(Image.prefetch).not.toHaveBeenCalled();
    });

    it('handles all null keys', async () => {
      await prefetchImages([null, null, null]);

      expect(getImageUrl).not.toHaveBeenCalled();
      expect(Image.prefetch).not.toHaveBeenCalled();
    });

    it('does not call prefetch if all URLs fail', async () => {
      (getImageUrl as jest.Mock).mockRejectedValue(new Error('Failed'));

      await prefetchImages(['key1', 'key2']);

      expect(Image.prefetch).not.toHaveBeenCalled();
    });
  });

  describe('cleanExpiredCache', () => {
    it('returns 0 when cache is empty', () => {
      const cleaned = cleanExpiredCache();
      expect(cleaned).toBe(0);
    });
  });
});
