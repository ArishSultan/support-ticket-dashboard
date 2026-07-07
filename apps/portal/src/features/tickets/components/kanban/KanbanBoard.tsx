'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  useSensor,
  useSensors,
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  closestCorners,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { toast } from 'sonner';
import type { TicketEntity, TicketEntityStatus } from '@org/api-client';

import { KanbanColumn } from './KanbanColumn';
import { KanbanCardView } from './KanbanCard';

import { STATUS_COLUMNS } from '../../lib/ticket-options';
import { useUpdateTicket } from '../../hooks/useUpdateTicket';

type Columns = Record<TicketEntityStatus, string[]>;

const STATUSES = STATUS_COLUMNS.map((c) => c.id);

function groupByStatus(tickets: TicketEntity[]): Columns {
  const columns: Columns = STATUSES.reduce(
    (acc, status) => ({ ...acc, [status]: [] }),
    {} as Columns,
  );
  for (const ticket of tickets) {
    (columns[ticket.status] ??= []).push(ticket.id);
  }
  return columns;
}

export function KanbanBoard({
  tickets,
  onEditAction,
}: {
  tickets: TicketEntity[];
  onEditAction: (ticket: TicketEntity) => void;
}) {
  const update = useUpdateTicket();

  const byId = useMemo(() => new Map(tickets.map((t) => [t.id, t])), [tickets]);

  const [columns, setColumns] = useState<Columns>(() => groupByStatus(tickets));
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  // Keep local columns in sync with server data, but never clobber an in-progress drag.
  const draggingRef = useRef(false);
  useEffect(() => {
    if (!draggingRef.current) setColumns(groupByStatus(tickets));
  }, [tickets]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findColumn = (id: UniqueIdentifier): TicketEntityStatus | undefined => {
    if (id in columns) return id as TicketEntityStatus;
    return STATUSES.find((s) => columns[s].includes(id as string));
  };

  const handleDragStart = (event: DragStartEvent) => {
    draggingRef.current = true;
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeCol = findColumn(active.id);
    const overCol = findColumn(over.id);
    if (!activeCol || !overCol || activeCol === overCol) return;

    setColumns((prev) => {
      const activeItems = prev[activeCol];
      const overItems = prev[overCol];
      const overIndex =
        over.id in prev
          ? overItems.length
          : overItems.indexOf(over.id as string);

      return {
        ...prev,
        [activeCol]: activeItems.filter((id) => id !== active.id),
        [overCol]: [
          ...overItems.slice(0, overIndex < 0 ? overItems.length : overIndex),
          active.id as string,
          ...overItems.slice(overIndex < 0 ? overItems.length : overIndex),
        ],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    draggingRef.current = false;
    setActiveId(null);
    if (!over) return;

    const overCol = findColumn(over.id);
    const original = byId.get(active.id as string)?.status;
    if (!overCol || !original) return;

    if (overCol !== original) {
      // Cross-column move → persist the new status (revert on failure).
      update
        .mutateAsync({ id: active.id as string, data: { status: overCol } })
        .then(() => toast.success('Ticket status updated'))
        .catch(() => {
          setColumns(groupByStatus(tickets));
          toast.error('Failed to move ticket');
        });
      return;
    }

    // Same-column reorder is visual only (no persisted order field).
    const items = columns[overCol];
    const oldIndex = items.indexOf(active.id as string);
    const newIndex = items.indexOf(over.id as string);
    if (oldIndex !== newIndex && newIndex >= 0) {
      setColumns((prev) => ({
        ...prev,
        [overCol]: arrayMove(prev[overCol], oldIndex, newIndex),
      }));
    }
  };

  const activeTicket = activeId ? byId.get(activeId as string) : undefined;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {STATUS_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.id}
            id={col.id}
            title={col.title}
            accent={col.accent}
            onEditAction={onEditAction}
            tickets={(columns[col.id] ?? [])
              .map((id) => byId.get(id))
              .filter((t): t is TicketEntity => Boolean(t))}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTicket ? (
          <KanbanCardView
            ticket={activeTicket}
            onEditAction={onEditAction}
            overlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
