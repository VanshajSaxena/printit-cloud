import { PrintTransaction } from 'src/print-transaction/entities/print-transaction.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PrintDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  status: string;

  @Column({ length: 500 })
  configuration: string;

  @ManyToOne(
    () => PrintTransaction,
    (printTransaction) => printTransaction.printDocuments,
  )
  printTransaction: PrintTransaction;
}
