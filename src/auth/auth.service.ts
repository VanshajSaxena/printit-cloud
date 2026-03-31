import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { OneTimeCode } from 'src/common/entities/one-time-code.entity';
import { RefreshToken } from 'src/common/entities/refresh-token.entity';
import { SocialIdentity } from 'src/common/entities/social-identity.entity';
import { RequestUser } from 'src/decorators/public.decorator';
import { OAuthProfile } from 'src/strategies/google.strategy';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(SocialIdentity)
    private readonly socialRepository: Repository<SocialIdentity>,
    @InjectRepository(RefreshToken)
    private readonly refreshRepository: Repository<RefreshToken>,
    @InjectRepository(OneTimeCode)
    private readonly oneTimeCodeRepository: Repository<OneTimeCode>,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Vendor | null> {
    const vendor = await this.vendorRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash'],
    });
    if (!vendor?.passwordHash) return null;
    const valid = await compare(password, vendor.passwordHash);
    return valid ? vendor : null;
  }

  async login(vendor: RequestUser) {
    const [accessToken, refreshToken] = await Promise.all([
      this.issueAccessToken(vendor),
      this.issueRefreshToken(vendor.sub),
    ]);
    return { accessToken, refreshToken };
  }

  private issueAccessToken(user: RequestUser): string {
    return this.jwtService.sign(
      { sub: user.sub, email: user.email },
      { expiresIn: '6h', secret: this.config.get('JWT_SECRET') },
    );
  }

  private async issueRefreshToken(vendorId: number): Promise<string> {
    const raw = randomBytes(40).toString('hex');
    const hash = createHash('sha256').update(raw).digest('hex');
    await this.refreshRepository.save({
      tokenHash: hash,
      vendorId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    return raw;
  }

  async refreshTokens(rawToken: string) {
    const hash = createHash('sha256').update(rawToken).digest('hex');
    const stored = await this.refreshRepository.findOne({
      where: { tokenHash: hash, revoked: false },
      relations: ['vendor'],
    });

    if (!stored || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate: revoke old, issue new pair
    await this.refreshRepository.update(stored.id, { revoked: true });
    return this.login({ sub: stored.vendor.id, email: stored.vendor.email });
  }

  async findOrLinkSocialIdentity(profile: OAuthProfile): Promise<Vendor> {
    // 1. Existing identity?
    const existing = await this.socialRepository.findOne({
      where: { provider: profile.provider, providerId: profile.providerId },
      relations: ['vendor'],
    });
    if (existing) return existing.vendor;

    // 2. Vendor with matching email?
    const vendor = await this.vendorRepository.findOne({
      where: { email: profile.email },
    });
    if (!vendor)
      throw new NotFoundException(
        `No vendor account for ${profile.email}. Contact admin.`,
      );

    // 3. Link and return
    await this.socialRepository.save({ ...profile, vendor });
    return vendor;
  }

  async issueOneTimeCode(vendorId: number): Promise<string> {
    // Clean up any stale codes for this vendor before issuing a new one
    await this.oneTimeCodeRepository.delete({ vendorId });

    const code = randomUUID();
    await this.oneTimeCodeRepository.save({
      code,
      vendorId,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
    });
    return code;
  }

  async consumeOneTimeCode(code: string): Promise<number> {
    const record = await this.oneTimeCodeRepository.findOne({
      where: { code },
    });

    if (!record) {
      throw new UnauthorizedException('Invalid authorization code');
    }

    // Always delete first — prevents any race condition on double-use
    await this.oneTimeCodeRepository.delete({ id: record.id });

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Authorization code expired');
    }

    return record.vendorId;
  }

  // ─── Refresh Token ────────────────────────────────────────────────────────────

  async revokeRefreshToken(rawToken: string): Promise<void> {
    const hash = createHash('sha256').update(rawToken).digest('hex');
    // Silently ignore if token doesn't exist — idempotent logout
    await this.refreshRepository.update({ tokenHash: hash }, { revoked: true });
  }
}
