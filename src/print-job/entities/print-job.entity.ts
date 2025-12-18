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
import { OutputColor } from '../enums/print-job.enum';

@Entity()
export class PrintJob {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('enum', { enum: OutputColor, default: OutputColor.MONOCHROME })
  outputColor: OutputColor;

  @Column({ type: 'int', default: 1 })
  @Check('"copy_count" > 0')
  copyCount: number;

  @ManyToOne(() => Document)
  document: Document;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
