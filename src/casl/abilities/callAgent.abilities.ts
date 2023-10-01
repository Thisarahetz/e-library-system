import { ExtractSubjectType } from '@casl/ability';
import { User } from '../../user/entities/user.entity';
import { Action } from '../enums/action.enum';
import { RolesAbility } from '../interfaces/roles-ability.interface';
import { AbilityBuild } from '../types/ability-build.type';
import { AppAbilityBuilder, Subjects } from '../types/app-ability-builder.type';

export class CallAgentAbility implements RolesAbility {
  constructor(private abilityBuilder: AppAbilityBuilder, private user: User) {}
  build(): AbilityBuild {
    const { can, cannot, build } = this.abilityBuilder;

    const { id } = this.user;

    can(Action.READ, User);
    can(Action.DELETE, User);
    can(Action.UPDATE, User, { id: this.user.id });
    can(Action.CREATE, User);

    return build({
      detectSubjectType: (type) => type.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
