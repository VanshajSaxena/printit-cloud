import { Document } from 'src/document/entities/document.entity';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ColorMode } from '../enums/print-job.enum';

@Entity()
export class PrintJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: ColorMode, default: ColorMode.MONOCHROME })
  colorMode: ColorMode;

  @Column({ type: 'int', default: 1 })
  @Check('"copies" > 0')
  copies: number;

  @ManyToOne(() => Document)
  document: Document;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
