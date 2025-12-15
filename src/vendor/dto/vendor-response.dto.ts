import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { PrintTransaction } from 'src/print-transaction/entities/print-transaction.entity';
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
  address: string;

  @Expose()
  urlId: string;

  @Exclude()
  @ApiHideProperty()
  email: string;

  @Exclude()
  @ApiHideProperty()
  printers: Printer[];

  @Exclude()
  @ApiHideProperty()
  printTransactions: PrintTransaction[];

  constructor(partial: Partial<VendorResponseDto>) {
    Object.assign(this, partial);
  }
}
