import { PrintDocument } from 'src/print-document/entities/print-document.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TransactionStatus } from '../enums/transaction-status.enum';

@Entity()
export class PrintTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', {
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @ManyToOne(() => Vendor, (vendor) => vendor.printTransactions)
  vendor: Vendor;

  @ManyToOne(() => Printer, (printer) => printer.printTransactions, {
    nullable: true,
  })
  printer: Printer | null;

  @OneToMany(
    () => PrintDocument,
    (printDocument) => printDocument.printTransaction,
  )
  printDocuments: PrintDocument[];
}
