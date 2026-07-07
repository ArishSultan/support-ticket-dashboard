import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsUUID,
  IsEmail,
  IsString,
  MaxLength,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

import { TicketPriority } from '../entities/ticket.enums';

export class CreateTicketDto {
  @ApiProperty({ maxLength: 200, description: 'Short summary of the issue.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  @ApiProperty({ description: 'Full details of the reported issue.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({
    maxLength: 120,
    description: 'Name of the customer who reported the ticket.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  customerName!: string;

  @ApiProperty({
    format: 'email',
    description: 'Contact email of the reporting customer.',
  })
  @IsEmail()
  customerEmail!: string;

  @ApiProperty({
    enum: TicketPriority,
    description: 'Urgency to assign to the new ticket.',
  })
  @IsEnum(TicketPriority)
  priority!: TicketPriority;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'User to assign the ticket to. Omit to leave unassigned.',
  })
  @IsOptional()
  @IsUUID(7)
  assignedTo?: string;
}
