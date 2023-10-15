import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { UnauthorizedException } from 'src/utils/exceptions/unauthorized.exception';
import { TokenUserData } from 'src/core/types/token-user-data';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<TokenUserData> {
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      throw new UnauthorizedException('Incorrect username or password');
    }

    return user;
  }
}
