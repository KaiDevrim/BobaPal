import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations';

export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'drinks',
          columns: [
            { name: 'photo_url', type: 'string', isOptional: true },
            { name: 's3_key', type: 'string', isOptional: true },
            { name: 'user_id', type: 'string' },
            { name: 'synced', type: 'boolean' },
            { name: 'last_modified', type: 'number' },
          ],
        }),
      ],
    },
  ],
});
