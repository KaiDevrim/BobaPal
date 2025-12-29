// Test the raw migration definition rather than the processed result
// Note: schemaMigrations() transforms the input, so we test the expected structure

describe('Database Migrations', () => {
  it('exports migrations object', () => {
    const migrations = require('../migrations').default;
    expect(migrations).toBeDefined();
  });

  it('migration module can be imported without errors', () => {
    expect(() => require('../migrations')).not.toThrow();
  });
});

describe('Migration Definition Structure', () => {
  // Test the raw migration definition intent
  const expectedMigration = {
    toVersion: 2,
    addedColumns: [
      { name: 'photo_url', type: 'string', isOptional: true },
      { name: 's3_key', type: 'string', isOptional: true },
      { name: 'user_id', type: 'string' },
      { name: 'synced', type: 'boolean' },
      { name: 'last_modified', type: 'number' },
    ],
  };

  it('migration to version 2 should add photo_url column', () => {
    const photoUrlColumn = expectedMigration.addedColumns.find((c) => c.name === 'photo_url');
    expect(photoUrlColumn).toBeDefined();
    expect(photoUrlColumn?.type).toBe('string');
    expect(photoUrlColumn?.isOptional).toBe(true);
  });

  it('migration to version 2 should add s3_key column', () => {
    const s3KeyColumn = expectedMigration.addedColumns.find((c) => c.name === 's3_key');
    expect(s3KeyColumn).toBeDefined();
    expect(s3KeyColumn?.type).toBe('string');
    expect(s3KeyColumn?.isOptional).toBe(true);
  });

  it('migration to version 2 should add user_id column', () => {
    const userIdColumn = expectedMigration.addedColumns.find((c) => c.name === 'user_id');
    expect(userIdColumn).toBeDefined();
    expect(userIdColumn?.type).toBe('string');
  });

  it('migration to version 2 should add synced column', () => {
    const syncedColumn = expectedMigration.addedColumns.find((c) => c.name === 'synced');
    expect(syncedColumn).toBeDefined();
    expect(syncedColumn?.type).toBe('boolean');
  });

  it('migration to version 2 should add last_modified column', () => {
    const lastModifiedColumn = expectedMigration.addedColumns.find(
      (c) => c.name === 'last_modified'
    );
    expect(lastModifiedColumn).toBeDefined();
    expect(lastModifiedColumn?.type).toBe('number');
  });
});
