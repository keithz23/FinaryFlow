import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class CombinedAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return (await super.canActivate(context)) as boolean;
    } catch (err) {
      const refreshGuard = new (AuthGuard('jwt-refresh'))();
      const success = await refreshGuard.canActivate(context);
      if (!success) throw new UnauthorizedException();
      return true;
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) throw err || new UnauthorizedException();
    return user;
  }
}
