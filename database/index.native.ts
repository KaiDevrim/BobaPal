import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'

import schema from './schema'
import migrations from './migrations'
import Drink from './model/Drink'

// First, create the adapter to the underlying database:
const adapter = new SQLiteAdapter({
  schema: schema,
  // (You might want to comment it out for development purposes -- see Migrations documentation)
  migrations: migrations,
  jsi: false,
  onSetUpError: error => {
    console.error('Database setup error:', error)
  }
})

// Then, make a Watermelon database from it!
const database = new Database({
  adapter,
  modelClasses: [
    Drink,
  ],
})

export default database;