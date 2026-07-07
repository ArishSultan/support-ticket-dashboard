'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { use, useState } from 'react';
import {
  TicketEntityStatus,
  useTicketsControllerFindOne,
} from '@org/api-client';

import { auth } from '#/lib/auth';
import { Button } from '#/components/ui/button';
import { useUserMap } from '#/features/users/hooks/useUsers';
import { STATUS_OPTIONS } from '#/features/tickets/lib/ticket-options';
import { useUpdateTicket } from '#/features/tickets/hooks/useUpdateTicket';
import { useDeleteTicket } from '#/features/tickets/hooks/useDeleteTicket';
import { UpdateTicketDialog } from '#/features/tickets/components/UpdateTicketDialog';
import { LoadingAlertDialogAction } from '#/components/form/LoadingButton';
import { StatusBadge, PriorityBadge } from '#/components/ui/badges';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from '#/components/ui/select';
import {
  AlertDialog,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
} from '#/components/ui/alert-dialog';
import {
  User,
  Mail,
  Clock,
  Trash2,
  Pencil,
  Loader2,
  Calendar,
  ArrowLeft,
  ShieldAlert,
  AlertCircle,
} from 'lucide-react';

interface TicketDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default function TicketDetailsPage({ params }: TicketDetailsPageProps) {
  const router = useRouter();
  const userMap = useUserMap();
  const { id } = use(params);

  const { data: session } = auth.useSession();
  const isAdmin = session?.user?.role === 'admin';

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const {
    isError,
    isLoading,
    data: ticketRes,
  } = useTicketsControllerFindOne(id);

  const { mutateAsync: updateTicket } = useUpdateTicket();
  const { mutateAsync: removeTicket } = useDeleteTicket();

  const ticket = ticketRes?.data;
  const assigneeName = ticket?.assignedTo
    ? userMap.get(ticket.assignedTo)?.name
    : null;

  const handleStatusChange = async (newStatus: TicketEntityStatus) => {
    try {
      await updateTicket({ id, data: { status: newStatus } });
      toast.success('Ticket status updated successfully');
    } catch {
      toast.error('Failed to update ticket status');
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await removeTicket({ id });
      toast.success('Ticket deleted successfully');
      router.push('/');
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to delete ticket');
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-40">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading ticket details...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isError || !ticket) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-40 text-center">
          <AlertCircle className="size-10 text-destructive" />
          <h3 className="text-lg font-bold">Ticket not found</h3>
          <p className="max-w-sm text-sm text-muted-foreground">
            This ticket may have been deleted or the link is broken.
          </p>
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/" />}
          >
            <ArrowLeft />
            Back to Tickets
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation + actions */}
      <div className="flex items-center justify-between">
        <Button variant="link" nativeButton={false} render={<Link href="/" />}>
          <ArrowLeft />
          Back to Tickets
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsEditOpen(true)}>
            <Pencil />
            Edit Ticket
          </Button>
          {isAdmin && (
            <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
              <Trash2 />
              Delete Ticket
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column — main details */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={ticket.status} />
                <PriorityBadge priority={ticket.priority} />
              </div>
              <CardTitle className="text-2xl">{ticket.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Description
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {ticket.description}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <User className="size-5 text-muted-foreground" />
                <div>
                  <div className="text-xs text-muted-foreground">Name</div>
                  <div className="text-sm font-semibold">
                    {ticket.customerName}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-muted-foreground" />
                <div className="overflow-hidden">
                  <div className="text-xs text-muted-foreground">Email</div>
                  <a
                    href={`mailto:${ticket.customerEmail}`}
                    className="block truncate text-sm font-semibold text-primary hover:underline"
                  >
                    {ticket.customerEmail}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column — actions & dates */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Update Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                items={STATUS_OPTIONS}
                value={ticket.status}
                onValueChange={(value) => {
                  if (value) handleStatusChange(value as TicketEntityStatus);
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Assignee
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {assigneeName ? (
                <span className="font-semibold">{assigneeName}</span>
              ) : (
                <span className="text-muted-foreground">Unassigned</span>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Timeline Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Created At
                  </div>
                  <div className="text-xs font-semibold">
                    {format(new Date(ticket.createdAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 border-t pt-3">
                <Clock className="size-4 text-muted-foreground" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Last Updated
                  </div>
                  <div className="text-xs font-semibold">
                    {format(new Date(ticket.updatedAt), 'MMM d, yyyy h:mm a')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit ticket dialog */}
      <UpdateTicketDialog
        ticket={ticket}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
      />

      {/* Delete confirmation (admin only) */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <ShieldAlert />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this ticket?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{ticket.title}&rdquo; will be permanently removed. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <LoadingAlertDialogAction
              variant="destructive"
              isLoading={isDeleting}
              loadingChildren="Deleting"
              onClick={handleDelete}
            >
              Delete
            </LoadingAlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
