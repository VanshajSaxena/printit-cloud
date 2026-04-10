import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';
import { RequestUser } from 'src/decorators/public.decorator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<RequestUser> {
    const vendor = await this.authService.validateCredentials(email, password);
    if (!vendor) throw new UnauthorizedException();
    return {
      sub: vendor.id,
      email: vendor.email,
      username: vendor.username,
    };
  }
}
