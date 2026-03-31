import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { OneTimeCode } from 'src/common/entities/one-time-code.entity';
import { RefreshToken } from 'src/common/entities/refresh-token.entity';
import { SocialIdentity } from 'src/common/entities/social-identity.entity';
import { GoogleStrategy } from 'src/strategies/google.strategy';
import { JwtStrategy } from 'src/strategies/jwt.strategy';
import { LocalStrategy } from 'src/strategies/local.strategy';
import { MicrosoftStrategy } from 'src/strategies/microsoft.strategy';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vendor,
      SocialIdentity,
      RefreshToken,
      OneTimeCode,
    ]),
    ConfigModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    MicrosoftStrategy,
  ],
})
export class AuthModule {}
