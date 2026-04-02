import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class TokenResponseDto {
  @Expose()
  accessToken: string;
  @Expose()
  refreshToken: string;
}

@Exclude()
export class AccessTokenResponseDto {
  @Expose()
  accessToken: string;
}
