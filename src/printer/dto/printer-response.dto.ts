import { Exclude, Expose } from 'class-transformer';
import { PrintTransaction } from 'src/print-transaction/entities/print-transaction.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Exclude()
export class PrinterResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  capabilities: string;

  @Exclude()
  vendor: Vendor;

  @Exclude()
  printTransactions: PrintTransaction[];

  constructor(partial: Partial<PrinterResponseDto>) {
    Object.assign(this, partial);
  }
}
