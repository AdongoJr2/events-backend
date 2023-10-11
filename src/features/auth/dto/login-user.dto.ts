import { IsDefined } from 'class-validator';

export class LoginUserDto {
  @IsDefined({
    message: '$property is required',
  })
  username: string;

  @IsDefined({
    message: '$property is required',
  })
  password: string;
}
