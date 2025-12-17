import { Transaction } from 'src/print-transaction/entities/print-transaction.entity';
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

  @Column({ type: 'json' })
  capabilities: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.printers)
  vendor: Vendor;

  @OneToMany(() => Transaction, (transaction) => transaction.printer)
  transactions: Transaction[];
}
