import { ExtractSubjectType } from '@casl/ability';
import { User } from '../../user/entities/user.entity';
import { Action } from '../enums/action.enum';
import { RolesAbility } from '../interfaces/roles-ability.interface';
import { AbilityBuild } from '../types/ability-build.type';
import { AppAbilityBuilder, Subjects } from '../types/app-ability-builder.type';

export class AdminAbility implements RolesAbility {
  constructor(private abilityBuilder: AppAbilityBuilder, private user: User) {}
  build(): AbilityBuild {
    const { can, cannot, build } = this.abilityBuilder;

    can(Action.READ, User);
    can(Action.DELETE, User);
    can(Action.UPDATE, User, { id: this.user.id });
    cannot(Action.CREATE, User);

    /***************
     *    USER     *
     ***************/
    // can(Action.READ, User);
    // can(Action.DELETE, User);
    // can(Action.UPDATE, User, { id: this.user.id });

    // /***************
    //  *   SUBJECT   *
    //  ***************/
    // can(Action.READ, Subject);
    // can(Action.DELETE, Subject);
    // cannot(Action.CREATE, Subject);
    // cannot(Action.UPDATE, Subject);

    // /***************
    //  *   COURSE    *
    //  ***************/
    // can(Action.READ, Course);
    // can(Action.DELETE, Course);
    // cannot(Action.CREATE, Course);
    // cannot(Action.UPDATE, Course);

    // /***************
    //  *   MODULE    *
    //  ***************/
    // can(Action.READ, Module);
    // can(Action.DELETE, Module);
    // cannot(Action.CREATE, Module);
    // cannot(Action.UPDATE, Module);

    // /***************
    //  *   CONTENT   *
    //  ***************/
    // can(Action.READ, Content);
    // can(Action.DELETE, Content);
    // cannot(Action.CREATE, Content);
    // cannot(Action.UPDATE, Content);

    // /***************
    //  * ENROLLMENT  *
    //  ***************/
    // can(Action.READ, Enrollment, {
    //   'user.role': Role.ADMIN,
    //   'user.id': id,
    // });
    // cannot(Action.UPDATE, Enrollment);
    // can(Action.DELETE, Enrollment);

    return build({
      detectSubjectType: (type) => type.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
