import { StatusEnum } from 'src/common/types/status-enum';
import { Job } from 'src/job/entities/job.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', {
    enum: StatusEnum,
    default: StatusEnum.PENDING,
  })
  status: StatusEnum;

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

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
