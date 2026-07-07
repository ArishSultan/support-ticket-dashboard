import {
  CreateTicketDtoPriority,
  TicketEntityStatus,
} from '@org/api-client';

/** Priority options, derived from the generated DTO enum (single source of truth). */
export const PRIORITY_OPTIONS: Array<{
  value: CreateTicketDtoPriority;
  label: string;
}> = [
  { value: CreateTicketDtoPriority.low, label: 'Low' },
  { value: CreateTicketDtoPriority.medium, label: 'Medium' },
  { value: CreateTicketDtoPriority.high, label: 'High' },
];

/** Status options, derived from the generated entity enum. */
export const STATUS_OPTIONS: Array<{
  value: TicketEntityStatus;
  label: string;
}> = [
  { value: TicketEntityStatus.open, label: 'Open' },
  { value: TicketEntityStatus.in_progress, label: 'In Progress' },
  { value: TicketEntityStatus.resolved, label: 'Resolved' },
];

/** Ordered kanban columns (one per status) with accent styling. */
export const STATUS_COLUMNS: Array<{
  id: TicketEntityStatus;
  title: string;
  accent: string;
}> = [
  {
    id: TicketEntityStatus.open,
    title: 'Open',
    accent: 'border-t-blue-500 bg-blue-50/20 dark:bg-blue-950/10',
  },
  {
    id: TicketEntityStatus.in_progress,
    title: 'In Progress',
    accent: 'border-t-amber-500 bg-amber-50/20 dark:bg-amber-950/10',
  },
  {
    id: TicketEntityStatus.resolved,
    title: 'Resolved',
    accent: 'border-t-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/10',
  },
];
