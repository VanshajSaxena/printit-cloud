import { PrintDocument } from 'src/print-document/entities/print-document.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PrintTransaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Vendor, (vendor) => vendor.printTransactions)
  vendor: Vendor;

  @ManyToOne(() => Printer, (printer) => printer.printTransactions, {
    nullable: true,
  })
  printer: Printer | null;

  @OneToMany(
    () => PrintDocument,
    (printDocument) => printDocument.printTransaction,
  )
  printDocuments: PrintDocument[];
}
