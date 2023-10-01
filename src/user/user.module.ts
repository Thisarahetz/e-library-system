import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserFeatureCategory } from './entities/user-feature-category.entity';
import { Action } from './entities/action.entity';
// import { UserAbilityFactory } from 'src/auth/factory/user-ability.factory';
import { MailingModule } from 'src/mail/mailing.module';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserFeatureCategory, Action]), MailingModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, CaslAbilityFactory, JwtService],
  exports: [UserService],
})
export class UserModule {}
