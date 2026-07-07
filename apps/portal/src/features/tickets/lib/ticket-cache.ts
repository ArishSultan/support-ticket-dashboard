import type { QueryClient } from '@tanstack/react-query';

/**
 * Orval generates URL-based query keys, e.g. `['/api/tickets', params]` and
 * `['/api/tickets/${id}']`. Invalidating by this prefix refreshes every ticket
 * list + detail query in one call.
 */
export const TICKETS_KEY_PREFIX = '/api/tickets';

export function invalidateTickets(queryClient: QueryClient) {
  return queryClient.invalidateQueries({
    predicate: (query) =>
      Array.isArray(query.queryKey) &&
      typeof query.queryKey[0] === 'string' &&
      query.queryKey[0].startsWith(TICKETS_KEY_PREFIX),
  });
}
