import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
  constructor(error: any) {
    super(
      {
        status: 'error',
        message: 'An unknown error occurred',
        data: error?.message ? { error: error.message } : error,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
