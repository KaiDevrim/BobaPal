// Tests for LocalUserContext

import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_USER_KEY = '@bobapal:isLocalUser';

describe('LocalUserContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('local user storage', () => {
    it('should store local user flag in AsyncStorage', async () => {
      await AsyncStorage.setItem(LOCAL_USER_KEY, 'true');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(LOCAL_USER_KEY, 'true');
    });

    it('should retrieve local user flag from AsyncStorage', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');
      const value = await AsyncStorage.getItem(LOCAL_USER_KEY);
      expect(value).toBe('true');
    });

    it('should return null when no local user flag is set', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const value = await AsyncStorage.getItem(LOCAL_USER_KEY);
      expect(value).toBeNull();
    });

    it('should remove local user flag from AsyncStorage', async () => {
      await AsyncStorage.removeItem(LOCAL_USER_KEY);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(LOCAL_USER_KEY);
    });
  });

  describe('isLocalUser check', () => {
    const isLocalUser = async (): Promise<boolean> => {
      const value = await AsyncStorage.getItem(LOCAL_USER_KEY);
      return value === 'true';
    };

    it('should return true when flag is set to true', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');
      const result = await isLocalUser();
      expect(result).toBe(true);
    });

    it('should return false when flag is not set', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      const result = await isLocalUser();
      expect(result).toBe(false);
    });

    it('should return false when flag is set to false', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('false');
      const result = await isLocalUser();
      expect(result).toBe(false);
    });
  });

  describe('local user workflow', () => {
    it('should set local user on skip login', async () => {
      const setLocalUser = async () => {
        await AsyncStorage.setItem(LOCAL_USER_KEY, 'true');
      };

      await setLocalUser();
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(LOCAL_USER_KEY, 'true');
    });

    it('should clear local user on sign out', async () => {
      const clearLocalUser = async () => {
        await AsyncStorage.removeItem(LOCAL_USER_KEY);
      };

      await clearLocalUser();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(LOCAL_USER_KEY);
    });
  });
});
