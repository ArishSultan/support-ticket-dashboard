import { Global, Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';

import { BetterAuthConfigFactory } from './better-auth.config';

@Global()
@Module({
  imports: [
    BetterAuthModule.forRootAsync({ useClass: BetterAuthConfigFactory }),
  ],
})
export class AuthModule {}
