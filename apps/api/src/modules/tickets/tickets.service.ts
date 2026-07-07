import { Injectable } from '@nestjs/common';
import { ticketsTable } from '@org/database/schema';
import { eq, or, and, asc, SQL, desc, count, ilike } from '@org/database';

import { SortOrder } from './entities/ticket.enums';
import { TicketEntity } from './entities/ticket.entity';
import { TicketsGateway } from './tickets.gateway';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ListTicketsQuery } from './dto/list-tickets.query';
import { PaginatedTicketsEntity } from './entities/paginated-tickets.entity';

import {
  mapMany,
  InjectDb,
  mapOneOrThrow,
  type Database,
} from '../../app/database';
import { fromDb } from '../../app/database/database.transformer';

@Injectable()
export class TicketsService {
  constructor(
    @InjectDb() private readonly db: Database,
    private readonly gateway: TicketsGateway,
  ) {}

  async findAll(query: ListTicketsQuery): Promise<PaginatedTicketsEntity> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions: SQL[] = [];
    if (query.status) conditions.push(eq(ticketsTable.status, query.status));
    if (query.priority)
      conditions.push(eq(ticketsTable.priority, query.priority));
    if (query.search) {
      conditions.push(
        or(
          ilike(ticketsTable.title, `%${query.search}%`),
          ilike(ticketsTable.customerName, `%${query.search}%`),
        ) as SQL,
      );
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const sortColumn =
      query.sortBy === 'priority'
        ? ticketsTable.priority
        : query.sortBy === 'status'
          ? ticketsTable.status
          : ticketsTable.createdAt;

    const orderFn = query.sortOrder === SortOrder.ASC ? asc : desc;

    const [rows, [{ value: total }]] = await Promise.all([
      this.db
        .select()
        .from(ticketsTable)
        .where(where)
        .orderBy(orderFn(sortColumn))
        .limit(limit)
        .offset(offset),

      this.db.select({ value: count() }).from(ticketsTable).where(where),
    ]);

    const totalCount = Number(total);
    return {
      data: mapMany(fromDb.ticket, rows),
      meta: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  async findById(id: string): Promise<TicketEntity> {
    const [ticket] = await this.db
      .select()
      .from(ticketsTable)
      .where(eq(ticketsTable.id, id))
      .limit(1);

    return mapOneOrThrow(fromDb.ticket, ticket);
  }

  async create(dto: CreateTicketDto, userId: string): Promise<TicketEntity> {
    const [ticket] = await this.db
      .insert(ticketsTable)
      .values({
        title: dto.title,
        description: dto.description,
        customerName: dto.customerName,
        customerEmail: dto.customerEmail,
        priority: dto.priority,
        assignedTo: dto.assignedTo ?? null,
        status: 'open',
        createdBy: userId,
      })
      .returning();

    const entity = mapOneOrThrow(fromDb.ticket, ticket);

    this.gateway.emitTicketCreated(entity);

    return entity;
  }

  async update(id: string, dto: UpdateTicketDto): Promise<TicketEntity> {
    const updateValues: Record<string, unknown> = {};
    if (dto.title !== undefined) updateValues['title'] = dto.title;
    if (dto.description !== undefined)
      updateValues['description'] = dto.description;
    if (dto.customerName !== undefined)
      updateValues['customerName'] = dto.customerName;
    if (dto.customerEmail !== undefined)
      updateValues['customerEmail'] = dto.customerEmail;
    if (dto.status !== undefined) updateValues['status'] = dto.status;
    if (dto.priority !== undefined) updateValues['priority'] = dto.priority;
    if ('assignedTo' in dto) updateValues.assignedTo = dto.assignedTo ?? null;

    const [ticket] = await this.db
      .update(ticketsTable)
      .set(updateValues as any)
      .where(eq(ticketsTable.id, id))
      .returning();

    const entity = mapOneOrThrow(fromDb.ticket, ticket);

    this.gateway.emitTicketUpdated(entity);

    return entity;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.db.delete(ticketsTable).where(eq(ticketsTable.id, id));

    this.gateway.emitTicketDeleted(id);
  }
}
