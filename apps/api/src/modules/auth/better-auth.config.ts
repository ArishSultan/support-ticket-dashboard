import * as uuid from 'uuid';
import * as schema from '@org/database/schema';

import { betterAuth } from 'better-auth';
import { admin, bearer } from 'better-auth/plugins';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { ConfigurableModuleOptionsFactory, Inject } from '@nestjs/common';

import type { BetterAuthOptions } from 'better-auth';

import { authConfig } from './auth.config';
import type { AuthConfigType } from './auth.config';

import { InjectDb } from '../../app/database';
import { appConfig, AppMode } from '../../app/app.config';

import type { Database } from '../../app/database';
import type { AppConfigType } from '../../app/app.config';

type ConfigOptionsType = { auth: ReturnType<typeof betterAuth> };

export class BetterAuthConfigFactory implements ConfigurableModuleOptionsFactory<
  ConfigOptionsType,
  'create'
> {
  constructor(
    @InjectDb() private readonly db: Database,
    @Inject(appConfig.KEY) private readonly appConfig: AppConfigType,
    @Inject(authConfig.KEY) private readonly authConfig: AuthConfigType,
  ) {}

  create(): Promise<ConfigOptionsType> | ConfigOptionsType {
    const isProd = this.appConfig.mode === AppMode.PROD;
    // TODO(passkey): once the passkey plugin is installed, push it here:
    // plugins.push(passkey({
    //   rpID: passkeyCfg.rpID,
    //   rpName: passkeyCfg.rpName,
    //   origin: passkeyCfg.origin ?? this.appConfig.appUrl,
    // }));
    // void passkeyCfg;

    return {
      auth: betterAuth({
        secret: this.authConfig.secret,
        baseURL: this.appConfig.apiUrl,
        basePath: '/api/auth',
        trustedOrigins: [this.appConfig.appUrl],

        database: drizzleAdapter(this.db, {
          provider: 'pg',
          schema: {
            user: schema.usersTable,
            session: schema.sessionsTable,
            account: schema.accountsTable,
            verification: schema.verificationsTable,
          },
        }),

        plugins: [
          bearer(),
          // New users are `agent`; `admin` is the elevated role that may manage
          // users and delete tickets.
          admin({ defaultRole: 'agent', adminRoles: ['admin'] }),
        ],

        emailAndPassword: {
          enabled: true,
          minPasswordLength: 8,
          maxPasswordLength: 128,
          requireEmailVerification: false,
          sendResetPassword: async ({ user, url }) => {
            // TODO: No Email service setup yet.
            console.log(
              `[better-auth] Reset password for ${user.email}: ${url}`,
            );
          },
        },

        emailVerification: {
          sendOnSignUp: true,
          autoSignInAfterVerification: true,
          sendVerificationEmail: async ({ user, url }) => {
            // TODO: No Email service setup yet.
            console.log(`[better-auth] Verify email for ${user.email}: ${url}`);
          },
        },

        // Rate limiting is on by default; set AUTH_RATE_LIMIT_ENABLED=false to
        // disable it (used by the e2e test API, which drives many rapid logins).
        rateLimit: {
          enabled: process.env.AUTH_RATE_LIMIT_ENABLED !== 'false',
          window: 10,
          max: 100,
        },
        session: {
          expiresIn: this.authConfig.sessionExpiresIn,
          updateAge: this.authConfig.sessionUpdateAge,
          cookieCache: {
            enabled: true,
            maxAge: this.authConfig.sessionCookieMaxAge,
          },
        },

        advanced: {
          // Harden session cookies. `secure` only in production so local HTTP dev works.
          useSecureCookies: isProd,
          defaultCookieAttributes: {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
          },
          // Generate a valid UUID (v7) instead of better-auth's random text id.
          database: { generateId: () => uuid.v7() },
        },
      } as BetterAuthOptions),
    };
  }
}
