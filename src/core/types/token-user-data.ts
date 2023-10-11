import { User } from 'src/features/users/entities/user.entity';
import { DeepPartial } from 'typeorm';
import * as jwt from 'jsonwebtoken';

export type TokenUserData = Pick<User, 'id' | 'username' | 'role'>;

export type TokenType = 'access' | 'refresh';

export type VerifiedToken = DeepPartial<User> & jwt.JwtPayload;
