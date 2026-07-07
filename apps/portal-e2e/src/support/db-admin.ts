import pg from 'pg';
import { execSync } from 'node:child_process';

import { ROOT, getTestDbUrl } from './e2e.config';

function migrate(): void {
  execSync('pnpm -C libs/database exec drizzle-kit migrate', {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, DB_URL: getTestDbUrl() },
  });
}

async function truncateAll(): Promise<void> {
  const client = new pg.Client({ connectionString: getTestDbUrl() });
  await client.connect();
  try {
    await client.query(`DO $$
      DECLARE r RECORD;
      BEGIN
        FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
          EXECUTE 'TRUNCATE TABLE public.' || quote_ident(r.tablename)
            || ' RESTART IDENTITY CASCADE';
        END LOOP;
      END $$;`);
  } finally {
    await client.end();
  }
}

export async function provisionTestDatabase(): Promise<void> {
  console.log('[e2e] preparing test database (migrate + clean)...');
  migrate();
  await truncateAll();
  console.log('[e2e] test database ready.');
}

export async function teardownTestDatabase(): Promise<void> {
  await truncateAll();
  console.log('[e2e] cleaned test database.');
}
