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

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'jsonb' })
  capabilities: Record<string, unknown>;

  @ManyToOne(() => Vendor, (vendor) => vendor.printers)
  vendor: Vendor;

  @OneToMany(() => PrintTransaction, (transaction) => transaction.printer)
  printTransactions: PrintTransaction[];
}
