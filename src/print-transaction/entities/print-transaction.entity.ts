import { PrintDocument } from 'src/print-document/entities/print-document.entity';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne(
    () => PrintDocument,
    (printDocument) => printDocument.printTransaction,
  )
  printDocuments: PrintDocument[];
}
