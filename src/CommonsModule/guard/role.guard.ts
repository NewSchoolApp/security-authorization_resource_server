import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AppConfigService as ConfigService } from '../../ConfigModule/service/app-config.service';
import { UserJWTDTO } from "../dto/user-jwt.dto";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] =
      this.reflector.get<string[]>('roles', context.getHandler()) || [];
    const policies: string[] =
      this.reflector.get<string[]>('policies', context.getHandler()) || [];
    if (!roles.length && !policies.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authorizationHeader = request.headers.authorization;

    if (!authorizationHeader) return false;

    const [, token] = authorizationHeader.split(' ');
    let user: UserJWTDTO;
    try {
      user = this.jwtService.verify<UserJWTDTO>(token, {
        secret: this.configService.jwtSecret,
      });
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        throw new UnauthorizedException(e.message);
      }
      throw new InternalServerErrorException(e);
    }

    const hasRoles = roles.length
      ? roles.some((role) => role === user.role.name)
      : true;

    const hasPolicies = policies.length
      ? policies.some((policy) =>
          user.role.policies.some((userPolicy) => userPolicy.name === policy),
        )
      : true;

    return hasRoles || hasPolicies;
  }
}
