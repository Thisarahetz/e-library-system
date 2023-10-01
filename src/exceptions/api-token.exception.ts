import { HttpException, HttpStatus } from '@nestjs/common';

export class ApiTokenException extends HttpException {
  constructor() {
    super('Token suggest is required', HttpStatus.UNAUTHORIZED);
  }
}
