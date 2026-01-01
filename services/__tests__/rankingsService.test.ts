import {
  getGlobalRankings,
  recordStoreVisit,
  getTopStores,
  getStoreRank,
  GlobalRankings,
} from '../rankingsService';

// Mock AWS Amplify storage
jest.mock('aws-amplify/storage', () => ({
  downloadData: jest.fn(),
  uploadData: jest.fn(),
  list: jest.fn(),
}));

import { downloadData, uploadData } from 'aws-amplify/storage';

describe('rankingsService', () => {
  const mockRankings: GlobalRankings = {
    stores: [
      { storeName: 'Kung Fu Tea', visitCount: 10, lastVisited: '2025-01-01T00:00:00Z' },
      { storeName: 'Boba Guys', visitCount: 8, lastVisited: '2025-01-02T00:00:00Z' },
      { storeName: 'Tiger Sugar', visitCount: 5, lastVisited: '2025-01-03T00:00:00Z' },
    ],
    lastUpdated: '2025-01-03T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getGlobalRankings', () => {
    it('returns rankings from S3', async () => {
      const mockBody = {
        text: jest.fn().mockResolvedValue(JSON.stringify(mockRankings)),
      };
      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({ body: mockBody }),
      });

      const result = await getGlobalRankings();

      expect(result).toEqual(mockRankings);
      expect(downloadData).toHaveBeenCalledWith({
        path: 'public/global/store-rankings.json',
      });
    });

    it('returns empty rankings when file not found', async () => {
      const notFoundError = new Error('not found');
      notFoundError.name = 'NotFound';
      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.reject(notFoundError),
      });

      const result = await getGlobalRankings();

      expect(result.stores).toEqual([]);
      expect(result.lastUpdated).toBeDefined();
    });

    it('returns empty rankings on other errors', async () => {
      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.reject(new Error('Network error')),
      });

      const result = await getGlobalRankings();

      expect(result.stores).toEqual([]);
    });
  });

  describe('recordStoreVisit', () => {
    beforeEach(() => {
      const mockBody = {
        text: jest.fn().mockResolvedValue(JSON.stringify(mockRankings)),
      };
      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({ body: mockBody }),
      });
      (uploadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({}),
      });
    });

    it('increments visit count for existing store', async () => {
      const result = await recordStoreVisit('Kung Fu Tea');

      expect(result.stores[0].storeName).toBe('Kung Fu Tea');
      expect(result.stores[0].visitCount).toBe(11);
      expect(uploadData).toHaveBeenCalled();
    });

    it('adds new store with visit count 1', async () => {
      const result = await recordStoreVisit('New Boba Shop');

      const newStore = result.stores.find((s) => s.storeName === 'New Boba Shop');
      expect(newStore).toBeDefined();
      expect(newStore?.visitCount).toBe(1);
    });

    it('handles case-insensitive store matching', async () => {
      const result = await recordStoreVisit('kung fu tea');

      expect(result.stores[0].visitCount).toBe(11);
    });

    it('trims store name whitespace', async () => {
      const result = await recordStoreVisit('  Kung Fu Tea  ');

      expect(result.stores[0].visitCount).toBe(11);
    });

    it('adds placeId if provided', async () => {
      const result = await recordStoreVisit('New Shop', 'place-123');

      const newStore = result.stores.find((s) => s.storeName === 'New Shop');
      expect(newStore?.placeId).toBe('place-123');
    });

    it('keeps stores sorted by visit count', async () => {
      // Add a new store with a lot of visits by mocking the initial data differently
      const highVisitRankings: GlobalRankings = {
        stores: [{ storeName: 'Low Store', visitCount: 1, lastVisited: '2025-01-01T00:00:00Z' }],
        lastUpdated: '2025-01-01T00:00:00Z',
      };

      const mockBody = {
        text: jest.fn().mockResolvedValue(JSON.stringify(highVisitRankings)),
      };
      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({ body: mockBody }),
      });

      const result = await recordStoreVisit('Low Store');

      expect(result.stores[0].storeName).toBe('Low Store');
      expect(result.stores[0].visitCount).toBe(2);
    });

    it('limits stores to top 100', async () => {
      const manyStores: GlobalRankings = {
        stores: Array.from({ length: 100 }, (_, i) => ({
          storeName: `Store ${i}`,
          visitCount: 100 - i,
          lastVisited: '2025-01-01T00:00:00Z',
        })),
        lastUpdated: '2025-01-01T00:00:00Z',
      };

      const mockBody = {
        text: jest.fn().mockResolvedValue(JSON.stringify(manyStores)),
      };
      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({ body: mockBody }),
      });

      const result = await recordStoreVisit('New Store 101');

      expect(result.stores.length).toBeLessThanOrEqual(100);
    });

    it('throws error when save fails', async () => {
      (uploadData as jest.Mock).mockReturnValue({
        result: Promise.reject(new Error('Upload failed')),
      });

      await expect(recordStoreVisit('Test Store')).rejects.toThrow();
    });
  });

  describe('getTopStores', () => {
    beforeEach(() => {
      const mockBody = {
        text: jest.fn().mockResolvedValue(JSON.stringify(mockRankings)),
      };
      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({ body: mockBody }),
      });
    });

    it('returns top N stores', async () => {
      const result = await getTopStores(2);

      expect(result.length).toBe(2);
      expect(result[0].storeName).toBe('Kung Fu Tea');
      expect(result[1].storeName).toBe('Boba Guys');
    });

    it('defaults to top 5 stores', async () => {
      const result = await getTopStores();

      expect(result.length).toBe(3); // Only 3 stores in mock data
    });

    it('returns empty array when no rankings', async () => {
      const mockBody = {
        text: jest.fn().mockResolvedValue(JSON.stringify({ stores: [], lastUpdated: '' })),
      };
      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({ body: mockBody }),
      });

      const result = await getTopStores();

      expect(result).toEqual([]);
    });
  });

  describe('getStoreRank', () => {
    beforeEach(() => {
      const mockBody = {
        text: jest.fn().mockResolvedValue(JSON.stringify(mockRankings)),
      };
      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({ body: mockBody }),
      });
    });

    it('returns correct rank for existing store', async () => {
      const rank = await getStoreRank('Kung Fu Tea');

      expect(rank).toBe(1);
    });

    it('returns correct rank for second store', async () => {
      const rank = await getStoreRank('Boba Guys');

      expect(rank).toBe(2);
    });

    it('returns null for non-existent store', async () => {
      const rank = await getStoreRank('Unknown Store');

      expect(rank).toBeNull();
    });

    it('handles case-insensitive search', async () => {
      const rank = await getStoreRank('KUNG FU TEA');

      expect(rank).toBe(1);
    });

    it('handles whitespace in store name', async () => {
      const rank = await getStoreRank('  Kung Fu Tea  ');

      expect(rank).toBe(1);
    });
  });
});
