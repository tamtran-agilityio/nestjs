import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';
import authConfig from '../../config/auth.config';

@Injectable()
export class GqlRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const gqlContext = GqlExecutionContext.create(context);
    const request = gqlContext.getContext().req;
    if (!request || request.length === 0) return true;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      gqlContext.getHandler(),
      gqlContext.getClass(),
    ]);

    console.log('GqlRolesGuard - isPublic: ))))', isPublic);
    if (isPublic) {
      return true;
    }
    console.log('GqlRolesGuard - isPublic**:', isPublic);

    // const token = this.extractTokenFromHeader(request);

    // if (!token) {
    //   throw new UnauthorizedException('Access token is required');
    // }

    // try {
    //   const payload = await this.jwtService.verifyAsync(token, {
    //     secret: authConfig().secret,
    //   });
    //   request['user'] = payload;
    const gqlCtx = GqlExecutionContext.create(context);
    const user = gqlCtx.getContext().req?.user;
    const userRoles = user?.roles || [];
    return required.some((r) => userRoles.includes(r));
    // } catch {
    //   throw new UnauthorizedException('Invalid or expired access token');
    // }
  }

  private extractTokenFromHeader(request: Request): string | null {
    const header = request.headers['authorization'];
    if (!header) return null;
    const [type, token] = header.split(' ');
    return type === 'Bearer' ? token : null;
  }
}
