import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  validate(_at: string, _rt: string, profile: Profile): Promise<OAuthProfile> {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error('No email found in Google profile');

    return Promise.resolve({
      provider: 'google',
      providerId: profile.id,
      email,
      displayName: profile.displayName,
    });
  }
}

export interface OAuthProfile {
  provider: 'google' | 'microsoft';
  providerId: string;
  email: string;
  displayName?: string;
}
