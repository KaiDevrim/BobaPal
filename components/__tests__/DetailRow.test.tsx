import { DetailRow } from '../DetailRow';

describe('DetailRow', () => {
  it('exports DetailRow component', () => {
    expect(DetailRow).toBeDefined();
    expect(typeof DetailRow).toBe('function');
  });

  it('component has correct name', () => {
    expect(DetailRow.name).toBe('DetailRow');
  });
});

