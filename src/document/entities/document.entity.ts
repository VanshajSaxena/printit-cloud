import { Job } from 'src/job/entities/job.entity';
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

  @Column({ type: 'varchar', length: 255 })
  contentType: string;

  @OneToMany(() => Job, (job) => job.document)
  jobs: Job[];

  @ManyToOne(() => Transaction, (transaction) => transaction.documents)
  transaction: Transaction;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
