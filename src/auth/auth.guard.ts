import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { verify, decode, JwtPayload } from 'jsonwebtoken';
import { IDecodedUser, RequestWithUser } from './interfaces/interface';

@Injectable()
export class AuthGuard implements CanActivate {
  static role = 'user';
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const bearerToken = request.headers.authorization;
    if (!bearerToken)
      throw new UnauthorizedException('Authorization header is missing');

    const token = bearerToken.split(' ')[1];

    const decode = verify(token, process.env.SECRET_KEY) as IDecodedUser;
    request.user = decode;

    if (decode) return true;
    return false;
  }
}
@Injectable()
export class AdminGuard implements CanActivate {
  static role = 'user';
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    const bearerToken = request.headers.authorization;
    if (!bearerToken)
      throw new UnauthorizedException('Authorization header is missing');

    const token = bearerToken.split(' ')[1];

    const decode = verify(token, process.env.SECRET_KEY) as IDecodedUser;
    request.user = decode;
    console.log(decode);
    if (decode && decode.role === 'admin') return true;
    return false;
  }
}
