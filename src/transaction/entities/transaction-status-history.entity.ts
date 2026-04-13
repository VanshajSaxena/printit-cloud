import { StatusEnum } from 'src/common/types/status-enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Transaction } from './transaction.entity';

@Entity('transaction_status_history')
export class TransactionStatusHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, (t) => t.statusHistory)
  transaction: Transaction;

  @Column('enum', { enum: StatusEnum, default: StatusEnum.PENDING })
  status: StatusEnum;

  @Column({ type: 'text', nullable: true })
  reason: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
