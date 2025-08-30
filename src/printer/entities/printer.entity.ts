import { PrintTransaction } from 'src/print-transaction/entities/print-transaction.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Printer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ length: 500 })
  capabilities: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.printers)
  vendor: Vendor;

  @OneToMany(() => PrintTransaction, (transaction) => transaction.printer)
  printTransactions: PrintTransaction[];
}
