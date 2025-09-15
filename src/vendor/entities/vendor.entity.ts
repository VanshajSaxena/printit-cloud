import { PrintTransaction } from 'src/print-transaction/entities/print-transaction.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ type: 'varchar', nullable: true })
  givenName: string | null;

  @Column({ unique: true })
  email: string;

  @Column()
  sub: string;

  @Column({ unique: true })
  urlId: string; // URL-safe unique identifier

  @OneToMany(() => Printer, (printer) => printer.vendor)
  printers: Printer[];

  @OneToMany(() => PrintTransaction, (transaction) => transaction.vendor)
  printTransactions: PrintTransaction[];
}
