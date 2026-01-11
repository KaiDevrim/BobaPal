import { useState, useEffect, useCallback } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserInfo } from '../src/types';

const LOCAL_USER_KEY = '@bobapal:isLocalUser';

interface UseCurrentUserResult {
  user: UserInfo | null;
  loading: boolean;
  isLocalUser: boolean;
  refetch: () => Promise<void>;
}

export const useCurrentUser = (): UseCurrentUserResult => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLocalUser, setIsLocalUser] = useState(false);

  const fetchUser = useCallback(async () => {
    try {
      // First check if user is in local mode
      const localUserFlag = await AsyncStorage.getItem(LOCAL_USER_KEY);
      if (localUserFlag === 'true') {
        setIsLocalUser(true);
        setUser({
          userId: 'local-user',
          identityId: 'local-user',
          email: undefined,
        });
        setLoading(false);
        return;
      }

      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      setIsLocalUser(false);
      setUser({
        userId: currentUser.userId,
        identityId: session.identityId || '',
        email: currentUser.signInDetails?.loginId,
      });
    } catch {
      // Check if local user on error (might be offline)
      const localUserFlag = await AsyncStorage.getItem(LOCAL_USER_KEY);
      if (localUserFlag === 'true') {
        setIsLocalUser(true);
        setUser({
          userId: 'local-user',
          identityId: 'local-user',
          email: undefined,
        });
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    const listener = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') fetchUser();
      if (payload.event === 'signedOut') {
        setUser(null);
        setIsLocalUser(false);
      }
    });

    return () => listener();
  }, [fetchUser]);

  return { user, loading, isLocalUser, refetch: fetchUser };
};
