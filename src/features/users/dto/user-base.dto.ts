import {
  Length,
  NotContains,
  IsEmail,
  ValidationArguments,
  IsDefined,
} from 'class-validator';

export abstract class UserBaseDto {
  @IsDefined({
    message: '$property is required',
  })
  firstName: string;

  @IsDefined({
    message: '$property is required',
  })
  lastName: string;

  @Length(4, 15, {
    message:
      '$property must have between $constraint1 and $constraint2 characters',
  })
  @NotContains(' ', {
    message: '$property cannot contain spaces',
  })
  username: string;

  @IsEmail(undefined, {
    message: (args: ValidationArguments) => {
      if (args.value !== undefined && args.value !== null) {
        return 'the $property provided is invalid';
      }

      return 'provide a valid email address';
    },
  })
  email: string;

  // @IsMobilePhone(
  //   'en-KE',
  //   {},
  //   {
  //     message: (args: ValidationArguments) => {
  //       if (args.value !== undefined && args.value !== null) {
  //         if (args.value.length === 0) {
  //           return '$property cannot be empty';
  //         }

  //         return '$value is not a valid Kenyan mobile phone number';
  //       }

  //       return '$property should be valid Kenyan mobile phone number';
  //     },
  //   },
  // )
  // phoneNumber: string;
}
