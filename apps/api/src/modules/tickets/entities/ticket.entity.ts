import { ApiProperty } from '@nestjs/swagger';
import { TicketStatus, TicketPriority } from './ticket.enums';

export class TicketEntity {
  @ApiProperty({
    format: 'uuid',
    description: 'Unique identifier of the ticket.',
  })
  id!: string;

  @ApiProperty({ description: 'Short summary of the issue.' })
  title!: string;

  @ApiProperty({ description: 'Full details of the reported issue.' })
  description!: string;

  @ApiProperty({ description: 'Name of the customer who reported the ticket.' })
  customerName!: string;

  @ApiProperty({
    format: 'email',
    description: 'Contact email of the reporting customer.',
  })
  customerEmail!: string;

  @ApiProperty({
    enum: TicketStatus,
    description: 'Current workflow state of the ticket.',
  })
  status!: TicketStatus;

  @ApiProperty({
    enum: TicketPriority,
    description: 'Urgency assigned to the ticket.',
  })
  priority!: TicketPriority;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description:
      'ID of the user who created the ticket, or null for system/anonymous sources.',
  })
  createdBy!: string | null;

  @ApiProperty({
    type: String,
    format: 'uuid',
    nullable: true,
    description:
      'ID of the user the ticket is assigned to, or null if unassigned.',
  })
  assignedTo!: string | null;

  @ApiProperty({
    format: 'date-time',
    description: 'Creation timestamp (ISO 8601).',
  })
  createdAt!: Date;

  @ApiProperty({
    format: 'date-time',
    description: 'Last-update timestamp (ISO 8601).',
  })
  updatedAt!: Date;
}
