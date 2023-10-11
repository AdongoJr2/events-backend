import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('refresh-token')
export class RefreshTokenController {
  constructor(private readonly refreshTokenService: RefreshTokenService) {}
}
