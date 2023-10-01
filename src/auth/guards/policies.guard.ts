import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
  NotFoundException,
  Scope,
  Type,
} from '@nestjs/common';
import { ContextIdFactory, ModuleRef, Reflector } from '@nestjs/core';
import { CaslAbilityFactory } from '../../casl/casl-ability.factory';
import { CHECK_POLICIES_KEY } from '../decorators/check-policies.decorator';
import { PolicyHandler } from '../../casl/interfaces/policy-handler.interface';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: CaslAbilityFactory,
    private moduleRef: ModuleRef,
    private authService: AuthService,
    private userService: UserService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers = this.reflector.get<Type<PolicyHandler>[]>(CHECK_POLICIES_KEY, context.getHandler()) || [];

    const request = context.switchToHttp().getRequest();

    const user = await this.getUser(context);

    const ability = this.caslAbilityFactory.createForUser(user);

    const contextId = ContextIdFactory.create();
    this.moduleRef.registerRequestByContextId(request, contextId);

    const handlers: PolicyHandler[] = [];

    for (const handler of policyHandlers) {
      const policyScope = this.moduleRef.introspect(handler).scope;
      let policyHandler: PolicyHandler;
      if (policyScope === Scope.DEFAULT) {
        policyHandler = this.moduleRef.get(handler, { strict: false });
      } else {
        policyHandler = await this.moduleRef.resolve(handler, contextId, {
          strict: false,
        });
      }
      handlers.push(policyHandler);
    }

    return handlers.every((handler) => handler.handle(ability));
  }

  //get user
  async getUser(context: ExecutionContext) {
    // const request = context.switchToHttp().getRequest();
    // const { user } = request;
    try {
      const request = context.switchToHttp().getRequest();

      // Check JWT token and validate user
      const token = request.headers.authorization?.split(' ')[1];

      if (!token) {
        throw new NotFoundException('Token not found');
      }

      const payload: JwtPayload = await this.authService.decodeToken(token);

      const user = await this.userService.findOneById(payload.id);

      if (!user) {
        throw new NotFoundException('Token not valid');
      }

      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
