import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Printer } from 'src/printer/entities/printer.entity';

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
