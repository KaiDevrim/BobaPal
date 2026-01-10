import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_USER_KEY = '@bobapal:isLocalUser';

interface LocalUserContextType {
  isLocalUser: boolean;
  setLocalUser: (value: boolean) => void;
  clearLocalUser: () => Promise<void>;
}

const LocalUserContext = createContext<LocalUserContextType | undefined>(undefined);

export const LocalUserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocalUser, setIsLocalUserState] = useState(false);

  // Load local user preference on mount
  useEffect(() => {
    AsyncStorage.getItem(LOCAL_USER_KEY).then((value) => {
      if (value === 'true') {
        setIsLocalUserState(true);
      }
    });
  }, []);

  const setLocalUser = useCallback((value: boolean) => {
    setIsLocalUserState(value);
    AsyncStorage.setItem(LOCAL_USER_KEY, value ? 'true' : 'false');
  }, []);

  const clearLocalUser = useCallback(async () => {
    setIsLocalUserState(false);
    await AsyncStorage.removeItem(LOCAL_USER_KEY);
  }, []);

  return (
    <LocalUserContext.Provider value={{ isLocalUser, setLocalUser, clearLocalUser }}>
      {children}
    </LocalUserContext.Provider>
  );
};

export const useLocalUser = (): LocalUserContextType => {
  const context = useContext(LocalUserContext);
  if (context === undefined) {
    throw new Error('useLocalUser must be used within a LocalUserProvider');
  }
  return context;
};

/**
 * Check if the user is using the app locally (without sign-in)
 * Can be used outside of React components
 */
export const checkIsLocalUser = async (): Promise<boolean> => {
  const value = await AsyncStorage.getItem(LOCAL_USER_KEY);
  return value === 'true';
};
