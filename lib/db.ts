import { createClient } from '@libsql/client';

const globalForDb = globalThis as unknown as {
  dbClient?: ReturnType<typeof createClient>;
};

export const db =
  globalForDb.dbClient ??
  createClient({
    url: process.env.DATABASE_URL ?? 'file:local.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

if (process.env.NODE_ENV !== 'production') {
  globalForDb.dbClient = db;
}
