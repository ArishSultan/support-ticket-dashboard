'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Plus,
  Search,
  Loader2,
  RefreshCw,
  Table as TableIcon,
  Kanban as KanbanIcon,
} from 'lucide-react';

import {
  type TicketEntity,
  useTicketsControllerFindAll,
  TicketsControllerFindAllSortBy,
  TicketsControllerFindAllSortOrder,
  type TicketsControllerFindAllStatus,
  type TicketsControllerFindAllPriority,
} from '@org/api-client';

import { Button } from '#/components/ui/button';
import { Card, CardContent } from '#/components/ui/card';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '#/components/ui/input-group';

import {
  Select,
  SelectItem,
  SelectValue,
  SelectContent,
  SelectTrigger,
} from '#/components/ui/select';

import { KanbanBoard } from './kanban/KanbanBoard';
import { TicketsTable } from './TicketsTable';
import { CreateTicketDialog } from './CreateTicketDialog';
import { UpdateTicketDialog } from './UpdateTicketDialog';

import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '../lib/ticket-options';

type ViewMode = 'table' | 'board';

const STATUS_FILTER_ITEMS = [
  { value: '', label: 'All Statuses' },
  ...STATUS_OPTIONS,
];
const PRIORITY_FILTER_ITEMS = [
  { value: '', label: 'All Priorities' },
  ...PRIORITY_OPTIONS,
];

export function TicketsView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const view: ViewMode =
    searchParams.get('view') === 'board' ? 'board' : 'table';

  const setView = (next: ViewMode) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', next);
    router.replace(`/?${params.toString()}`);
  };

  // Filters + sort (no pagination; the board needs the full set at once).
  const [status, setStatus] = useState<TicketsControllerFindAllStatus | ''>('');
  const [priority, setPriority] = useState<
    TicketsControllerFindAllPriority | ''
  >('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<TicketsControllerFindAllSortBy>(
    TicketsControllerFindAllSortBy.createdAt,
  );
  const [sortOrder, setSortOrder] = useState<TicketsControllerFindAllSortOrder>(
    TicketsControllerFindAllSortOrder.desc,
  );

  // Dialog state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState<TicketEntity | null>(null);

  const {
    data: response,
    isLoading,
    isError,
    refetch,
  } = useTicketsControllerFindAll({
    status: status || undefined,
    priority: priority || undefined,
    search: search || undefined,
    sortBy,
    sortOrder,
    limit: 100,
  });

  const tickets = response?.data?.data ?? [];

  const handleSort = (field: TicketsControllerFindAllSortBy) => {
    if (sortBy === field) {
      setSortOrder((prev) =>
        prev === TicketsControllerFindAllSortOrder.asc
          ? TicketsControllerFindAllSortOrder.desc
          : TicketsControllerFindAllSortOrder.asc,
      );
    } else {
      setSortBy(field);
      setSortOrder(TicketsControllerFindAllSortOrder.desc);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title + New Ticket */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Support Tickets</h1>
          <p className="text-sm text-muted-foreground">
            Monitor, assign and resolve support queries from customers.
          </p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus />
          New Ticket
        </Button>
      </div>

      {/* Filters + view toggle */}
      <Card size="sm">
        <CardContent className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <InputGroup className="flex-1">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search by title or customer name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </InputGroup>

          {view === 'table' && (
            <Select
              items={STATUS_FILTER_ITEMS}
              value={status}
              onValueChange={(value) =>
                setStatus((value ?? '') as TicketsControllerFindAllStatus | '')
              }
            >
              <SelectTrigger className="lg:w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_FILTER_ITEMS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select
            items={PRIORITY_FILTER_ITEMS}
            value={priority}
            onValueChange={(value) =>
              setPriority(
                (value ?? '') as TicketsControllerFindAllPriority | '',
              )
            }
          >
            <SelectTrigger className="lg:w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_FILTER_ITEMS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Segmented Table | Board toggle */}
          <div className="flex items-center gap-1">
            <Button
              variant={view === 'table' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('table')}
            >
              <TableIcon />
              Table
            </Button>
            <Button
              variant={view === 'board' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setView('board')}
            >
              <KanbanIcon />
              Board
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-24">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">
              Loading tickets...
            </p>
          </CardContent>
        </Card>
      ) : isError ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <p className="text-sm font-semibold text-destructive">
              Failed to load support tickets
            </p>
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw />
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-1 py-24 text-center">
            <h3 className="text-lg font-bold tracking-tight">
              No tickets found
            </h3>
            <p className="max-w-sm text-sm text-muted-foreground">
              {search || status || priority
                ? 'Try adjusting your search criteria or resetting filters.'
                : 'Get started by creating your first support ticket.'}
            </p>
          </CardContent>
        </Card>
      ) : view === 'board' ? (
        <KanbanBoard tickets={tickets} onEditAction={setEditingTicket} />
      ) : (
        <TicketsTable
          tickets={tickets}
          onEdit={setEditingTicket}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      )}

      <CreateTicketDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <UpdateTicketDialog
        ticket={editingTicket}
        open={editingTicket !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTicket(null);
        }}
      />
    </div>
  );
}
