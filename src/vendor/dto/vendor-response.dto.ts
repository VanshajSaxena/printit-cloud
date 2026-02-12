import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Printer } from 'src/printer/entities/printer.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { LocationDto } from './location.dto';

@Exclude()
export class VendorResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  givenName: string | null;

  @Expose()
  username: string;

  @Expose()
  address: string;

  @Expose()
  slug: string;

  @Expose()
  @Type(() => LocationDto)
  location: LocationDto | null;

  @Expose()
  distance: number; // <--- This is the new field

  @Exclude()
  @ApiHideProperty()
  email: string;

  @Exclude()
  @ApiHideProperty()
  printers: Printer[];

  @Exclude()
  @ApiHideProperty()
  transactions: Transaction[];

  constructor(partial: Partial<VendorResponseDto>) {
    Object.assign(this, partial);
  }
}
