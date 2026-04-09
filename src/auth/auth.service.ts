import { Injectable, UnauthorizedException } from '@nestjs/common';
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
import { VendorService } from 'src/vendor/vendor.service';
import { Repository } from 'typeorm';
import { RegisterVendorDto } from './dto/register-vendor.dto';
import { TokenResponseDto } from './dto/token-response.dto';

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
    private readonly vendorService: VendorService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterVendorDto): Promise<TokenResponseDto> {
    const vendor = await this.vendorService.create({ ...dto });
    return this.login({
      sub: vendor.id,
      email: vendor.email,
      username: vendor.username,
      slug: vendor.slug,
    });
  }

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<Vendor | null> {
    const vendor = await this.vendorRepository.findOne({
      where: { email },
      select: ['id', 'email', 'passwordHash', 'username', 'slug'],
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
      {
        sub: user.sub,
        email: user.email,
        username: user.username,
        slug: user.slug,
      },
      { expiresIn: '24h', secret: this.config.get('JWT_SECRET') },
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

    await this.refreshRepository.update(stored.id, { revoked: true });
    return this.login({
      sub: stored.vendor.id,
      email: stored.vendor.email,
      username: stored.vendor.username,
      slug: stored.vendor.slug,
    });
  }

  async findOrLinkSocialIdentity(profile: OAuthProfile): Promise<Vendor> {
    const existing = await this.socialRepository.findOne({
      where: { provider: profile.provider, providerId: profile.providerId },
      relations: ['vendor'],
    });
    if (existing) return existing.vendor;

    let vendor = await this.vendorRepository.findOne({
      where: { email: profile.email },
    });

    if (!vendor) {
      vendor = await this.createVendorFromOAuth(profile);
    }

    await this.socialRepository.save({
      provider: profile.provider,
      providerId: profile.providerId,
      email: profile.email,
      vendor,
    });

    return vendor;
  }

  private async createVendorFromOAuth(profile: OAuthProfile) {
    const [firstName, ...rest] = (profile.displayName ?? profile.email).split(
      ' ',
    );
    return this.vendorService.create({
      email: profile.email,
      firstName: firstName,
      lastName: rest.join(' ') || undefined,
      displayName: profile.displayName ?? undefined,
    });
  }

  async issueOneTimeCode(vendorId: number): Promise<string> {
    await this.oneTimeCodeRepository.delete({ vendorId });

    const code = randomUUID();
    await this.oneTimeCodeRepository.save({
      code,
      vendorId,
      expiresAt: new Date(Date.now() + 2 * 60 * 1000),
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

    await this.oneTimeCodeRepository.delete({ id: record.id });

    if (record.expiresAt < new Date()) {
      throw new UnauthorizedException('Authorization code expired');
    }

    return record.vendorId;
  }

  async revokeRefreshToken(rawToken: string): Promise<void> {
    const hash = createHash('sha256').update(rawToken).digest('hex');

    await this.refreshRepository.update({ tokenHash: hash }, { revoked: true });
  }

  verifyToken(token: string): RequestUser {
    return this.jwtService.verify(token, {
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
