import { Job } from 'src/job/entities/job.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
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

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
