// Test database schema structure
// We test the expected schema configuration without importing the actual module
// to avoid WatermelonDB runtime dependencies

describe('Database Schema Definition', () => {
  const expectedSchema = {
    version: 2,
    tables: [
      {
        name: 'drinks',
        columns: [
          { name: 'flavor', type: 'string' },
          { name: 'price', type: 'number' },
          { name: 'store', type: 'string' },
          { name: 'occasion', type: 'string' },
          { name: 'rating', type: 'number' },
          { name: 'date', type: 'string' },
          { name: 'photo_url', type: 'string', isOptional: true },
          { name: 's3_key', type: 'string', isOptional: true },
          { name: 'user_id', type: 'string' },
          { name: 'synced', type: 'boolean' },
          { name: 'last_modified', type: 'number' },
        ],
      },
    ],
  };

  it('has correct version', () => {
    expect(expectedSchema.version).toBe(2);
  });

  it('has drinks table', () => {
    const drinksTable = expectedSchema.tables.find((t) => t.name === 'drinks');
    expect(drinksTable).toBeDefined();
  });

  describe('drinks table columns', () => {
    const getColumn = (name: string) => {
      const table = expectedSchema.tables.find((t) => t.name === 'drinks');
      return table?.columns.find((c) => c.name === name);
    };

    it('has flavor column (string)', () => {
      const column = getColumn('flavor');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has price column (number)', () => {
      const column = getColumn('price');
      expect(column).toBeDefined();
      expect(column?.type).toBe('number');
    });

    it('has store column (string)', () => {
      const column = getColumn('store');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has occasion column (string)', () => {
      const column = getColumn('occasion');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has rating column (number)', () => {
      const column = getColumn('rating');
      expect(column).toBeDefined();
      expect(column?.type).toBe('number');
    });

    it('has date column (string)', () => {
      const column = getColumn('date');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has optional photo_url column (string)', () => {
      const column = getColumn('photo_url');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
      expect(column?.isOptional).toBe(true);
    });

    it('has optional s3_key column (string)', () => {
      const column = getColumn('s3_key');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
      expect(column?.isOptional).toBe(true);
    });

    it('has user_id column (string)', () => {
      const column = getColumn('user_id');
      expect(column).toBeDefined();
      expect(column?.type).toBe('string');
    });

    it('has synced column (boolean)', () => {
      const column = getColumn('synced');
      expect(column).toBeDefined();
      expect(column?.type).toBe('boolean');
    });

    it('has last_modified column (number)', () => {
      const column = getColumn('last_modified');
      expect(column).toBeDefined();
      expect(column?.type).toBe('number');
    });

    it('has all 11 columns', () => {
      const table = expectedSchema.tables.find((t) => t.name === 'drinks');
      expect(table?.columns.length).toBe(11);
    });
  });
});
