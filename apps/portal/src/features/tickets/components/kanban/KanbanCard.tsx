'use client';

import Link from 'next/link';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import type { PointerEvent } from 'react';
import type { TicketEntity } from '@org/api-client';
import { Calendar, User, Pencil, ExternalLink } from 'lucide-react';

import { cn } from '#/lib/utils';
import { Button } from '#/components/ui/button';
import { useUserMap } from '#/features/users/hooks/useUsers';
import { Card, CardContent } from '#/components/ui/card';
import { StatusBadge, PriorityBadge } from '#/components/ui/badges';

const stopDrag = (e: PointerEvent) => e.stopPropagation();

export function KanbanCardView({
  ticket,
  onEditAction,
  overlay,
}: {
  ticket: TicketEntity;
  onEditAction: (ticket: TicketEntity) => void;
  overlay?: boolean;
}) {
  const userMap = useUserMap();
  const assignee = ticket.assignedTo
    ? userMap.get(ticket.assignedTo)?.name
    : null;

  return (
    <Card
      size="sm"
      className={cn(
        'cursor-grab select-none active:cursor-grabbing',
        overlay && 'shadow-lg',
      )}
    >
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={ticket.priority} />
          </div>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              title="Edit ticket"
              onPointerDown={stopDrag}
              onClick={() => onEditAction(ticket)}
            >
              <Pencil />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              title="Open details"
              onPointerDown={stopDrag}
              nativeButton={false}
              render={<Link href={`/tickets/${ticket.id}`} />}
            >
              <ExternalLink />
            </Button>
          </div>
        </div>

        <h4 className="line-clamp-2 text-sm font-semibold leading-snug">
          {ticket.title}
        </h4>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {ticket.description}
        </p>

        <div className="flex items-center justify-between border-t pt-2.5 text-[10px] font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            <User className="size-3" />
            {ticket.customerName}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(ticket.createdAt).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>

        <div className="text-[10px] font-medium text-muted-foreground">
          {assignee ? (
            <span>
              Assigned to <span className="text-foreground">{assignee}</span>
            </span>
          ) : (
            <span>Unassigned</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/** Sortable wrapper used inside the board columns. */
export function KanbanCard({
  ticket,
  onEditAction,
}: {
  ticket: TicketEntity;
  onEditAction: (ticket: TicketEntity) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: ticket.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform), transition }}
      className={cn('touch-none', isDragging && 'opacity-40')}
      {...attributes}
      {...listeners}
    >
      <KanbanCardView ticket={ticket} onEditAction={onEditAction} />
    </div>
  );
}
