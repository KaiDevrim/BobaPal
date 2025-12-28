import { useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

interface UserInfo {
  userId: string;
  identityId: string;
  email?: string;
}

export const useCurrentUser = () => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
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
    };

    fetchUser();

    const listener = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') fetchUser();
      if (payload.event === 'signedOut') setUser(null);
    });

    return () => listener();
  }, []);

  return { user, loading };
};
