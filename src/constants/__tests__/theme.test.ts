import { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOWS } from '../theme';

describe('theme constants', () => {
  describe('COLORS', () => {
    it('has primary color defined', () => {
      expect(COLORS.primary).toBe('#FF9800');
    });

    it('has secondary color defined', () => {
      expect(COLORS.secondary).toBe('#4A90E2');
    });

    it('has background colors defined', () => {
      expect(COLORS.background).toBe('#FFFFFF');
      expect(COLORS.backgroundAlt).toBe('#FFF8F0');
    });

    it('has text colors defined', () => {
      expect(COLORS.text.primary).toBe('#333333');
      expect(COLORS.text.secondary).toBe('#666666');
      expect(COLORS.text.accent).toBe('#3D2317');
      expect(COLORS.text.light).toBe('#999999');
    });

    it('has border color defined', () => {
      expect(COLORS.border).toBe('#DDDDDD');
    });

    it('has bottomBar color defined', () => {
      expect(COLORS.bottomBar).toBe('#583B39');
    });
  });

  describe('SPACING', () => {
    it('has all spacing values defined', () => {
      expect(SPACING.xs).toBe(4);
      expect(SPACING.sm).toBe(8);
      expect(SPACING.md).toBe(12);
      expect(SPACING.lg).toBe(16);
      expect(SPACING.xl).toBe(20);
      expect(SPACING.xxl).toBe(24);
    });

    it('spacing values increase consistently', () => {
      expect(SPACING.sm).toBeGreaterThan(SPACING.xs);
      expect(SPACING.md).toBeGreaterThan(SPACING.sm);
      expect(SPACING.lg).toBeGreaterThan(SPACING.md);
      expect(SPACING.xl).toBeGreaterThan(SPACING.lg);
      expect(SPACING.xxl).toBeGreaterThan(SPACING.xl);
    });
  });

  describe('FONT_SIZES', () => {
    it('has all font sizes defined', () => {
      expect(FONT_SIZES.xs).toBe(12);
      expect(FONT_SIZES.sm).toBe(14);
      expect(FONT_SIZES.md).toBe(16);
      expect(FONT_SIZES.lg).toBe(18);
      expect(FONT_SIZES.xl).toBe(20);
      expect(FONT_SIZES.xxl).toBe(24);
      expect(FONT_SIZES.xxxl).toBe(32);
      expect(FONT_SIZES.title).toBe(48);
    });
  });

  describe('BORDER_RADIUS', () => {
    it('has all border radius values defined', () => {
      expect(BORDER_RADIUS.sm).toBe(8);
      expect(BORDER_RADIUS.md).toBe(12);
      expect(BORDER_RADIUS.lg).toBe(15);
      expect(BORDER_RADIUS.xl).toBe(20);
      expect(BORDER_RADIUS.full).toBe(100);
    });
  });

  describe('SHADOWS', () => {
    it('has small shadow defined', () => {
      expect(SHADOWS.sm).toBeDefined();
      expect(SHADOWS.sm.shadowColor).toBe('#000');
      expect(SHADOWS.sm.elevation).toBe(3);
    });

    it('has medium shadow defined', () => {
      expect(SHADOWS.md).toBeDefined();
      expect(SHADOWS.md.shadowColor).toBe('#000');
      expect(SHADOWS.md.elevation).toBe(5);
    });
  });
});

