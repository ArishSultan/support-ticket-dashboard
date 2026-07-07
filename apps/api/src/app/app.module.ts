import { Module, RequestMethod } from '@nestjs/common';

import { DatabaseModule } from './database/database.module';
import { AppConfigModule } from './config/config.module';

import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';
import { TicketsModule } from '../modules/tickets/tickets.module';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRoot({
      forRoutes: [{ path: '*path', method: RequestMethod.ALL }],
    }),
    AppConfigModule,
    AuthModule,
    DatabaseModule,
    UsersModule,
    TicketsModule,
  ],
})
export class AppModule {}
