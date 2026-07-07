'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { auth } from '#/lib/auth';
import { Card } from '#/components/ui/card';
import { UsersTable } from '#/features/users/components/UsersTable';

export default function UsersPage() {
  const router = useRouter();
  const { data: session, isPending } = auth.useSession();
  const isAdmin = session?.user?.role === 'admin';

  // Admin-only route: bounce everyone else back to the dashboard.
  useEffect(() => {
    if (!isPending && !isAdmin) router.replace('/');
  }, [isPending, isAdmin, router]);

  if (isPending) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading...
          </p>
        </div>
      </Card>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage team members — change roles or remove accounts.
        </p>
      </div>

      <UsersTable currentUserId={session?.user?.id} />
    </div>
  );
}
