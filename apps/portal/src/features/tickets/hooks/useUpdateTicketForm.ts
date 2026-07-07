import { z } from 'zod';
import { toast } from 'sonner';
import { useSelector } from '@tanstack/react-store';
import { revalidateLogic, useForm } from '@tanstack/react-form-nextjs';
import {
  UpdateTicketDtoPriority,
  UpdateTicketDtoStatus,
  type TicketEntity,
} from '@org/api-client';

import { useUpdateTicket } from './useUpdateTicket';

export const updateTicketValidationSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name cannot exceed 120 characters'),
  customerEmail: z.email('Please enter a valid email address'),
  priority: z.enum(UpdateTicketDtoPriority),
  status: z.enum(UpdateTicketDtoStatus),
  description: z.string().min(1, 'Description is required'),
  assignedTo: z.string(),
});

export type UpdateTicketFormValues = z.infer<typeof updateTicketValidationSchema>;

export function useUpdateTicketForm({
  ticket,
  onSuccess,
}: {
  ticket: TicketEntity;
  onSuccess?: () => void;
}) {
  const update = useUpdateTicket();

  const form = useForm({
    defaultValues: {
      title: ticket.title,
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      priority: ticket.priority,
      status: ticket.status,
      description: ticket.description,
      assignedTo: ticket.assignedTo ?? '',
    } as UpdateTicketFormValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: updateTicketValidationSchema },
    onSubmit: async ({ value }) => {
      update.reset();
      await update.mutateAsync({
        id: ticket.id,
        data: { ...value, assignedTo: value.assignedTo || null },
      });

      toast.success('Ticket updated successfully');
      onSuccess?.();
    },
    listeners: {
      onChange: () => {
        if (update.error) {
          update.reset();
        }
      },
    },
  });

  const isSubmitting = useSelector(
    form.store,
    ({ isSubmitting }) => isSubmitting,
  );

  return {
    form,
    isSubmitting,
    error: update.error as Error | null,
    resetError: update.reset,
  };
}
