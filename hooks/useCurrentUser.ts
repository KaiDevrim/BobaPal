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
      const localUserFlag = await AsyncStorage.getItem(LOCAL_USER_KEY);
      if (localUserFlag === 'true') {
        setIsLocalUser((prev) => {
          if (!prev) console.log('[useCurrentUser] Detected local user');
          return true;
        });
        setUser((prev) => {
          if (!prev || prev.userId !== 'local-user') {
            console.log('[useCurrentUser] Setting local user object');
            return {
              userId: 'local-user',
              identityId: 'local-user',
              email: undefined,
            };
          }
          return prev;
        });
        setLoading(false);
        return;
      }

      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      setIsLocalUser((prev) => {
        if (prev) console.log('[useCurrentUser] Switching from local to cloud user');
        return false;
      });
      setUser((prev) => {
        if (!prev || prev.userId !== currentUser.userId) {
          console.log('[useCurrentUser] Setting cloud user object:', currentUser.userId);
          return {
            userId: currentUser.userId,
            identityId: session.identityId || '',
            email: currentUser.signInDetails?.loginId,
          };
        }
        return prev;
      });
    } catch (err) {
      console.log('[useCurrentUser] Error fetching user, checking local:', err);
      const localUserFlag = await AsyncStorage.getItem(LOCAL_USER_KEY);
      if (localUserFlag === 'true') {
        setIsLocalUser((prev) => {
          if (!prev) console.log('[useCurrentUser] Fallback: Detected local user');
          return true;
        });
        setUser((prev) => {
          if (!prev || prev.userId !== 'local-user') {
            console.log('[useCurrentUser] Fallback: Setting local user object');
            return {
              userId: 'local-user',
              identityId: 'local-user',
              email: undefined,
            };
          }
          return prev;
        });
      } else {
        setUser((prev) => {
          if (prev !== null) console.log('[useCurrentUser] Setting user to null');
          return null;
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    const listener = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') {
        console.log('[useCurrentUser] Hub: signedIn event');
        fetchUser();
      }
      if (payload.event === 'signedOut') {
        console.log('[useCurrentUser] Hub: signedOut event');
        setUser((prev) => {
          if (prev !== null) console.log('[useCurrentUser] Hub: Setting user to null');
          return null;
        });
        setIsLocalUser((prev) => {
          if (prev) console.log('[useCurrentUser] Hub: Clearing local user flag');
          return false;
        });
      }
    });

    return () => listener();
  }, [fetchUser]);

  return { user, loading, isLocalUser, refetch: fetchUser };
};
