#!/usr/bin/env node
// Promote a user to the `admin` role by email.
// Usage: pnpm promote-admin <email>
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));

function loadDbUrl() {
  if (process.env.DB_URL) return process.env.DB_URL;
  try {
    const content = readFileSync(resolve(here, '../apps/api/.env'), 'utf8');
    const match = content.match(/^\s*DB_URL\s*=\s*(.+)\s*$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  } catch {
    // ignore — reported below
  }
  return undefined;
}

const email = process.argv[2];
if (!email) {
  console.error('Usage: pnpm promote-admin <email>');
  process.exit(1);
}

const connectionString = loadDbUrl();
if (!connectionString) {
  console.error('DB_URL not found (checked process.env and apps/api/.env).');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
try {
  const { rows } = await pool.query(
    `UPDATE users SET role = 'admin', updated_at = now()
     WHERE email = $1
     RETURNING id, email, role`,
    [email],
  );

  if (rows.length === 0) {
    console.error(`No user found with email: ${email}`);
    process.exitCode = 1;
  } else {
    console.log(`✓ Promoted ${rows[0].email} to admin (role=${rows[0].role}).`);
  }
} catch (err) {
  console.error('Failed to promote user:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
