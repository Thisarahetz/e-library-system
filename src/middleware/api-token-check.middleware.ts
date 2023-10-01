import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ApiTokenException } from 'src/exceptions/api-token.exception';

export class UserRoleMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(req.headers);
    // assuming the user role is available in the request object
    if (req.headers['api-token'] !== '1234') {
      throw new ApiTokenException();
    }
    next();
  }
}
