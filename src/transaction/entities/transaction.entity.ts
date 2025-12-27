import { Job } from 'src/job/entities/job.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionStatus } from '../enums/transaction-status.enum';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', {
    enum: TransactionStatus,
    default: TransactionStatus.PENDING,
  })
  status: TransactionStatus;

  @Column({ unique: true })
  friendlyId: string;

  @ManyToOne(() => Vendor, (vendor) => vendor.transactions)
  vendor: Vendor;

  @ManyToOne(() => Printer, (printer) => printer.transactions, {
    nullable: true,
  })
  printer: Printer | null;

  @OneToMany(() => Job, (job) => job.transaction)
  jobs: Job[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
