import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';
import schema from './schema';
import migrations from './migrations';
import Drink from './model/Drink';

const adapter = new SQLiteAdapter({
  schema,
  migrations,
  // Disable JSI for Expo compatibility - JSI requires special native setup
  onSetUpError: (error) => {
    console.error('Database setup error:', error);
  },
});

const database = new Database({
  adapter,
  modelClasses: [Drink],
});

export default database;
