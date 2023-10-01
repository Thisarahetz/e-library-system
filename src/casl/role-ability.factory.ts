import { User } from '../user/entities/user.entity';
import { AdminAbility } from './abilities/admin.abilities';
import { SuperAdminAbility } from './abilities/superAdmin.abilities';
import { Role } from './../auth/enums/index';
import { RolesAbility } from './interfaces/roles-ability.interface';
import { AppAbilityBuilder } from './types/app-ability-builder.type';
import { CallAgentAbility } from './abilities/callAgent.abilities';
import { MethodNotAllowedException } from '@nestjs/common';

/*
 * Used by rolesAbilityFactory
 * A function that returns a hashmap with [key=Role, value=RolesAbility]
 */
const rolesAbilityDraft = (abilityBuilder: AppAbilityBuilder, user: User) => ({
  admin: (): RolesAbility => new AdminAbility(abilityBuilder, user),
  // instructor: (): RolesAbility => new InstructorAbility(abilityBuilder, user),
  // student: (): RolesAbility => new StudentAbility(abilityBuilder, user),
  liadmin: (): RolesAbility => new SuperAdminAbility(abilityBuilder, user),
  callagent: (): RolesAbility => new CallAgentAbility(abilityBuilder, user),
});

// Factory function that returns a RolesAbility object
export const roleAbilityFactory = {
  getFor: (user: User) => ({
    using: (abilityBuilder: AppAbilityBuilder) => {
      const role: Role | string = user.role;
      const getAbility = rolesAbilityDraft(abilityBuilder, user)[role];

      if (!getAbility) {
        throw new MethodNotAllowedException(`No ability found for role: ${role}`);
      }

      return getAbility();
    },
  }),
};
