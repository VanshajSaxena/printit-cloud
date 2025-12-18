import { PrintJob } from 'src/print-job/entities/print-job.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column()
  key: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  contentType: string | null;

  @OneToMany(() => PrintJob, (printJob) => printJob.document)
  jobs: PrintJob[];

  @ManyToOne(() => Transaction, (transaction) => transaction.documents)
  transaction: Transaction;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
