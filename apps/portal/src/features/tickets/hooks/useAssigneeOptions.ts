import { auth } from '#/lib/auth';
import { useUsers } from '#/features/users/hooks/useUsers';

/** Options for the ticket "Assignee" dropdown: Unassigned + every user (self marked). */
export function useAssigneeOptions(): Array<{ value: string; label: string }> {
  const { data: users } = useUsers();
  const { data: session } = auth.useSession();
  const meId = session?.user?.id;

  return [
    { value: '', label: 'Unassigned' },
    ...(users ?? []).map((u) => ({
      value: u.id,
      label: u.id === meId ? `${u.name} (You)` : u.name,
    })),
  ];
}
