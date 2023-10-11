import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationErrorFormatted } from 'src/core/types/validation-error';

export class DtoValidationErrorException extends HttpException {
  constructor(formattedValidationErrors: ValidationErrorFormatted[]) {
    super(
      {
        status: 'error',
        message: 'Invalid input',
        data: formattedValidationErrors,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
