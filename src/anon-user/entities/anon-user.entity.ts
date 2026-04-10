import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  Unique,
} from 'typeorm';

@Unique(['id', 'vendorId'])
@Entity('anon_users')
export class AnonUser {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamptz' })
  firstSeen: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastSeen: Date;

  @Column({ type: 'int', default: 0 })
  visitCount: number;

  @Column({ type: 'varchar', nullable: true })
  userAgent: string;

  @ManyToOne(() => Vendor)
  @JoinColumn()
  vendor: Vendor;

  @Column()
  vendorId: number;
}
