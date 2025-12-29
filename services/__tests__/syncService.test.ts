import { syncToCloud, syncFromCloud } from '../syncService';

// Mock dependencies
jest.mock('aws-amplify/auth', () => ({
  fetchAuthSession: jest.fn(),
}));

jest.mock('aws-amplify/storage', () => ({
  uploadData: jest.fn(),
  downloadData: jest.fn(),
}));

jest.mock('../../database/index.native', () => ({
  __esModule: true,
  default: {
    collections: {
      get: jest.fn(),
    },
    write: jest.fn((fn) => fn()),
  },
}));

import { fetchAuthSession } from 'aws-amplify/auth';
import { uploadData, downloadData } from 'aws-amplify/storage';
import database from '../../database/index.native';

describe('syncService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('syncToCloud', () => {
    it('uploads user drinks to cloud', async () => {
      (fetchAuthSession as jest.Mock).mockResolvedValue({
        identityId: 'test-identity',
      });

      const mockDrink = {
        id: 'drink-1',
        flavor: 'Matcha',
        price: 5.99,
        store: 'Tsaocaa',
        occasion: 'Test',
        rating: 4,
        date: '2024-12-29',
        s3Key: 'drinks/test.jpg',
        userId: 'test-identity',
        lastModified: new Date(),
        synced: false,
        update: jest.fn((fn) => fn(mockDrink)),
      };

      (database.collections.get as jest.Mock).mockReturnValue({
        query: () => ({
          fetch: () => Promise.resolve([mockDrink]),
        }),
      });

      (uploadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({}),
      });

      await syncToCloud();

      expect(uploadData).toHaveBeenCalledWith({
        path: 'private/test-identity/backup/drinks.json',
        data: expect.any(String),
        options: { contentType: 'application/json' },
      });

      expect(mockDrink.update).toHaveBeenCalled();
    });

    it('throws error when no identity found', async () => {
      (fetchAuthSession as jest.Mock).mockResolvedValue({
        identityId: null,
      });

      await expect(syncToCloud()).rejects.toThrow('No identity ID found');
    });
  });

  describe('syncFromCloud', () => {
    it('downloads and merges drinks from cloud', async () => {
      (fetchAuthSession as jest.Mock).mockResolvedValue({
        identityId: 'test-identity',
      });

      const cloudDrinks = [
        {
          id: 'cloud-drink-1',
          flavor: 'Taro',
          price: 6.99,
          store: 'Gong Cha',
          occasion: 'Birthday',
          rating: 5,
          date: '2024-12-28',
          s3Key: 'drinks/taro.jpg',
          userId: 'test-identity',
          lastModified: Date.now(),
        },
      ];

      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({
          body: {
            text: () => Promise.resolve(JSON.stringify(cloudDrinks)),
          },
        }),
      });

      const mockCreate = jest.fn();
      (database.collections.get as jest.Mock).mockReturnValue({
        query: () => ({
          fetch: () => Promise.resolve([]),
        }),
        create: mockCreate,
      });

      await syncFromCloud();

      expect(downloadData).toHaveBeenCalledWith({
        path: 'private/test-identity/backup/drinks.json',
      });
    });

    it('handles no backup found gracefully', async () => {
      (fetchAuthSession as jest.Mock).mockResolvedValue({
        identityId: 'test-identity',
      });

      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.reject(new Error('No backup found')),
      });

      // Should not throw
      await expect(syncFromCloud()).resolves.toBeUndefined();
    });

    it('skips drinks that already exist locally', async () => {
      (fetchAuthSession as jest.Mock).mockResolvedValue({
        identityId: 'test-identity',
      });

      const existingDrink = {
        id: 'existing-drink',
        flavor: 'Existing',
      };

      const cloudDrinks = [
        { id: 'existing-drink', flavor: 'Existing', lastModified: Date.now() },
      ];

      (downloadData as jest.Mock).mockReturnValue({
        result: Promise.resolve({
          body: {
            text: () => Promise.resolve(JSON.stringify(cloudDrinks)),
          },
        }),
      });

      const mockCreate = jest.fn();
      (database.collections.get as jest.Mock).mockReturnValue({
        query: () => ({
          fetch: () => Promise.resolve([existingDrink]),
        }),
        create: mockCreate,
      });

      await syncFromCloud();

      // Create should not be called for existing drink
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });
});

