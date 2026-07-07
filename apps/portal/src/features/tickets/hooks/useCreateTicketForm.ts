import { z } from 'zod';
import { toast } from 'sonner';
import { useSelector } from '@tanstack/react-store';
import { revalidateLogic, useForm } from '@tanstack/react-form-nextjs';
import { CreateTicketDtoPriority } from '@org/api-client';

import { useCreateTicket } from './useCreateTicket';

export const createTicketValidationSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title cannot exceed 200 characters'),
  customerName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(120, 'Name cannot exceed 120 characters'),
  customerEmail: z.email('Please enter a valid email address'),
  priority: z.enum(CreateTicketDtoPriority),
  description: z.string().min(1, 'Description is required'),
  assignedTo: z.string(),
});

export type CreateTicketFormValues = z.infer<typeof createTicketValidationSchema>;

export const createTicketFormDefaultValues: CreateTicketFormValues = {
  title: '',
  customerName: '',
  customerEmail: '',
  priority: CreateTicketDtoPriority.medium,
  description: '',
  assignedTo: '',
};

export function useCreateTicketForm({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const create = useCreateTicket();

  const form = useForm({
    defaultValues: createTicketFormDefaultValues,
    validationLogic: revalidateLogic(),
    validators: { onDynamic: createTicketValidationSchema },
    onSubmit: async ({ value, formApi }) => {
      create.reset();
      await create.mutateAsync({
        data: { ...value, assignedTo: value.assignedTo || undefined },
      });

      toast.success('Ticket created successfully');
      formApi.reset();
      onSuccess?.();
    },
    listeners: {
      onChange: () => {
        if (create.error) {
          create.reset();
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
    error: create.error as Error | null,
    resetError: create.reset,
  };
}
