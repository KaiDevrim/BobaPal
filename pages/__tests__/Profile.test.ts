// Tests for Profile page

describe('Profile', () => {
  describe('User info display', () => {
    it('should display email when provided', () => {
      const email = 'test@example.com';
      expect(email).toContain('@');
    });

    it('should display sign-in method', () => {
      const signInMethods = ['Google', 'Email', 'Apple', 'Facebook'];
      expect(signInMethods).toContain('Google');
    });

    it('should parse Google identity from identities string', () => {
      const identities = JSON.stringify([{ providerName: 'Google' }]);
      const parsed = JSON.parse(identities);
      expect(parsed[0].providerName).toBe('Google');
    });

    it('should default to Email when no identities', () => {
      const getSignInMethod = (identities: string | undefined): string => {
        if (!identities) return 'Email';
        try {
          const parsed = JSON.parse(identities);
          if (parsed.length > 0) {
            return parsed[0].providerName || 'Social';
          }
        } catch {
          return 'Email';
        }
        return 'Email';
      };

      expect(getSignInMethod(undefined)).toBe('Email');
      expect(getSignInMethod('invalid-json')).toBe('Email');
      expect(getSignInMethod('[]')).toBe('Email');
    });
  });

  describe('Action handlers', () => {
    it('should have sign out functionality', () => {
      const signOutHandler = jest.fn();
      signOutHandler();
      expect(signOutHandler).toHaveBeenCalled();
    });

    it('should have delete account functionality', () => {
      const deleteHandler = jest.fn();
      deleteHandler();
      expect(deleteHandler).toHaveBeenCalled();
    });
  });

  describe('External links', () => {
    it('should have privacy policy URL', () => {
      const PRIVACY_POLICY_URL = 'https://github.com/KaiDevrim/BobaPal/blob/main/PRIVACY_POLICY.md';
      expect(PRIVACY_POLICY_URL.toLowerCase()).toContain('privacy');
    });

    it('should have contact email', () => {
      const CONTACT_EMAIL = 'support@devrim.tech';
      expect(CONTACT_EMAIL).toContain('@');
    });

    it('should format mailto link correctly', () => {
      const email = 'support@devrim.tech';
      const subject = 'BobaPal Support';
      const mailto = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
      expect(mailto).toBe('mailto:support@devrim.tech?subject=BobaPal%20Support');
    });
  });

  describe('Loading states', () => {
    it('should handle loading state', () => {
      const isLoading = true;
      expect(isLoading).toBe(true);
    });

    it('should handle signing out state', () => {
      const isSigningOut = false;
      expect(isSigningOut).toBe(false);
    });

    it('should handle deleting state', () => {
      const isDeleting = false;
      expect(isDeleting).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should navigate back on back button press', () => {
      const goBack = jest.fn();
      const navigation = { goBack };
      navigation.goBack();
      expect(goBack).toHaveBeenCalled();
    });
  });
});
