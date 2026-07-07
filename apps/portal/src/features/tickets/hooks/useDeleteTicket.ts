import { useQueryClient } from '@tanstack/react-query';
import { useTicketsControllerRemove } from '@org/api-client';

import { invalidateTickets } from '../lib/ticket-cache';

/** Delete a ticket and refresh the ticket lists on success. */
export function useDeleteTicket() {
  const queryClient = useQueryClient();

  return useTicketsControllerRemove({
    mutation: {
      onSuccess: () => invalidateTickets(queryClient),
    },
  });
}
