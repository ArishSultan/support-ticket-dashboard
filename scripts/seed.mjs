#!/usr/bin/env node
// Seed the database with sample support tickets so the dashboard is populated
// for review. Safe to run repeatedly: previously-seeded rows (matched by title)
// are removed first, so real/manually-created tickets are never touched.
//
// Usage: pnpm seed
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

const here = dirname(fileURLToPath(import.meta.url));

/** Resolve DB_URL from the environment, falling back to apps/api/.env. */
function loadDbUrl() {
  if (process.env.DB_URL) return process.env.DB_URL;
  try {
    const content = readFileSync(resolve(here, '../apps/api/.env'), 'utf8');
    const match = content.match(/^\s*DB_URL\s*=\s*(.+)\s*$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, '');
  } catch {
    // reported below
  }
  return undefined;
}

// status ∈ open | in_progress | resolved   priority ∈ low | medium | high
// createdAt is offset (in hours ago) so the list has a natural timeline.
const SEED_TICKETS = [
  {
    title: 'Unable to complete payment',
    description:
      'The customer receives a generic error after submitting the checkout form. Reproducible with Visa cards; the charge is never created in Stripe.',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    status: 'open',
    priority: 'high',
    hoursAgo: 2,
  },
  {
    title: 'Password reset email never arrives',
    description:
      'Requesting a password reset shows a success message but no email is delivered, even after several minutes and checking spam.',
    customerName: 'Omar Haddad',
    customerEmail: 'omar.haddad@example.com',
    status: 'open',
    priority: 'high',
    hoursAgo: 5,
  },
  {
    title: 'Invoice PDF shows the wrong tax rate',
    description:
      'Generated invoices apply 15% VAT instead of the configured 5% for UAE customers. Totals on screen are correct; only the PDF is wrong.',
    customerName: 'Priya Nair',
    customerEmail: 'priya.nair@example.com',
    status: 'in_progress',
    priority: 'medium',
    hoursAgo: 26,
  },
  {
    title: 'Dashboard charts fail to load on Safari',
    description:
      'Analytics widgets stay in a loading spinner on Safari 17. Chrome and Firefox render correctly. Console shows a chunk load error.',
    customerName: 'Liam O’Connor',
    customerEmail: 'liam.oconnor@example.com',
    status: 'in_progress',
    priority: 'medium',
    hoursAgo: 30,
  },
  {
    title: 'Feature request: export tickets to CSV',
    description:
      'Customer would like to bulk-export their ticket history to CSV for internal reporting. Nice-to-have, no deadline.',
    customerName: 'Sofia Rossi',
    customerEmail: 'sofia.rossi@example.com',
    status: 'open',
    priority: 'low',
    hoursAgo: 48,
  },
  {
    title: 'Mobile app crashes when opening notifications',
    description:
      'On Android 14 the app crashes immediately after tapping the notifications bell. Attached logs point to a null reference.',
    customerName: 'Daniel Kim',
    customerEmail: 'daniel.kim@example.com',
    status: 'open',
    priority: 'high',
    hoursAgo: 8,
  },
  {
    title: 'Typo on the pricing page',
    description:
      'The word "recieve" should be "receive" in the Enterprise plan description. Minor cosmetic issue.',
    customerName: 'Emma Johansson',
    customerEmail: 'emma.johansson@example.com',
    status: 'resolved',
    priority: 'low',
    hoursAgo: 72,
  },
  {
    title: 'Two-factor codes rejected as invalid',
    description:
      'Authenticator-app codes are intermittently rejected. Re-syncing time on the device sometimes helps, suggesting a clock-skew tolerance issue.',
    customerName: 'Carlos Mendes',
    customerEmail: 'carlos.mendes@example.com',
    status: 'resolved',
    priority: 'medium',
    hoursAgo: 96,
  },
  {
    title: 'Bulk import stops halfway through large files',
    description:
      'Importing a 20k-row CSV silently stops around row 12k with no error. Smaller files import fine. Likely a timeout on the worker.',
    customerName: 'Aisha Bello',
    customerEmail: 'aisha.bello@example.com',
    status: 'in_progress',
    priority: 'high',
    hoursAgo: 14,
  },
  {
    title: 'Request to delete account and personal data',
    description:
      'Customer is invoking their right to erasure and wants confirmation once all personal data has been removed from the platform.',
    customerName: 'Noah Williams',
    customerEmail: 'noah.williams@example.com',
    status: 'open',
    priority: 'medium',
    hoursAgo: 20,
  },
];

const connectionString = loadDbUrl();
if (!connectionString) {
  console.error('DB_URL not found (checked process.env and apps/api/.env).');
  process.exit(1);
}

const pool = new pg.Pool({ connectionString });
try {
  const titles = SEED_TICKETS.map((t) => t.title);

  // Idempotent: clear only previously-seeded rows, then re-insert.
  await pool.query(`DELETE FROM tickets WHERE title = ANY($1::text[])`, [
    titles,
  ]);

  for (const t of SEED_TICKETS) {
    await pool.query(
      `INSERT INTO tickets
         (title, description, customer_name, customer_email, status, priority, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, now() - ($7 || ' hours')::interval, now())`,
      [
        t.title,
        t.description,
        t.customerName,
        t.customerEmail,
        t.status,
        t.priority,
        String(t.hoursAgo),
      ],
    );
  }

  console.log(`✓ Seeded ${SEED_TICKETS.length} support tickets.`);
} catch (err) {
  console.error('Failed to seed tickets:', err.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
