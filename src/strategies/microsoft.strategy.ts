import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { OAuthProfile } from './google.strategy';
import { Profile } from 'passport';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow('MICROSOFT_CLIENT_ID'),
      clientSecret: config.getOrThrow('MICROSOFT_CLIENT_SECRET'),
      callbackURL: config.getOrThrow('MICROSOFT_CALLBACK_URL'),
      scope: ['user.read'],
      tenant: 'common',
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: MicrosoftProfile,
  ): Promise<OAuthProfile> {
    const email =
      profile.emails?.[0]?.value ??
      profile._json?.mail ??
      profile._json?.userPrincipalName;

    if (!email) {
      throw new Error('No email found in Microsoft profile');
    }

    return Promise.resolve({
      provider: 'microsoft',
      providerId: profile.id,
      email,
      displayName: profile.displayName,
    });
  }
}
type MicrosoftProfile = Profile & {
  _json?: {
    mail?: string;
    userPrincipalName?: string;
  };
};
