import { uploadData, downloadData } from 'aws-amplify/storage';

const RANKINGS_FILE = 'global/store-rankings.json';

export interface StoreVisit {
  storeName: string;
  placeId?: string;
  visitCount: number;
  lastVisited: string;
}

export interface GlobalRankings {
  stores: StoreVisit[];
  lastUpdated: string;
}

/**
 * Get the global store rankings
 */
export const getGlobalRankings = async (): Promise<GlobalRankings> => {
  try {
    const result = await downloadData({
      path: `public/${RANKINGS_FILE}`,
    }).result;

    const text = await result.body.text();
    return JSON.parse(text) as GlobalRankings;
  } catch (error: any) {
    // If file doesn't exist, return empty rankings
    if (error?.name === 'NotFound' || error?.message?.includes('not found')) {
      return {
        stores: [],
        lastUpdated: new Date().toISOString(),
      };
    }
    if (__DEV__) {
      console.error('Error fetching rankings:', error);
    }
    return {
      stores: [],
      lastUpdated: new Date().toISOString(),
    };
  }
};

/**
 * Record a store visit and update global rankings
 */
export const recordStoreVisit = async (
  storeName: string,
  placeId?: string
): Promise<GlobalRankings> => {
  try {
    // Get current rankings
    const rankings = await getGlobalRankings();

    // Normalize store name for comparison
    const normalizedName = storeName.trim().toLowerCase();

    // Find existing store or create new entry
    const existingIndex = rankings.stores.findIndex(
      (s) => s.storeName.toLowerCase() === normalizedName
    );

    if (existingIndex >= 0) {
      // Update existing store
      rankings.stores[existingIndex].visitCount += 1;
      rankings.stores[existingIndex].lastVisited = new Date().toISOString();
      if (placeId && !rankings.stores[existingIndex].placeId) {
        rankings.stores[existingIndex].placeId = placeId;
      }
    } else {
      // Add new store
      rankings.stores.push({
        storeName: storeName.trim(),
        placeId,
        visitCount: 1,
        lastVisited: new Date().toISOString(),
      });
    }

    // Sort by visit count (descending)
    rankings.stores.sort((a, b) => b.visitCount - a.visitCount);

    // Keep only top 100 stores to prevent file from growing too large
    rankings.stores = rankings.stores.slice(0, 100);

    // Update timestamp
    rankings.lastUpdated = new Date().toISOString();

    // Save updated rankings
    await saveRankings(rankings);

    return rankings;
  } catch (error) {
    if (__DEV__) {
      console.error('Error recording store visit:', error);
    }
    throw error;
  }
};

/**
 * Save rankings to S3
 */
const saveRankings = async (rankings: GlobalRankings): Promise<void> => {
  const jsonData = JSON.stringify(rankings, null, 2);

  await uploadData({
    path: `public/${RANKINGS_FILE}`,
    data: jsonData,
    options: {
      contentType: 'application/json',
    },
  }).result;
};

/**
 * Get top N stores
 */
export const getTopStores = async (limit: number = 5): Promise<StoreVisit[]> => {
  const rankings = await getGlobalRankings();
  return rankings.stores.slice(0, limit);
};

/**
 * Get a store's rank
 */
export const getStoreRank = async (storeName: string): Promise<number | null> => {
  const rankings = await getGlobalRankings();
  const normalizedName = storeName.trim().toLowerCase();

  const index = rankings.stores.findIndex((s) => s.storeName.toLowerCase() === normalizedName);

  return index >= 0 ? index + 1 : null;
};
