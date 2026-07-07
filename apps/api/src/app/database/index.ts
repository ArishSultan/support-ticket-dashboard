import { Inject } from '@nestjs/common';
export type { Database } from '@org/database';

import { DB_PROVIDER } from './database.module';

export * from './database.result';

export const InjectDb = () => Inject(DB_PROVIDER);
