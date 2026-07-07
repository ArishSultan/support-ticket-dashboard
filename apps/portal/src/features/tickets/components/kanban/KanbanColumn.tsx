'use client';

import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TicketEntity, TicketEntityStatus } from '@org/api-client';

import { cn } from '#/lib/utils';

import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: TicketEntityStatus;
  title: string;
  accent: string;
  tickets: TicketEntity[];
  onEditAction: (ticket: TicketEntity) => void;
}

export function KanbanColumn({
  id,
  title,
  accent,
  tickets,
  onEditAction,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full min-h-125 flex-col rounded-xl border border-t-4 p-4 transition-colors',
        accent,
        isOver && 'ring-2 ring-primary/30',
      )}
    >
      <div className="mb-4 flex items-center justify-between border-b pb-2">
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
          {tickets.length}
        </span>
      </div>

      <SortableContext
        items={tickets.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3">
          {tickets.map((ticket) => (
            <KanbanCard
              key={ticket.id}
              ticket={ticket}
              onEditAction={onEditAction}
            />
          ))}
          {tickets.length === 0 && (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed text-xs text-muted-foreground">
              Drop cards here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
