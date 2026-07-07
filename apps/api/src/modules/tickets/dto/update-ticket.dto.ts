import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsUUID,
  IsEmail,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { TicketStatus, TicketPriority } from '../entities/ticket.enums';

export class UpdateTicketDto {
  @ApiPropertyOptional({
    maxLength: 200,
    description: 'New summary of the issue.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title?: string;

  @ApiPropertyOptional({
    description: 'New full details of the reported issue.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiPropertyOptional({
    maxLength: 120,
    description: 'Updated customer name.',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  customerName?: string;

  @ApiPropertyOptional({
    format: 'email',
    description: 'Updated customer contact email.',
  })
  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @ApiPropertyOptional({
    enum: TicketStatus,
    description: 'New workflow state for the ticket.',
  })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({
    enum: TicketPriority,
    description: 'New urgency for the ticket.',
  })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({
    type: String,
    format: 'uuid',
    nullable: true,
    description: 'User to assign the ticket to. Pass null to unassign.',
  })
  @IsOptional()
  @IsUUID(7)
  assignedTo?: string | null;
}
