import { Document } from 'src/print-document/entities/print-document.entity';
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

  @Column({ unique: true })
  friendlyId: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.printTransactions)
  vendor: Vendor;

  @ManyToOne(() => Printer, (printer) => printer.printTransactions, {
    nullable: true,
  })
  printer: Printer | null;

  @OneToMany(
    () => Document,
    (document) => document.printTransaction,
  )
  documents: Document[];
}
