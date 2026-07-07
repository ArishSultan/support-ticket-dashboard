import { Module } from '@nestjs/common';

import { TicketsService } from './tickets.service';
import { TicketsGateway } from './tickets.gateway';
import { TicketsController } from './tickets.controller';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, TicketsGateway],
})
export class TicketsModule {}
