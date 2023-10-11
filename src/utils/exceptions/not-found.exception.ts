import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: 'error',
        message: message || 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
