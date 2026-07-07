import { Injectable } from '@nestjs/common';
import { asc } from '@org/database';
import { usersTable } from '@org/database/schema';

import { InjectDb, type Database } from '../../app/database';
import { UserSummaryEntity } from './entities/user-summary.entity';

@Injectable()
export class UsersService {
  constructor(@InjectDb() private readonly db: Database) {}

  /** Lightweight user list used for ticket assignment (available to all agents). */
  async findAll(): Promise<UserSummaryEntity[]> {
    const rows = await this.db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
      })
      .from(usersTable)
      .orderBy(asc(usersTable.name));

    return rows.map((u) => ({ ...u, role: u.role ?? 'agent' }));
  }
}
