import { Provider } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateUserPolicyHandler } from '../../policy-handler/user/create-user-policy.handler';
import { User } from '../../../user/entities/user.entity';

export const CreateUserPolicyProvider: Provider = {
  provide: CreateUserPolicyHandler,
  inject: [REQUEST],
  useFactory: async (request: Request) => {
    const { id } = request.params;
    const user = new User();
    user.id = id;
    return new CreateUserPolicyHandler(user);
  },
};
