import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { RequestUser } from 'src/decorators/public.decorator';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secretOrKey = config.get<string>('JWT_SECRET');
    if (!secretOrKey) {
      throw new Error('JWT_SECRET must be defined');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey,
    });
  }

  validate(payload: {
    sub: number;
    email: string;
    username: string;
  }): RequestUser {
    return {
      sub: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}
