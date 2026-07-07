'use client';

import Link from 'next/link';
import { format } from 'date-fns';
import { ArrowUpDown, ExternalLink, Pencil } from 'lucide-react';
import {
  TicketsControllerFindAllSortBy,
  TicketsControllerFindAllSortOrder,
  type TicketEntity,
} from '@org/api-client';

import { Card } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from '#/components/ui/table';
import { StatusBadge, PriorityBadge } from '#/components/ui/badges';

import { useUserMap } from '#/features/users/hooks/useUsers';

interface TicketsTableProps {
  tickets: TicketEntity[];
  onEdit: (ticket: TicketEntity) => void;
  sortBy: TicketsControllerFindAllSortBy;
  sortOrder: TicketsControllerFindAllSortOrder;
  onSort: (field: TicketsControllerFindAllSortBy) => void;
}

export function TicketsTable({
  tickets,
  onEdit,
  sortBy,
  sortOrder,
  onSort,
}: TicketsTableProps) {
  const userMap = useUserMap();

  const sortableHead = (
    label: string,
    field: TicketsControllerFindAllSortBy,
  ) => (
    <TableHead
      onClick={() => onSort(field)}
      className="cursor-pointer select-none hover:text-foreground"
      aria-sort={
        sortBy === field
          ? sortOrder === TicketsControllerFindAllSortOrder.asc
            ? 'ascending'
            : 'descending'
          : 'none'
      }
    >
      <span className="flex items-center gap-1">
        {label} <ArrowUpDown className="size-3" />
      </span>
    </TableHead>
  );

  return (
    <Card className="p-0">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ticket</TableHead>
            <TableHead>Customer</TableHead>
            {sortableHead('Status', TicketsControllerFindAllSortBy.status)}
            {sortableHead('Priority', TicketsControllerFindAllSortBy.priority)}
            <TableHead>Assignee</TableHead>
            {sortableHead('Created', TicketsControllerFindAllSortBy.createdAt)}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((t) => (
            <TableRow key={t.id}>
              <TableCell>
                <div className="text-sm font-semibold leading-snug">
                  {t.title}
                </div>
                <div className="mt-0.5 max-w-xs truncate text-xs text-muted-foreground">
                  {t.description}
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm font-medium">{t.customerName}</div>
                <div className="text-xs text-muted-foreground">
                  {t.customerEmail}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={t.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={t.priority} />
              </TableCell>
              <TableCell className="text-sm">
                {t.assignedTo ? (
                  (userMap.get(t.assignedTo)?.name ?? '—')
                ) : (
                  <span className="text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                {format(new Date(t.createdAt), 'MMM d, yyyy h:mm a')}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(t)}>
                    <Pencil />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={`/tickets/${t.id}`} />}
                  >
                    Details
                    <ExternalLink />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
