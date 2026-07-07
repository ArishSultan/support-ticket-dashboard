import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { configSchema } from './config.schema';

import { appConfig } from '../app.config';
import { authConfig } from '../../modules/auth/auth.config';
import { databaseConfig } from '../database/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [appConfig, authConfig, databaseConfig],
      envFilePath: [
        `apps/api/.env.${process.env.NODE_ENV || 'development'}.local`,
        'apps/api/.env.ts.local',
        `apps/api/.env.${process.env.NODE_ENV || 'development'}`,
        'apps/api/.env.ts',
        'apps/api/.env',
      ],
      validationSchema: configSchema,
      validationOptions: {
        abortEarly: false,
        allowUnknown: true,
      },
    }),
  ],
})
export class AppConfigModule {}
