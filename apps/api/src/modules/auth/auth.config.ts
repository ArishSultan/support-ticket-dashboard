import { type ConfigType, registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  secret: process.env.BETTER_AUTH_SECRET! as string,
  sessionExpiresIn: parseInt(
    process.env.BETTER_AUTH_SESSION_EXPIRES_IN || '604800',
    10,
  ),
  sessionUpdateAge: parseInt(
    process.env.BETTER_AUTH_SESSION_UPDATE_AGE || '86400',
    10,
  ),
  sessionCookieMaxAge: parseInt(
    process.env.BETTER_AUTH_SESSION_COOKIE_MAX_AGE || '300',
    10,
  ),
}));

export type AuthConfigType = ConfigType<typeof authConfig>;
