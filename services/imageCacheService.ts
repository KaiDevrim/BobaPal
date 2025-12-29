import { getImageUrl } from './storageService';
import { CACHE_DURATION_MS } from '../src/constants';

interface CacheEntry {
  url: string;
  expiry: number;
}

const urlCache = new Map<string, CacheEntry>();

export const getCachedImageUrl = async (s3Key: string | null): Promise<string | null> => {
  if (!s3Key) return null;

  const cached = urlCache.get(s3Key);
  const now = Date.now();

  if (cached && cached.expiry > now) {
    return cached.url;
  }

  try {
    const url = await getImageUrl(s3Key);
    urlCache.set(s3Key, { url, expiry: now + CACHE_DURATION_MS });
    return url;
  } catch (error) {
    console.error('Failed to get image URL:', error);
    return null;
  }
};

export const clearImageCache = (): void => {
  urlCache.clear();
};

export const removeFromCache = (s3Key: string): boolean => {
  return urlCache.delete(s3Key);
};

