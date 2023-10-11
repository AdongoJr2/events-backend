import { IsDefined, MinLength } from 'class-validator';
import { UserBaseDto } from './user-base.dto';

export class CreateUserDto extends UserBaseDto {
  @IsDefined({
    message: '$property is required',
  })
  username: string;

  @IsDefined({
    message: '$property is required',
  })
  email: string;

  @IsDefined({
    message: '$property is required',
  })
  phoneNumber: string;

  @MinLength(6, {
    message: '$property must be at least $constraint1 characters long',
  })
  @IsDefined({
    message: '$property is required',
  })
  password: string;
}
