import { Job } from 'src/job/entities/job.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DocumentStatus } from '../enum/document-status.enum';

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  filename: string;

  @Column()
  key: string;

  @Column({ type: 'varchar', length: 255 })
  contentType: string;

  @Column({ type: 'int' })
  pageCount: number;

  @Column('enum', { enum: DocumentStatus, default: DocumentStatus.CREATED })
  status: DocumentStatus;

  @OneToMany(() => Job, (job) => job.document)
  jobs: Job[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
