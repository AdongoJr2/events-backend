import { IsDefined, IsJWT } from 'class-validator';

export class RefreshTokenDto {
  @IsDefined({
    message: '$property is required',
  })
  @IsJWT({
    message: '$property should be a valid JWT',
  })
  refreshToken: string;
}
