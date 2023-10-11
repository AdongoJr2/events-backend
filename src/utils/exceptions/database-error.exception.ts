import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseErrorException extends HttpException {
  constructor(message: string, data?: any) {
    super(
      {
        status: 'error',
        message: message || 'An error occurred',
        data,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
