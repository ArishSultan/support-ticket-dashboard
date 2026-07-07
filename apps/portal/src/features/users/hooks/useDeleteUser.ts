import { useMutation, useQueryClient } from '@tanstack/react-query';

import { auth } from '#/lib/auth';

/** Delete a user via the Better Auth admin plugin. */
export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const result = await auth.admin.removeUser({ userId });
      if (result.error) {
        throw new Error(result.error.message || 'Failed to delete user');
      }
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}
