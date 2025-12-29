// Mock WatermelonDB schema functions
jest.mock('@nozbe/watermelondb', () => ({
  appSchema: jest.fn((config) => config),
  tableSchema: jest.fn((config) => config),
}));

import schema from '../schema';

describe('Database Schema', () => {
  it('has correct version', () => {
    expect(schema.version).toBe(2);
  });

  it('has drinks table', () => {
    const drinksTable = schema.tables.find((t: any) => t.name === 'drinks');
    expect(drinksTable).toBeDefined();
  });

  describe('drinks table', () => {
    const getTable = () => schema.tables.find((t: any) => t.name === 'drinks');
    const getColumn = (name: string) =>
      getTable()?.columns.find((c: any) => c.name === name);

    it('has flavor column', () => {
      const column = getColumn('flavor');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has price column', () => {
      const column = getColumn('price');
      expect(column).toBeDefined();
      expect(column?.type).toBe('number');
    });

    it('has store column', () => {
      const column = getColumn('store');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has occasion column', () => {
      const column = getColumn('occasion');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has rating column', () => {
      const column = getColumn('rating');
      expect(column).toBeDefined();
      expect(column?.type).toBe('number');
    });

    it('has date column', () => {
      const column = getColumn('date');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has optional photo_url column', () => {
      const column = getColumn('photo_url');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
      expect(column?.isOptional).toBe(true);
    });

    it('has optional s3_key column', () => {
      const column = getColumn('s3_key');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
      expect(column?.isOptional).toBe(true);
    });

    it('has user_id column', () => {
      const column = getColumn('user_id');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has synced column', () => {
      const column = getColumn('synced');
      expect(column).toBeDefined();
      expect(column?.type).toBe('boolean');
    });

    it('has last_modified column', () => {
      const column = getColumn('last_modified');
      expect(column).toBeDefined();
      expect(column?.type).toBe('number');
    });
  });
});

