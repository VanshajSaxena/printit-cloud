import { PrintDocument } from 'src/print-document/entities/print-document.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PrintTransactionResponseDto {
  @Expose()
  id: number;

  @Expose()
  status: TransactionStatus;

  @Expose()
  friendlyId: string;

  @Expose()
  printDocuments: PrintDocument[];

  @Exclude()
  vendor: Vendor;

  @Exclude()
  printer: Printer | null;
}
