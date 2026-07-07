import { useQueryClient } from '@tanstack/react-query';
import { useTicketsControllerUpdate } from '@org/api-client';

import { invalidateTickets } from '../lib/ticket-cache';

/** Update a ticket and refresh the ticket lists + detail on success. */
export function useUpdateTicket() {
  const queryClient = useQueryClient();

  return useTicketsControllerUpdate({
    mutation: {
      onSuccess: () => invalidateTickets(queryClient),
    },
  });
}
