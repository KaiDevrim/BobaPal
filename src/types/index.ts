export * from './navigation';

export interface UserInfo {
  userId: string;
  identityId: string;
  email?: string;
}

export interface DrinkForm {
  flavor: string;
  price: string;
  store: string;
  occasion: string;
  rating: number | null;
  imageUri: string | null;
}

export interface DrinkData {
  id: string;
  flavor: string;
  price: number;
  store: string;
  occasion: string;
  rating: number;
  date: string;
  s3Key: string | null;
  userId: string;
  lastModified: number;
}

export interface StatsData {
  drinkCount: number;
  storeCount: number;
  totalSpent: number;
  topStores: [string, number][];
}
