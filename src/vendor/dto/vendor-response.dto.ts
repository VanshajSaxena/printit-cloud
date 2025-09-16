import { Exclude, Expose } from 'class-transformer';
import { PrintTransaction } from 'src/print-transaction/entities/print-transaction.entity';
import { Printer } from 'src/printer/entities/printer.entity';

@Exclude()
export class VendorResponseDto {
  @Expose()
  id: number;

  @Expose()
  firstname: string;

  @Expose()
  lastname: string;

  @Expose()
  givenName: string | null;

  @Expose()
  urlId: string;

  @Exclude()
  email: string;

  @Exclude()
  sub: string;

  @Exclude()
  printers: Printer[];

  @Exclude()
  printTransactions: PrintTransaction[];

  constructor(partial: Partial<VendorResponseDto>) {
    Object.assign(this, partial);
  }
}
