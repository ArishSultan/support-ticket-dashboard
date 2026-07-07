import { useQueryClient } from '@tanstack/react-query';
import { useTicketsControllerCreate } from '@org/api-client';

import { invalidateTickets } from '../lib/ticket-cache';

/** Create a ticket and refresh the ticket lists on success. */
export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useTicketsControllerCreate({
    mutation: {
      onSuccess: () => invalidateTickets(queryClient),
    },
  });
}
