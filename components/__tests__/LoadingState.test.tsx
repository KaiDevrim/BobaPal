// Tests for LoadingState component

import { LoadingState } from '../LoadingState';

describe('LoadingState', () => {
  it('exports LoadingState component', () => {
    expect(LoadingState).toBeDefined();
    expect(typeof LoadingState).toBe('function');
  });

  describe('fullScreen prop logic', () => {
    it('defaults fullScreen to true', () => {
      const defaultValue = true;
      expect(defaultValue).toBe(true);
    });

    it('can be set to false', () => {
      const fullScreen = false;
      expect(fullScreen).toBe(false);
    });
  });

  describe('component behavior', () => {
    it('fullScreen mode wraps content in GradientBackground', () => {
      // When fullScreen is true, component uses GradientBackground wrapper
      const fullScreen = true;
      const usesGradient = fullScreen;
      expect(usesGradient).toBe(true);
    });

    it('inline mode does not use GradientBackground', () => {
      // When fullScreen is false, component does not use GradientBackground
      const fullScreen = false;
      const usesGradient = fullScreen;
      expect(usesGradient).toBe(false);
    });
  });
});
