import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { ApiResponseModule } from 'src/core/modules/api-response/api-response.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { LocalStrategy } from './strategies/local.stategy';
import { EventCategoryModule } from '../event-category/event-category.module';

@Module({
  imports: [
    UsersModule,
    EventCategoryModule,
    RefreshTokenModule,
    ApiResponseModule,
    PassportModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AccessTokenStrategy],
})
export class AuthModule {}
