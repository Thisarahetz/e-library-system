import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateUserPolicyHandler } from '../../policy-handler/user/update-user-policy.handler';
import { User } from '../../../user/entities/user.entity';
import { UserService } from 'src/user/user.service';

export const UpdateUserPolicyProvider: Provider = {
  provide: UpdateUserPolicyHandler,
  inject: [UserService, REQUEST],
  useFactory: async (userService: UserService, request: Request) => {
    const { id } = request.params;

    const users = await userService.findOneById(id);

    return new UpdateUserPolicyHandler(users);
  },
};
