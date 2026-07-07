import { sql } from 'drizzle-orm';
import {
  uuid,
  text,
  index,
  boolean,
  pgTable,
  timestamp,
} from 'drizzle-orm/pg-core';

import { ticketStatusEnum, ticketPriorityEnum } from './enum.js';
export { ticketStatusEnum, ticketPriorityEnum } from './enum.js';

export const usersTable = pgTable('users', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuidv7()`),

  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),
  role: text('role').default('agent'),
  banned: boolean('banned').default(false),
  banReason: text('ban_reason'),
  banExpires: timestamp('ban_expires'),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const sessionsTable = pgTable('sessions', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuidv7()`),

  token: text('token').notNull().unique(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),

  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  impersonatedBy: text('impersonated_by'),
});

export const accountsTable = pgTable('accounts', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuidv7()`),

  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),

  accessTokenExpiresAt: timestamp('access_token_expires_at', {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
    withTimezone: true,
  }),

  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const verificationsTable = pgTable('verifications', {
  id: uuid('id')
    .primaryKey()
    .default(sql`uuidv7()`),

  value: text('value').notNull(),
  identifier: text('identifier').notNull(),

  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const ticketsTable = pgTable(
  'tickets',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`uuidv7()`),

    title: text('title').notNull(),
    description: text('description').notNull(),
    customerName: text('customer_name').notNull(),
    customerEmail: text('customer_email').notNull(),

    status: ticketStatusEnum('status').notNull().default('open'),
    priority: ticketPriorityEnum('priority').notNull(),

    createdBy: uuid('created_by').references(() => usersTable.id, {
      onDelete: 'set null',
    }),
    assignedTo: uuid('assigned_to').references(() => usersTable.id, {
      onDelete: 'set null',
    }),

    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index('tickets_status_idx').on(table.status),
    index('tickets_priority_idx').on(table.priority),
    index('tickets_created_at_idx').on(table.createdAt),
  ],
);
