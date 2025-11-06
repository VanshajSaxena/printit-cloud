import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsJSON } from 'class-validator';
import { PrintTransaction } from 'src/print-transaction/entities/print-transaction.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Exclude()
export class PrinterResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  @IsJSON()
  capabilities: string;

  @Exclude()
  @ApiHideProperty()
  vendor: Vendor;

  @Exclude()
  @ApiHideProperty()
  printTransactions: PrintTransaction[];

  constructor(partial: Partial<PrinterResponseDto>) {
    Object.assign(this, partial);
  }
}
