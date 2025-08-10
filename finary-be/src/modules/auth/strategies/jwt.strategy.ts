import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: (req: Request) => {
        if (!req?.cookies?.accessToken) throw new UnauthorizedException();
        return req.cookies.accessToken;
      },
      secretOrKey: configService.get<string>('config.jwt.secret'),
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}
