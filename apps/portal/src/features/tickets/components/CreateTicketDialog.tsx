'use client';

import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from '#/components/ui/dialog';

import { CreateTicketForm } from './CreateTicketForm';

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTicketDialog({
  open,
  onOpenChange,
}: CreateTicketDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Support Ticket</DialogTitle>
          <DialogDescription>
            Log a new customer support request.
          </DialogDescription>
        </DialogHeader>

        <CreateTicketForm onSuccessAction={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
