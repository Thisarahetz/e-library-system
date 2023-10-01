import { Injectable, NestMiddleware, NotAcceptableException, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Roles } from './roles.enum';
import { JwtService } from '@nestjs/jwt';

import { create, deleteValve, findAll, findOne, update } from '../../constants';

@Injectable()
export class AuthUserRoleMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService // private permissionsService: PermissionsService,
  ) {}
  async use(req: any, res: Response, next: NextFunction) {
    // console.log("Request: ", req);
    const { method, path, headers } = req;

    const match = path.match(/\/([^\/]+)$/);
    const lastPathSegment = match ? match[1] : '';

    // Exclude the login route from middleware execution
    if ((method === 'POST' && path === '/api/auth/login') || path == '/api/upload/file') {
      return next();
    }

    // Exclude the action route from middleware execution
    if (path === '/api/actions') {
      return next();
    }

    const bearerToken = headers.authorization;

    if (!bearerToken) {
      throw new UnauthorizedException('No bearer token provided');
    }

    // Extract the token from the "Authorization" header
    const token = bearerToken?.split(' ')[1];

    // console.log("decoded token --", token);

    let decodedToken: any = '';

    try {
      decodedToken = await this.jwtService.decode(token);
      const { role, roleName } = decodedToken;
    } catch (error) {
      throw new NotAcceptableException('token not valid');
    }

    const { role, roleName } = decodedToken;

    // Exclude the collections route from middleware execution

    // // console.log("path", path);
    // const id = path.substring('/api/collections/'.length);
    // if (
    //   path === '/api/collections' ||
    //   (path == `/api/collections/${id}` && roleName == Role.ADMIN)
    // ) {
    //   return next();
    // }

    // if (roleName == Role.LIADMIN) {
    //   return next();
    // }

    // const userPermissions = await this.permissionsService.getById(role);

    // //console.log(userPermissions);

    // const resources: string[] = [];
    // const resourcesForm: string[] = [];
    // const roleActions: number[] = [];

    // //get user permissions modules
    // userPermissions.permissions.forEach((permission) => {
    //   resources.push(permission.resources.toLowerCase());
    //   resourcesForm.push(permission.resources.toLowerCase() + 'form');

    //   if (permission.roleActions) {
    //     permission.roleActions.forEach((roleAction) => {
    //       roleActions.push(roleAction);
    //     });
    //   }

    //   // if (!roleActions.includes(roleAction)) {
    //   //     throw new UnauthorizedException('You do not have access.')
    //   // }
    // });

    // // console.log("-------", resources);
    // // console.log("-------", resourcesForm);
    // // console.log("-------", lastPathSegment.toLowerCase());

    // // Usage:

    // // if (!compareStringsIgnoreCase(resourcesForm, lastPathSegment)) {
    // //     throw new UnauthorizedException('You do not have access this module : ' + lastPathSegment)
    // // }

    // if (
    //   !resourcesForm.includes(lastPathSegment.toLowerCase()) &&
    //   !resources.includes(lastPathSegment.toLowerCase()) &&
    //   lastPathSegment.toLowerCase() !== 'util' &&
    //   method !== 'DELETE'
    // ) {
    //   throw new UnauthorizedException(
    //     'You do not have access to this module: ' + lastPathSegment,
    //   );
    // }

    // if (method === 'POST') {
    //   if (!roleActions.includes(create)) {
    //     throw new UnauthorizedException('You do not have access.');
    //   }
    // }

    // // console.log("roleaction", roleActions);

    // // if (method === 'GET') {
    // //     if (!roleActions.includes(findAll)) {
    // //         throw new UnauthorizedException('You do not have access..')
    // //     }
    // //     // } else if (!roleActions.includes(findOne)) {
    // //     //     throw new UnauthorizedException('You do not have access1.')
    // //     // }
    // // }

    // if (method === 'DELETE') {
    //   if (!roleActions.includes(deleteValve)) {
    //     throw new UnauthorizedException('You do not have access.');
    //   }
    // }

    // if (method === 'PUT') {
    //   if (!roleActions.includes(update)) {
    //     throw new UnauthorizedException('You do not have access.');
    //   }
    // }

    // // if (!roleActions.includes()) {
    // //         throw new UnauthorizedException('You do not have access.')
    // //     }

    // next();
    // Get the user's role from the request
    // const userRole = req.headers['api-token']
    // const userRole = req.user.role;

    // // Check if the user has the requir ed permissions based on their role
    // if (userRole === Roles.Admin) {
    //     // Admin has read and write permissions, so grant access
    //     next();
    // } else if (userRole === Roles.User) {
    //     // User has read-only permissions, so only allow GET requests
    //     if (req.method === 'GET') {
    //         next();
    //     } else {
    //         res.status(403).json({ message: 'You do not have write permissions.' });
    //     }
    // } else {
    //     // User role is not recognized, deny access
    //     res.status(403).json({ message: 'You do not have access.' });
    // }
  }
}
