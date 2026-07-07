import { relations } from './relations.js';

import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

export * from 'drizzle-orm';
export * from 'drizzle-orm/node-postgres';

export { Pool } from 'pg';
export { PgColumn, PgTable } from 'drizzle-orm/pg-core';

export type Database = NodePgDatabase<typeof relations>;
