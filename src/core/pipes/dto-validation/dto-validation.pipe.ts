/* eslint-disable @typescript-eslint/ban-types */
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ValidationErrorFormatted } from 'src/core/types/validation-error';
import { DtoValidationErrorException } from 'src/utils/exceptions/dto-validation-error.exception';

@Injectable()
export class DtoValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!metadata.metatype || !this.toValidate(metadata.metatype)) {
      return value;
    }

    const object = plainToInstance(metadata.metatype, value);
    const validationErrors = await validate(object, { whitelist: true });

    if (validationErrors.length > 0) {
      const validationErrorsFormatted =
        this.formatValidationErrors(validationErrors);

      throw new DtoValidationErrorException(validationErrorsFormatted);
    }

    return value;
  }

  // responsible for bypassing the validation step when the current argument being processed is a native JavaScript type
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private formatValidationErrors(
    validationErrors: ValidationError[],
  ): ValidationErrorFormatted[] {
    const validationErrorsFormatted = validationErrors.map((error) => {
      return {
        field: error.property,
        errors: Object.values(error.constraints ?? {}),
      };
    });

    return validationErrorsFormatted;
  }
}
