import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('exports EmptyState component', () => {
    expect(EmptyState).toBeDefined();
    expect(typeof EmptyState).toBe('function');
  });

  it('component has correct name', () => {
    expect(EmptyState.name).toBe('EmptyState');
  });
});

