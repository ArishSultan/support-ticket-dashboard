import { useMutation, useQueryClient } from '@tanstack/react-query';

import { auth } from '#/lib/auth';

/** Change a user's role (agent/admin) via the Better Auth admin plugin. */
export function useSetUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      // The admin client types roles as the plugin default ("user" | "admin"),
      // but our app uses "agent" | "admin" and the server accepts any string.
      const result = await auth.admin.setRole({
        userId,
        role: role as 'admin',
      });
      if (result.error) {
        throw new Error(result.error.message || 'Failed to update role');
      }
      return result.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });
}
