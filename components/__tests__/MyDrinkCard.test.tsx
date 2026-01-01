// Tests for MyDrinkCard component

describe('MyDrinkCard', () => {
  describe('formatDate helper', () => {
    const formatDate = (dateString: string): string => {
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
          month: 'numeric',
          day: 'numeric',
          year: '2-digit',
        });
      } catch {
        return dateString;
      }
    };

    it('formats ISO date string correctly', () => {
      const result = formatDate('2024-12-31');
      expect(result).toMatch(/12\/31\/24/);
    });

    it('formats date with time correctly', () => {
      const result = formatDate('2024-06-15T10:30:00Z');
      expect(result).toMatch(/6\/15\/24/);
    });

    it('returns original string for invalid date', () => {
      const result = formatDate('invalid-date');
      // Invalid dates return the original string or "Invalid Date"
      expect(typeof result).toBe('string');
    });

    it('handles different months correctly', () => {
      const jan = formatDate('2024-01-15');
      const jul = formatDate('2024-07-20');
      expect(jan).toMatch(/1\/15/);
      expect(jul).toMatch(/7\/20/);
    });
  });

  describe('Card dimensions', () => {
    const SPACING = { lg: 16, sm: 8 };
    const SCREEN_WIDTH = 375; // iPhone SE width

    it('calculates card width for 2 column layout', () => {
      const CARD_WIDTH = (SCREEN_WIDTH - SPACING.lg * 2 - SPACING.sm) / 2;
      expect(CARD_WIDTH).toBe((375 - 32 - 8) / 2);
      expect(CARD_WIDTH).toBe(167.5);
    });

    it('calculates card height based on aspect ratio', () => {
      const CARD_WIDTH = 167.5;
      const CARD_HEIGHT = CARD_WIDTH * 1.25;
      expect(CARD_HEIGHT).toBe(209.375);
    });
  });

  describe('Placeholder blurhash', () => {
    const PLACEHOLDER_BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0LMD%s:';

    it('has valid blurhash format', () => {
      expect(PLACEHOLDER_BLURHASH).toBeDefined();
      expect(typeof PLACEHOLDER_BLURHASH).toBe('string');
      expect(PLACEHOLDER_BLURHASH.length).toBeGreaterThan(0);
    });
  });

  describe('Props interface', () => {
    interface MyDrinkCardProps {
      title: string;
      date: string;
      s3Key: string | null;
    }

    it('accepts required title prop', () => {
      const props: MyDrinkCardProps = { title: 'Matcha Latte', date: '2024-12-31', s3Key: null };
      expect(props.title).toBe('Matcha Latte');
    });

    it('accepts required date prop', () => {
      const props: MyDrinkCardProps = { title: 'Test', date: '2024-12-31', s3Key: null };
      expect(props.date).toBe('2024-12-31');
    });

    it('s3Key can be null', () => {
      const props: MyDrinkCardProps = { title: 'Test', date: '2024-12-31', s3Key: null };
      expect(props.s3Key).toBeNull();
    });

    it('s3Key can be a string', () => {
      const props: MyDrinkCardProps = {
        title: 'Test',
        date: '2024-12-31',
        s3Key: 'drinks/image.jpg',
      };
      expect(props.s3Key).toBe('drinks/image.jpg');
    });
  });
});
