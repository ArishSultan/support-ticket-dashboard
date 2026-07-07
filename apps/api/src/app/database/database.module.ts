import { Global, Module } from '@nestjs/common';

import { drizzle, Pool } from '@org/database';
import { relations } from '@org/database/relations';

import { databaseConfig, type DatabaseConfigType } from './database.config';

export const DB_PROVIDER = 'DRIZZLE';

@Global()
@Module({
  exports: [DB_PROVIDER],
  providers: [
    {
      provide: DB_PROVIDER,
      inject: [databaseConfig.KEY],
      useFactory: (config: DatabaseConfigType) => {
        return drizzle({
          client: new Pool({ connectionString: config.url }),
          relations,
        });
      },
    },
  ],
})
export class DatabaseModule {}
