// user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from 'src/auth/interfaces/interface';

/**
 * read populated user from req.user
 * decorator @UseGuards(AuthGuard) must be used
 *
 */
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: RequestWithUser = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
