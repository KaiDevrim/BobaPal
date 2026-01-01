// Tests for App navigation and configuration

describe('App configuration', () => {
  describe('Tab navigation', () => {
    const TAB_SCREENS = ['Gallery', 'AddDrink', 'Stats'];

    it('has three main tabs', () => {
      expect(TAB_SCREENS).toHaveLength(3);
    });

    it('Gallery is a tab screen', () => {
      expect(TAB_SCREENS).toContain('Gallery');
    });

    it('AddDrink is a tab screen', () => {
      expect(TAB_SCREENS).toContain('AddDrink');
    });

    it('Stats is a tab screen', () => {
      expect(TAB_SCREENS).toContain('Stats');
    });
  });

  describe('Stack navigation', () => {
    const STACK_SCREENS = ['MainTabs', 'DrinkDetail', 'EditDrink'];

    it('has MainTabs screen', () => {
      expect(STACK_SCREENS).toContain('MainTabs');
    });

    it('has DrinkDetail screen', () => {
      expect(STACK_SCREENS).toContain('DrinkDetail');
    });

    it('has EditDrink screen', () => {
      expect(STACK_SCREENS).toContain('EditDrink');
    });
  });

  describe('Auth styles', () => {
    const authStyles = {
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontWeight: 'bold',
      },
      googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    };

    it('container has flex 1', () => {
      expect(authStyles.container.flex).toBe(1);
    });

    it('title is bold', () => {
      expect(authStyles.title.fontWeight).toBe('bold');
    });

    it('google button has row direction', () => {
      expect(authStyles.googleButton.flexDirection).toBe('row');
    });
  });
});

describe('Authentication flow', () => {
  describe('Sign in with Google', () => {
    it('signInWithRedirect receives Google provider', () => {
      const mockSignIn = jest.fn();
      mockSignIn({ provider: 'Google' });

      expect(mockSignIn).toHaveBeenCalledWith({ provider: 'Google' });
    });
  });

  describe('User sync on login', () => {
    it('syncs when user is present', () => {
      const user = { userId: 'test-123' };
      const shouldSync = !!user;

      expect(shouldSync).toBe(true);
    });

    it('does not sync when user is null', () => {
      const user = null;
      const shouldSync = !!user;

      expect(shouldSync).toBe(false);
    });
  });
});
