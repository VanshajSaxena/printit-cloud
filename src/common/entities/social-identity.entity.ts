import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class SocialIdentity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  provider: string;

  @Column()
  providerId: string;

  @Column({ nullable: true })
  email: string;

  @ManyToOne(() => Vendor, (v) => v.socialIdentities)
  vendor: Vendor;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
