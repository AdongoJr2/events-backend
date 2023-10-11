import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor() {
    super(
      {
        status: 'error',
        message: 'You do not have sufficient permissions for this action',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
