import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { type Point } from 'typeorm';

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

  @Exclude()
  location: Point;

  @Expose()
  get latitude(): number | null {
    return this.location.coordinates[1] ?? null;
  }

  @Expose()
  get longitude(): number | null {
    return this.location.coordinates[0] ?? null;
  }

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
