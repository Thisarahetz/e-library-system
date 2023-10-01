import { Injectable } from '@nestjs/common';
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { Role } from '../enums/index';

@Injectable()
export class UserAbilityFactory {
  createForUser(user: any) {
    const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

    if (user.role === Role.ADMIN) {
      can('manage', 'all');
    } else if (user.role === Role.CALL_AGENTS) {
      can('update', 'CallAgent', { id: user.id });
    }

    return build();
  }
}
