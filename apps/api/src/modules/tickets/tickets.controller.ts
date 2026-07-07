import { Roles, Session, type UserSession } from '@thallesp/nestjs-better-auth';

import {
  Get,
  Body,
  Post,
  Param,
  Query,
  Patch,
  Delete,
  HttpCode,
  Controller,
  HttpStatus,
} from '@nestjs/common';

import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { TicketEntity } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ListTicketsQuery } from './dto/list-tickets.query';
import { PaginatedTicketsEntity } from './entities/paginated-tickets.entity';

@ApiTags('tickets')
@ApiBearerAuth()
@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  @ApiOperation({ summary: 'List tickets with filter/search/pagination' })
  @ApiResponse({ status: 200, type: PaginatedTicketsEntity })
  findAll(@Query() query: ListTicketsQuery): Promise<PaginatedTicketsEntity> {
    return this.ticketsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single ticket by ID' })
  @ApiResponse({ status: 200, type: TicketEntity })
  @ApiResponse({ status: 404, description: 'Ticket not found' })
  findOne(@Param('id') id: string): Promise<TicketEntity> {
    return this.ticketsService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a ticket (status forced to open)' })
  @ApiResponse({ status: 201, type: TicketEntity })
  create(
    @Body() dto: CreateTicketDto,
    @Session() { user }: UserSession,
  ): Promise<TicketEntity> {
    return this.ticketsService.create(dto, user?.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ticket' })
  @ApiResponse({ status: 200, type: TicketEntity })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
  ): Promise<TicketEntity> {
    return this.ticketsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(['admin'])
  @ApiOperation({ summary: 'Delete a ticket (admin only)' })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.ticketsService.remove(id);
  }
}
