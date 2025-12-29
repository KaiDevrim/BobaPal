import { StatsCard } from '../StatsCard';

describe('StatsCard', () => {
  it('exports StatsCard component', () => {
    expect(StatsCard).toBeDefined();
    expect(typeof StatsCard).toBe('function');
  });

  it('component has correct name', () => {
    expect(StatsCard.name).toBe('StatsCard');
  });
});
