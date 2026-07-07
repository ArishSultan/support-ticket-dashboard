import { type ConfigType, registerAs } from '@nestjs/config';

export enum AppMode {
  DEV = 'DEV',
  PROD = 'PROD',
}

export const appConfig = registerAs('app', () => ({
  mode: (process.env.APP_MODE as AppMode) || AppMode.DEV,

  apiUrl: process.env.API_URL!,
  appUrl: process.env.APP_URL!,

  host: process.env.API_HOST || '0.0.0.0',
  port: parseInt(process.env['API_PORT'] || '4000', 10),
}));

export type AppConfigType = ConfigType<typeof appConfig>;
