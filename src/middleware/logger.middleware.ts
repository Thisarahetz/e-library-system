import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditService } from 'src/audit/audit.service';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly auditService: AuditService, private readonly authService: AuthService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const { ip, method, originalUrl, headers } = request;

    const token = headers.authorization?.split(' ')[1];

    let user = null;

    this.authService.decodeToken(token).then((decoded) => {
      user = decoded;
    });

    const userAgent = request.get('user-agent') || '';

    response.on('finish', () => {
      const { statusCode, statusMessage } = response;
      const contentLength = response.get('content-length');

      const metadata = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip} }`;

      if (statusCode >= 201) {
        this.auditService.log(statusMessage, {
          userId: user?.id || 'anonymous',
          statusCode: statusCode,
          metadata: metadata,
        });
      }
    });

    next();
  }
}
