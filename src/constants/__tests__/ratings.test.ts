import { RATINGS, RATING_EMOJIS } from '../ratings';

describe('ratings constants', () => {
  describe('RATINGS', () => {
    it('has 4 rating options', () => {
      expect(RATINGS).toHaveLength(4);
    });

    it('has correct values from 1 to 4', () => {
      expect(RATINGS[0].value).toBe(1);
      expect(RATINGS[1].value).toBe(2);
      expect(RATINGS[2].value).toBe(3);
      expect(RATINGS[3].value).toBe(4);
    });

    it('has emoji for each rating', () => {
      RATINGS.forEach((rating) => {
        expect(rating.emoji).toBeDefined();
        expect(typeof rating.emoji).toBe('string');
      });
    });

    it('has correct emojis', () => {
      expect(RATINGS[0].emoji).toBe('😞');
      expect(RATINGS[1].emoji).toBe('😐');
      expect(RATINGS[2].emoji).toBe('🙂');
      expect(RATINGS[3].emoji).toBe('😊');
    });
  });

  describe('RATING_EMOJIS', () => {
    it('has emojis for ratings 1-4', () => {
      expect(RATING_EMOJIS[1]).toBe('😞');
      expect(RATING_EMOJIS[2]).toBe('😐');
      expect(RATING_EMOJIS[3]).toBe('🙂');
      expect(RATING_EMOJIS[4]).toBe('😊');
    });

    it('matches RATINGS array', () => {
      RATINGS.forEach((rating) => {
        expect(RATING_EMOJIS[rating.value]).toBe(rating.emoji);
      });
    });
  });
});

