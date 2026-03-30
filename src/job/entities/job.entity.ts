import { StatusEnum } from 'src/common/types/status-enum';
import { Document } from 'src/document/entities/document.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OutputColor } from '../enums/job.enum';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: OutputColor, default: OutputColor.MONOCHROME })
  outputColor: OutputColor;

  @Column({ type: 'int', default: 1 })
  @Check('"copy_count" > 0')
  copyCount: number;

  @Column('enum', {
    enum: StatusEnum,
    enumName: 'status_enum',
    default: StatusEnum.PENDING,
  })
  status: StatusEnum;

  @ManyToOne(() => Transaction)
  transaction: Transaction;

  @ManyToOne(() => Document)
  document: Document;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
