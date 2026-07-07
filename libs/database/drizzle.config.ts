import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Load DB_URL from the API's env file so migrations and the running API share a
// single source of truth (falls back to any DB_URL already in the environment).
const here = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(here, '../../apps/api/.env') });

export default defineConfig({
  strict: true,
  verbose: true,

  dialect: 'postgresql',

  out: './migrations',
  schema: './src/schema.ts',

  dbCredentials: { url: process.env.DB_URL! },
});
