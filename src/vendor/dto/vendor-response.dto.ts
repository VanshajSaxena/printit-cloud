import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { RefreshToken } from 'src/common/entities/refresh-token.entity';
import { SocialIdentity } from 'src/common/entities/social-identity.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { LocationDto } from './location.dto';
import { Point } from 'typeorm';

@Exclude()
export class VendorResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  displayName: string | null;

  @Expose()
  username: string;

  @Expose()
  address: string;

  @Expose()
  slug: string;

  @Expose()
  distance: number;

  @Exclude()
  @ApiHideProperty()
  email: string;

  @Exclude()
  @ApiHideProperty()
  printers: Printer[];

  @Exclude()
  @ApiHideProperty()
  passwordHash: string | null;

  @Exclude()
  @ApiHideProperty()
  location: Point | null;

  @Exclude()
  @ApiHideProperty()
  emailVerified: boolean;

  @Exclude()
  @ApiHideProperty()
  socialIdentities: SocialIdentity[];

  @Exclude()
  @ApiHideProperty()
  refreshTokens: RefreshToken[];

  @Exclude()
  @ApiHideProperty()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt: Date;

  @Exclude()
  @ApiHideProperty()
  deletedAt: Date;

  @Exclude()
  @ApiHideProperty()
  transactions: Transaction[];

  constructor(partial: Partial<VendorResponseDto>) {
    Object.assign(this, partial);
  }
}
