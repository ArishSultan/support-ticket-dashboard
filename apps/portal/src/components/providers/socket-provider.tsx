'use client';
import { useEffect, useRef } from 'react';
import { QueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';

import { invalidateTickets as invalidateTicketsCache } from '#/features/tickets/lib/ticket-cache';

interface SocketProviderProps {
  children: React.ReactNode;
  queryClient: QueryClient;
}

export function SocketProvider({ children, queryClient }: SocketProviderProps) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

    socketRef.current = io(wsUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    // Orval keys tickets queries by URL (`/api/tickets...`), so invalidate by that
    // prefix — plain `['tickets']` never matched and realtime refresh did nothing.
    const invalidateTickets = () => invalidateTicketsCache(queryClient);

    socket.on('ticket.created', invalidateTickets);
    socket.on('ticket.updated', invalidateTickets);
    socket.on('ticket.deleted', invalidateTickets);

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  return <>{children}</>;
}
