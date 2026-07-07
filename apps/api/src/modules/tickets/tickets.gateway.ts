import {
  WebSocketServer,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { AuthService } from '@thallesp/nestjs-better-auth';
import { Server, Socket } from 'socket.io';

import { TicketEntity } from './entities/ticket.entity';

@WebSocketGateway({
  cors: {
    // Match the HTTP CORS policy — only the portal origin may connect.
    origin: process.env.APP_URL ?? 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
})
export class TicketsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TicketsGateway.name);

  constructor(private readonly authService: AuthService) {}

  async handleConnection(client: Socket) {
    try {
      const headers = new Headers();
      const rawHeaders = client.handshake.headers;
      for (const [key, value] of Object.entries(rawHeaders)) {
        if (value) {
          headers.set(
            key,
            Array.isArray(value) ? value.join(', ') : String(value),
          );
        }
      }

      // Support bearer token from query for tooling
      const token =
        client.handshake.auth?.token || client.handshake.query?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }

      const session = await this.authService.api.getSession({ headers });
      if (!session?.user) {
        this.logger.warn(`WS: unauthenticated connection from ${client.id}`);
        client.disconnect();
        return;
      }

      client.join('tickets');
      this.logger.log(`WS: ${session.user.email} joined tickets room`);
    } catch (err) {
      this.logger.warn(`WS: auth error for ${client.id}: ${err}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`WS: client ${client.id} disconnected`);
  }

  emitTicketCreated(ticket: TicketEntity) {
    this.server.to('tickets').emit('ticket.created', ticket);
  }

  emitTicketUpdated(ticket: TicketEntity) {
    this.server.to('tickets').emit('ticket.updated', ticket);
  }

  emitTicketDeleted(id: string) {
    this.server.to('tickets').emit('ticket.deleted', { id });
  }
}
