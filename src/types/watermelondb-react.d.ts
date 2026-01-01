declare module '@nozbe/watermelondb/DatabaseProvider' {
  import { ComponentType, ReactNode } from 'react';
  import { Database } from '@nozbe/watermelondb';

  interface DatabaseProviderProps {
    database: Database;
    children: ReactNode;
  }

  const DatabaseProvider: ComponentType<DatabaseProviderProps>;
  export default DatabaseProvider;

  export const DatabaseContext: React.Context<Database | undefined>;
  export const DatabaseConsumer: React.Consumer<Database | undefined>;
  export function withDatabase<P extends object>(
    Component: ComponentType<P>
  ): ComponentType<Omit<P, 'database'>>;
}
