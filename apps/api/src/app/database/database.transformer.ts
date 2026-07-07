import * as schema from '@org/database/schema';
import type { InferEnum, InferSelectModel } from '@org/database';

import {
  TicketStatus,
  TicketPriority,
} from '../../modules/tickets/entities/ticket.enums';
import { TicketEntity } from '../../modules/tickets/entities/ticket.entity';

type DbTicketStatus = InferEnum<typeof schema.ticketStatusEnum>;
type DbTicketPriority = InferEnum<typeof schema.ticketPriorityEnum>;

const TICKET_STATUS_MAP: Record<DbTicketStatus, TicketStatus> = {
  open: TicketStatus.OPEN,
  resolved: TicketStatus.RESOLVED,
  in_progress: TicketStatus.IN_PROGRESS,
};

const TICKET_PRIORITY_MAP: Record<DbTicketPriority, TicketPriority> = {
  low: TicketPriority.LOW,
  medium: TicketPriority.MEDIUM,
  high: TicketPriority.HIGH,
};

export const fromDb = {
  ticket: (
    value: InferSelectModel<typeof schema.ticketsTable>,
  ): TicketEntity => ({
    id: value.id,
    title: value.title,
    description: value.description,
    customerName: value.customerName,
    customerEmail: value.customerEmail,
    status: TICKET_STATUS_MAP[value.status],
    priority: TICKET_PRIORITY_MAP[value.priority],

    createdBy: value.createdBy,
    assignedTo: value.assignedTo,

    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  }),
};
