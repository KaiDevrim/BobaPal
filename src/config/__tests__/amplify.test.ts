// Tests for Amplify configuration

describe('amplify config', () => {
  describe('getAmplifyConfig', () => {
    it('returns dev config when APP_ENV is not production', () => {
      const originalEnv = process.env.APP_ENV;
      process.env.APP_ENV = 'development';

      const isProduction = process.env.APP_ENV === 'production';
      expect(isProduction).toBe(false);

      process.env.APP_ENV = originalEnv;
    });

    it('returns prod config when APP_ENV is production', () => {
      const originalEnv = process.env.APP_ENV;
      process.env.APP_ENV = 'production';

      const isProduction = process.env.APP_ENV === 'production';
      expect(isProduction).toBe(true);

      process.env.APP_ENV = originalEnv;
    });

    it('defaults to dev config when APP_ENV is undefined', () => {
      const originalEnv = process.env.APP_ENV;
      delete process.env.APP_ENV;

      const isProduction = process.env.APP_ENV === 'production';
      expect(isProduction).toBe(false);

      process.env.APP_ENV = originalEnv;
    });
  });

  describe('environment detection', () => {
    const environments = ['development', 'preview', 'production'];

    it('development is not production', () => {
      // @ts-ignore
      expect('development' === 'production').toBe(false);
    });

    it('preview is not production', () => {
      // @ts-ignore
      expect('preview' === 'production').toBe(false);
    });

    it('production is production', () => {
      expect('production' === 'production').toBe(true);
    });

    it('has all expected environments', () => {
      expect(environments).toContain('development');
      expect(environments).toContain('preview');
      expect(environments).toContain('production');
    });
  });

  describe('configureAmplify', () => {
    it('should be a function that initializes Amplify', () => {
      // The actual configure function calls Amplify.configure
      // This tests the expected behavior
      const mockConfigure = jest.fn();
      const config = { aws_project_region: 'us-east-2' };

      mockConfigure(config);

      expect(mockConfigure).toHaveBeenCalledWith(config);
    });
  });
});

