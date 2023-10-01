import { Action } from './../../enums/action.enum';
import { PolicyHandler } from './../../interfaces/policy-handler.interface';
import { AppAbility } from './../../types/app-ability-builder.type';
import { User } from '../../../user/entities/user.entity';

export class UpdateUserPolicyHandler implements PolicyHandler {
  constructor(private user: User) {}

  handle(ability: AppAbility) {
    return ability.can(Action.UPDATE, this.user);
  }
}
