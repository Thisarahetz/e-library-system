import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl-ability.factory';
import { userPolicyProviders } from './provider/user';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [CaslAbilityFactory, ...userPolicyProviders],
  exports: [CaslAbilityFactory, ...userPolicyProviders],
})
export class CaslModule {}
