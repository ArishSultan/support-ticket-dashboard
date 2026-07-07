import { defineRelations } from 'drizzle-orm';

import * as schema from './schema.js';

export const relations = defineRelations(schema, (r) => ({
  usersTable: {
    ownedTickets: r.many.ticketsTable({
      alias: 'owned_ticket',
      from: r.usersTable.id,
      to: r.ticketsTable.createdBy,
    }),
    assignedTickets: r.many.ticketsTable({
      alias: 'assigned_ticket',
      from: r.usersTable.id,
      to: r.ticketsTable.assignedTo,
    }),
  },

  ticketsTable: {
    owner: r.one.usersTable({
      alias: 'owned_ticket',
      from: r.ticketsTable.createdBy,
      to: r.usersTable.id,
    }),

    assignee: r.one.usersTable({
      alias: 'assigned_ticket',
      from: r.ticketsTable.assignedTo,
      to: r.usersTable.id,
    }),
  },
}));
