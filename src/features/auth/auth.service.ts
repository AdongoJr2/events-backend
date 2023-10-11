import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from '../users/users.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import {
  TokenType,
  TokenUserData,
  VerifiedToken,
} from 'src/core/types/token-user-data';
import { NotFoundException } from 'src/utils/exceptions/not-found.exception';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private refreshTokenService: RefreshTokenService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const newUser = await this.usersService.createUser(createUserDto);
      return new User({ ...newUser });
    } catch (error) {
      throw error;
    }
  }

  async validateUser(
    loginUserDto: LoginUserDto,
  ): Promise<TokenUserData | null> {
    const foundUser = await this.usersService.findOneByUsername(
      loginUserDto?.username,
    );

    if (!foundUser) {
      // throw new UnauthorizedException('Incorrect email or password');
      return null;
    }

    const isPasswordCorrect = await bcrypt.compare(
      loginUserDto?.password,
      foundUser.password,
    );
    if (!isPasswordCorrect) {
      // throw new UnauthorizedException('Incorrect email or password');
      return null;
    }

    const user: TokenUserData = {
      id: foundUser.id,
      username: foundUser.username,
      role: foundUser.role,
    };

    return user;
  }

  async login(tokenUserData: TokenUserData) {
    try {
      const authTokens = await this.generateAuthTokens(tokenUserData);

      // TODO: implement hashing on the refresh tokens being saved to the database, and subsequent implementation in 'refreshAuthTokens'
      // methos below

      // const hashedRefreshToken = await bcrypt.hash(authTokens.refreshToken, 10);
      // await this.refreshTokenService.create(hashedRefreshToken);
      await this.refreshTokenService.create(authTokens.refreshToken);

      return authTokens;
    } catch (error) {
      throw error;
    }
  }

  async generateAuthTokens({ id, username, role }: TokenUserData) {
    const payload = { sub: id, username, role };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'ACCESS_TOKEN_EXPIRY_TIMESPAN',
        ),
      }),

      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: this.configService.get<string>(
          'REFRESH_TOKEN_EXPIRY_TIMESPAN',
        ),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  verifyJWTAuthToken(
    token: string,
    tokenType: TokenType = 'access',
  ): Promise<VerifiedToken> {
    const tokenSecret =
      tokenType === 'access'
        ? (this.configService.get<string>('ACCESS_TOKEN_SECRET') as string)
        : (this.configService.get<string>('REFRESH_TOKEN_SECRET') as string);

    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        tokenSecret,
        (err: any, verifiedToken: VerifiedToken) => {
          if (err) {
            reject(
              // TODO: reject with '403' exception when 'tokenType' === 'access'
              new NotFoundException(
                `The ${tokenType} token provided is invalid or has expired`,
              ),
            );
          }

          resolve(verifiedToken);
        },
      );
    });
  }
}
