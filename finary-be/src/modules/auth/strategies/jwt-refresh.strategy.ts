import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interfaces';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req?.cookies?.refreshToken)
          throw new UnauthorizedException('Refresh token missing');
        return req?.cookies?.refreshToken;
      },
      secretOrKey: configService.get<string>('config.jwt.refreshSecret'),
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
