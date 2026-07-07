'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Trash2, ShieldAlert, Loader2, RefreshCw } from 'lucide-react';

import { Card } from '#/components/ui/card';
import { Button } from '#/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogCancel,
} from '#/components/ui/alert-dialog';
import { LoadingAlertDialogAction } from '#/components/form/LoadingButton';

import {
  useUsers,
  type UserSummary,
} from '#/features/users/hooks/useUsers';
import { useSetUserRole } from '#/features/users/hooks/useSetUserRole';
import { useDeleteUser } from '#/features/users/hooks/useDeleteUser';
import { ROLE_OPTIONS } from '#/features/users/lib/role-options';

export function UsersTable({ currentUserId }: { currentUserId?: string }) {
  const { data: users, isLoading, isError, refetch } = useUsers();
  const setRole = useSetUserRole();
  const deleteUser = useDeleteUser();

  const [pendingDelete, setPendingDelete] = useState<UserSummary | null>(null);

  const handleRoleChange = async (userId: string, role: string) => {
    try {
      await setRole.mutateAsync({ userId, role });
      toast.success('Role updated');
    } catch (e) {
      toast.error((e as Error).message || 'Failed to update role');
    }
  };

  const handleDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteUser.mutateAsync(pendingDelete.id);
      toast.success('User deleted');
      setPendingDelete(null);
    } catch (e) {
      toast.error((e as Error).message || 'Failed to delete user');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading users...
          </p>
        </div>
      </Card>
    );
  }

  if (isError) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
          <p className="text-sm font-semibold text-destructive">
            Failed to load users
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw />
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-40">Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(users ?? []).map((u) => {
              const isSelf = u.id === currentUserId;
              return (
                <TableRow key={u.id}>
                  <TableCell className="text-sm font-semibold">
                    {u.name}
                    {isSelf && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        (You)
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {u.email}
                  </TableCell>
                  <TableCell>
                    <Select
                      items={ROLE_OPTIONS}
                      value={u.role}
                      disabled={isSelf}
                      onValueChange={(role) => {
                        if (role) handleRoleChange(u.id, role);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLE_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isSelf}
                      onClick={() => setPendingDelete(u)}
                    >
                      <Trash2 />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog
        open={pendingDelete !== null}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null);
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <ShieldAlert />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.name} ({pendingDelete?.email}) will be permanently
              removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteUser.isPending}>
              Cancel
            </AlertDialogCancel>
            <LoadingAlertDialogAction
              variant="destructive"
              isLoading={deleteUser.isPending}
              loadingChildren="Deleting"
              onClick={handleDelete}
            >
              Delete
            </LoadingAlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
