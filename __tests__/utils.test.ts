// Tests for utility functions and helpers

describe('Utility functions', () => {
  describe('Price formatting', () => {
    const formatPrice = (price: number): string => {
      return `$${price.toFixed(2)}`;
    };

    it('formats whole numbers with decimal', () => {
      expect(formatPrice(5)).toBe('$5.00');
    });

    it('formats decimal prices correctly', () => {
      expect(formatPrice(5.99)).toBe('$5.99');
    });

    it('handles zero', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });

    it('rounds to two decimal places', () => {
      expect(formatPrice(5.999)).toBe('$6.00');
    });
  });

  describe('Date formatting', () => {
    const formatDate = (dateString: string): string => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    it('formats ISO date string', () => {
      const result = formatDate('2024-12-31');
      expect(result).toContain('Dec');
      expect(result).toContain('31');
      expect(result).toContain('2024');
    });
  });

  describe('Rating emoji', () => {
    const getRatingEmoji = (rating: number): string => {
      const emojis = ['😢', '😕', '😐', '😊', '🤩'];
      return emojis[rating - 1] || '😐';
    };

    it('returns sad emoji for rating 1', () => {
      expect(getRatingEmoji(1)).toBe('😢');
    });

    it('returns meh emoji for rating 2', () => {
      expect(getRatingEmoji(2)).toBe('😕');
    });

    it('returns neutral emoji for rating 3', () => {
      expect(getRatingEmoji(3)).toBe('😐');
    });

    it('returns happy emoji for rating 4', () => {
      expect(getRatingEmoji(4)).toBe('😊');
    });

    it('returns excited emoji for rating 5', () => {
      expect(getRatingEmoji(5)).toBe('🤩');
    });

    it('returns default for invalid rating', () => {
      expect(getRatingEmoji(0)).toBe('😐');
      expect(getRatingEmoji(6)).toBe('😐');
    });
  });

  describe('Store name normalization', () => {
    const normalizeStoreName = (name: string): string => {
      return name.trim().toLowerCase();
    };

    it('trims whitespace', () => {
      expect(normalizeStoreName('  Boba Guys  ')).toBe('boba guys');
    });

    it('converts to lowercase', () => {
      expect(normalizeStoreName('BOBA GUYS')).toBe('boba guys');
    });

    it('handles already normalized names', () => {
      expect(normalizeStoreName('boba guys')).toBe('boba guys');
    });
  });

  describe('S3 key generation', () => {
    const generateS3Key = (fileName: string): string => {
      const timestamp = Date.now();
      return `drinks/${timestamp}_${fileName}`;
    };

    it('includes drinks folder prefix', () => {
      const key = generateS3Key('test.jpg');
      expect(key).toMatch(/^drinks\//);
    });

    it('includes timestamp', () => {
      const before = Date.now();
      const key = generateS3Key('test.jpg');
      const after = Date.now();

      const match = key.match(/drinks\/(\d+)_/);
      expect(match).not.toBeNull();

      const timestamp = parseInt(match![1], 10);
      expect(timestamp).toBeGreaterThanOrEqual(before);
      expect(timestamp).toBeLessThanOrEqual(after);
    });

    it('includes original filename', () => {
      const key = generateS3Key('test.jpg');
      expect(key).toContain('test.jpg');
    });
  });

  describe('Input validation', () => {
    const isValidEmail = (email: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    it('validates correct email', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
    });

    it('rejects email without @', () => {
      expect(isValidEmail('testexample.com')).toBe(false);
    });

    it('rejects email without domain', () => {
      expect(isValidEmail('test@')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('Array utilities', () => {
    const chunk = <T>(array: T[], size: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    it('chunks array into specified size', () => {
      const arr = [1, 2, 3, 4, 5, 6];
      const result = chunk(arr, 2);
      expect(result).toEqual([
        [1, 2],
        [3, 4],
        [5, 6],
      ]);
    });

    it('handles uneven chunks', () => {
      const arr = [1, 2, 3, 4, 5];
      const result = chunk(arr, 2);
      expect(result).toEqual([[1, 2], [3, 4], [5]]);
    });

    it('handles empty array', () => {
      const result = chunk([], 2);
      expect(result).toEqual([]);
    });
  });
});
