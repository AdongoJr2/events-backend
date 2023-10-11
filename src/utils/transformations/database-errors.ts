import { HttpStatus } from '@nestjs/common';

const PostgresUniqueViolation = '23505';

export const formatDatabaseError = (
  driverError: any,
): { message: string; statusCode: number } => {
  if (driverError.code === PostgresUniqueViolation) {
    let field: string = driverError.detail.split('(')[1].slice(0, -2);
    const value: string = driverError.detail.split(')')[1].slice(2);

    if (field.startsWith('"')) field = field.replace(/\"/g, '');

    return {
      message: `A record with ${field}: ${value} already exists`,
      statusCode: HttpStatus.BAD_REQUEST,
    };
  }

  // TODO: handle other postgres database errors

  return { message: driverError.detail, statusCode: 500 };
};
