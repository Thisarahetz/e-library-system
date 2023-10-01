import {
  AbilityBuilder,
  ExtractSubjectType,
  createMongoAbility,
  PureAbility,
  defineAbility,
  AbilityClass,
  InferSubjects,
  Ability,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Role } from 'src/auth/enums';
import { Action } from './enums/action.enum';
import { User } from 'src/user/entities/user.entity';
import e from 'express';
import { Article } from 'src/article/entities/article.entity';
import { roleAbilityFactory } from './role-ability.factory';
import { Condition } from 'typeorm';
import { AppAbility, Subjects } from './types/app-ability-builder.type';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const abilityBuilder = new AbilityBuilder<PureAbility<[Action, Subjects]>>(Ability as AbilityClass<AppAbility>);

    const userAbility = roleAbilityFactory.getFor(user).using(abilityBuilder);

    return userAbility.build();
  }
}
