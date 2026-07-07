import { Get, Controller } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UserSummaryEntity } from './entities/user-summary.entity';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users (for ticket assignment)' })
  @ApiResponse({ status: 200, type: [UserSummaryEntity] })
  findAll(): Promise<UserSummaryEntity[]> {
    return this.usersService.findAll();
  }
}
