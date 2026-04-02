import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { type Response } from 'express';
import {
  CurrentUser,
  Public,
  type RequestUser,
} from 'src/decorators/public.decorator';
import { LocalGuard } from 'src/guards/local.guard';
import { type OAuthProfile } from 'src/strategies/google.strategy';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Repository } from 'typeorm';
import { AuthService } from './auth.service';
import { ExchangeRequestDto } from './dto/exchange-request.dto';
import { LoginDto } from './dto/login-request.dto';
import { RefreshRequestDto } from './dto/refresh-request.dto';

import { TokenResponseDto } from './dto/token-response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(Vendor) private vendorRepo: Repository<Vendor>,
  ) {}

  @Public()
  @UseGuards(LocalGuard)
  @Post('login')
  @ApiOperation({ summary: 'Authenticate with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@CurrentUser() user: RequestUser): Promise<TokenResponseDto> {
    return this.authService.login(user);
  }

  @Public()
  @Post('refresh')
  @ApiOperation({ summary: 'Rotate access and refresh tokens' })
  @ApiBody({ type: RefreshRequestDto })
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
  async refresh(
    @Body() { refreshToken }: RefreshRequestDto,
  ): Promise<TokenResponseDto> {
    return this.authService.refreshTokens(refreshToken);
  }

  @Public()
  @Post('exchange')
  @ApiOperation({
    summary: 'Exchange one-time OAuth code for token pair',
    description:
      'Called by the Electron app after receiving the code via the `printit://` custom protocol redirect.',
  })
  @ApiBody({ type: ExchangeRequestDto })
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'Code invalid or expired' })
  async exchangeCode(
    @Body() { code }: ExchangeRequestDto,
  ): Promise<TokenResponseDto> {
    const vendorId = await this.authService.consumeOneTimeCode(code);
    const vendor = await this.vendorRepo.findOneOrFail({
      where: { id: vendorId },
    });
    return this.authService.login({ sub: vendor.id, email: vendor.email });
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Revoke refresh token and end session' })
  @ApiBody({ type: RefreshRequestDto })
  @ApiNoContentResponse({ description: 'Successfully logged out' })
  async logout(@Body() { refreshToken }: RefreshRequestDto): Promise<void> {
    await this.authService.revokeRefreshToken(refreshToken);
  }

  // ── OAuth ─────────────────────────────────────────────────────────────────
  // Callback endpoints are excluded from the spec — they are browser-facing
  // redirects, not API endpoints the client calls directly.

  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({
    summary: 'Initiate Google OAuth flow',
    description:
      'Redirects to Google consent screen. Open in system browser from Electron via `shell.openExternal`.',
  })
  @ApiOkResponse({ description: 'Redirects to Google' })
  googleAuth() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiExcludeEndpoint()
  async googleCallback(
    @CurrentUser() profile: OAuthProfile,
    @Res() res: Response,
  ) {
    const vendor = await this.authService.findOrLinkSocialIdentity(profile);
    const code = await this.authService.issueOneTimeCode(vendor.id);
    res.redirect(`printit://auth?code=${code}`);
  }

  @Public()
  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  @ApiOperation({
    summary: 'Initiate Microsoft OAuth flow',
    description:
      'Redirects to Microsoft consent screen. Open in system browser from Electron via `shell.openExternal`.',
  })
  @ApiOkResponse({ description: 'Redirects to Microsoft' })
  microsoftAuth() {}

  @Public()
  @Get('microsoft/callback')
  @UseGuards(AuthGuard('microsoft'))
  @ApiExcludeEndpoint()
  async microsoftCallback(
    @CurrentUser() profile: OAuthProfile,
    @Res() res: Response,
  ) {
    const vendor = await this.authService.findOrLinkSocialIdentity(profile);
    const code = await this.authService.issueOneTimeCode(vendor.id);
    res.redirect(`printit://auth?code=${code}`);
  }
}
