import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { ApiResponseService } from 'src/core/modules/api-response/api-response/api-response.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { DtoValidationPipe } from 'src/core/pipes/dto-validation/dto-validation.pipe';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { formatDatabaseError } from 'src/utils/transformations/database-errors';
import { DatabaseErrorException } from 'src/utils/exceptions/database-error.exception';
import { InternalServerErrorException } from 'src/utils/exceptions/internal-server-error.exception';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LoginUserDto } from './dto/login-user.dto';
import { UnauthorizedException } from 'src/utils/exceptions/unauthorized.exception';
import { LogoutUserDto } from './dto/logout-user.dto';
import { NotFoundException } from 'src/utils/exceptions/not-found.exception';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly apiResponseService: ApiResponseService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  async signup(@Body(new DtoValidationPipe()) createUserDto: CreateUserDto) {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashedPassword;

      const createdUser = await this.authService.createUser(createUserDto);

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'User registered successfully',
        data: createdUser,
      });

      return responseBody;
    } catch (error: any) {
      // errors from the database
      if (error?.driverError) {
        const { message } = formatDatabaseError(error.driverError);
        throw new DatabaseErrorException(message);
      }

      // other errors
      throw new InternalServerErrorException(error);
    }
  }

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Request() req: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Body(DtoValidationPipe) loginUserDto: LoginUserDto,
  ) {
    try {
      const authTokens = await this.authService.login(req.user);

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'user logged in successfully',
        data: authTokens,
      });

      return responseBody;
    } catch (error: any) {
      if (error?.name === 'UnauthorizedException') {
        throw new UnauthorizedException(error?.message);
      }

      // other errors
      throw new InternalServerErrorException(error);
    }
  }

  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async Logout(@Body(DtoValidationPipe) logoutUserDto: LogoutUserDto) {
    try {
      const foundRefreshToken = await this.refreshTokenService.findOneByToken(
        logoutUserDto.refreshToken,
      );

      await this.refreshTokenService.delete(foundRefreshToken.id);

      const responseBody = this.apiResponseService.getResponseBody({
        status: 'success',
        message: 'user logged out successfully',
        data: undefined,
      });

      return responseBody;
    } catch (error) {
      if (error?.name === 'UnauthorizedException') {
        throw new UnauthorizedException(error?.message);
      }

      if (error?.name === 'NotFoundException') {
        throw new NotFoundException(error?.message);
      }

      // other errors
      throw new InternalServerErrorException(error);
    }
  }
}
