import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CurrentUser,
  Public,
  type RequestUser,
} from 'src/decorators/public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { type OAuthProfile } from 'src/strategies/google.strategy';
import { LocalGuard } from 'src/guards/local.guard';
import { type Response } from 'express';
import { Repository } from 'typeorm';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
  ) {}
  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  async login(@CurrentUser() user: RequestUser) {
    return this.authService.login(user);
  }

  @Public()
  @Post('refresh')
  async refresh(@Body('refreshToken') token: string) {
    return this.authService.refreshTokens(token);
  }

  // OAuth initiation — redirect to Google
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @CurrentUser() profile: OAuthProfile,
    @Res() res: Response,
  ) {
    const vendor = await this.authService.findOrLinkSocialIdentity(profile);
    const code = await this.authService.issueOneTimeCode(vendor.id);
    // Electron registered 'printit://' as custom protocol
    res.redirect(`printit://auth?code=${code}`);
  }

  @Public()
  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  microsoftAuth() {}

  @Public()
  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftCallback(
    @CurrentUser() profile: OAuthProfile,
    @Res() res: Response,
  ) {
    const vendor = await this.authService.findOrLinkSocialIdentity(profile);
    const code = await this.authService.issueOneTimeCode(vendor.id);
    res.redirect(`printit://auth?code=${code}`);
  }

  @Public()
  @Post('exchange')
  async exchangeCode(@Body('code') code: string) {
    const vendorId = await this.authService.consumeOneTimeCode(code);
    const vendor = await this.vendorRepo.findOneOrFail({
      where: { id: vendorId },
    });
    return this.authService.login({ sub: vendor.id, email: vendor.email });
  }

  @Post('logout')
  async logout(@Body('refreshToken') token: string) {
    await this.authService.revokeRefreshToken(token);
  }
}
