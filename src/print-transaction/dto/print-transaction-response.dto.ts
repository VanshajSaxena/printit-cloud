import { Document } from 'src/print-document/entities/print-document.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Exclude()
export class PrintTransactionResponseDto {
  @Expose()
  id: number;

  @Expose()
  status: TransactionStatus;

  @Expose()
  friendlyId: string;

  @Expose()
  printDocuments: Document[];

  @Exclude()
  @ApiHideProperty()
  vendor: Vendor;

  @Exclude()
  @ApiHideProperty()
  printer: Printer | null;
}
