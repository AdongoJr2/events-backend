import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: 'error',
        message: message || 'Unauthorized',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
