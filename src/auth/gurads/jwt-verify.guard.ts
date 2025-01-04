import { isRabbitContext } from '@golevelup/nestjs-rabbitmq';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@prisma/client';
import { IS_PUBLIC_KEY } from 'src/common/decorators/public.decorator';
import { UserJwtPersona } from 'src/common/interfaces/user-jwt-persona.interface';

@Injectable()
export class JwtVerifyGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Do nothing if this is a RabbitMQ event
    if (isRabbitContext(context)) {
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) return false;

    const token = request?.headers?.authorization?.split(' ')[1];
    if (token) {
      let decodedUserJwt: UserJwtPersona;

      try {
        decodedUserJwt = this.jwtService.decode(token);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }

      try {
        this.jwtService.verify(token, {
          secret:
            decodedUserJwt.role === UserRole.USER
              ? this.configService.get<string>('USER_JWT_SECRET')
              : this.configService.get<string>('ADMIN_JWT_SECRET'),
        });

        request.persona = decodedUserJwt;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
      return true;
    }
    throw new UnauthorizedException('No token provided');
  }
}
