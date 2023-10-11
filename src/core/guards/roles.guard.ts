import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserRole } from 'src/utils/enums';
import { ForbiddenException } from 'src/utils/exceptions/forbidden.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request?.user;

    return this.matchRoles(roles, user?.role);
  }

  private matchRoles(authorizedRoles: UserRole[], userRole: any) {
    const userAllowed = authorizedRoles.includes(userRole);
    if (userAllowed) return true;

    throw new ForbiddenException();
  }
}
