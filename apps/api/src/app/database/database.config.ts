import { type ConfigType, registerAs } from '@nestjs/config';

export const databaseConfig = registerAs('database', () => ({
  url: process.env['DB_URL'],
}));

export type DatabaseConfigType = ConfigType<typeof databaseConfig>;
