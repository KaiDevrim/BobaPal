import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 3,
  tables: [
    tableSchema({
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
        { name: 'latitude', type: 'number', isOptional: true },
        { name: 'longitude', type: 'number', isOptional: true },
        { name: 'place_id', type: 'string', isOptional: true },
      ],
    }),
  ],
});
