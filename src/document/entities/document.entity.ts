import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColorMode, DocumentStatus } from '../enums/document-status.enum';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column()
  key: string;

  @Column({ nullable: true })
  contentType: string;

  @Column('enum', { enum: DocumentStatus, default: DocumentStatus.PENDING })
  status: DocumentStatus;

  @Column({ type: 'integer', nullable: true })
  copies: number | null;

  @Column('enum', {
    enum: ColorMode,
    default: ColorMode.MONOCHROME,
    nullable: true,
  })
  colorMode: ColorMode | null;

  @ManyToOne(() => Transaction, (transaction) => transaction.documents)
  transaction: Transaction;
}
