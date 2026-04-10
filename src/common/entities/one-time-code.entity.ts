import { Vendor } from 'src/vendor/entities/vendor.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('one_time_codes')
export class OneTimeCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  vendorId: number;

  @ManyToOne(() => Vendor, { onDelete: 'CASCADE' })
  vendor: Vendor;

  @Column({ type: 'timestamptz' })
  expiresAt: Date;
}
