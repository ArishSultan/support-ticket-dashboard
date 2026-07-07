import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryEntity {
  @ApiProperty({ format: 'uuid', description: 'Unique identifier of the user.' })
  id!: string;

  @ApiProperty({ description: 'Display name of the user.' })
  name!: string;

  @ApiProperty({ format: 'email', description: 'Email address of the user.' })
  email!: string;

  @ApiProperty({
    description: 'Access role of the user.',
    example: 'agent',
  })
  role!: string;
}
