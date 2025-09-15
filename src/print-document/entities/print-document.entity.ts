import { PrintTransaction } from 'src/print-transaction/entities/print-transaction.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DocumentStatus } from '../enums/document-status.enum';

@Entity()
export class PrintDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column('enum', { enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @Column({ type: 'json', nullable: true })
  configuration: string | null;

  @ManyToOne(
    () => PrintTransaction,
    (printTransaction) => printTransaction.printDocuments,
  )
  printTransaction: PrintTransaction;
}
