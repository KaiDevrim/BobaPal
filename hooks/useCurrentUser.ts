import { useState, useEffect, useCallback } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import type { UserInfo } from '../src/types';

interface UseCurrentUserResult {
  user: UserInfo | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export const useCurrentUser = (): UseCurrentUserResult => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      setUser({
        userId: currentUser.userId,
        identityId: session.identityId || '',
        email: currentUser.signInDetails?.loginId,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();

    const listener = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') fetchUser();
      if (payload.event === 'signedOut') setUser(null);
    });

    return () => listener();
  }, [fetchUser]);

  return { user, loading, refetch: fetchUser };
};
