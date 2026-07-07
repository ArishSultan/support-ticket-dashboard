import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  role: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

async function fetchUsers(): Promise<UserSummary[]> {
  const res = await fetch(`${API_URL}/api/users`, {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

/** All users — feeds the assignment dropdown and the admin Users page. */
export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 60_000,
  });
}

/** id → user lookup for resolving assignee names. */
export function useUserMap() {
  const { data } = useUsers();
  return useMemo(
    () => new Map((data ?? []).map((u) => [u.id, u])),
    [data],
  );
}
