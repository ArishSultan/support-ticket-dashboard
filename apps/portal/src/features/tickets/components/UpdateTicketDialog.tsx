'use client';

import type { TicketEntity } from '@org/api-client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog';

import { UpdateTicketForm } from './UpdateTicketForm';

interface UpdateTicketDialogProps {
  ticket: TicketEntity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdateTicketDialog({
  ticket,
  open,
  onOpenChange,
}: UpdateTicketDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Ticket</DialogTitle>
          <DialogDescription>
            Update the details, status, or priority of this ticket.
          </DialogDescription>
        </DialogHeader>

        {/* Remount the form per ticket so defaults re-seed correctly */}
        {ticket && (
          <UpdateTicketForm
            key={ticket.id}
            ticket={ticket}
            onSuccess={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
