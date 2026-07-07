import { ApiProperty } from '@nestjs/swagger';
import { TicketEntity } from './ticket.entity';

export class PaginationMeta {
  @ApiProperty({ description: 'Current page number (1-based).' })
  page!: number;

  @ApiProperty({ description: 'Number of items requested per page.' })
  limit!: number;

  @ApiProperty({ description: 'Total number of items across all pages.' })
  total!: number;

  @ApiProperty({ description: 'Total number of pages for the current limit.' })
  totalPages!: number;
}

export class PaginatedTicketsEntity {
  @ApiProperty({
    type: [TicketEntity],
    description: 'Tickets for the current page.',
  })
  data!: TicketEntity[];

  @ApiProperty({
    type: PaginationMeta,
    description: 'Pagination metadata for the result set.',
  })
  meta!: PaginationMeta;
}
