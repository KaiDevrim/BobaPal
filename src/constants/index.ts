export * from './theme';
export * from './ratings';

export const CACHE_DURATION_MS = 50 * 60 * 1000; // 50 minutes (before 1hr S3 URL expiry)

export const DEFAULT_IMAGES = {
  boba: require('../../assets/boba.jpg'),
  boba2: require('../../assets/boba2.jpg'),
} as const;
