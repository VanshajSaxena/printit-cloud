import { Printer } from 'src/printer/entities/printer.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  type Point,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SocialIdentity } from '../../common/entities/social-identity.entity';
import { RefreshToken } from 'src/common/entities/refresh-token.entity';

@Entity('vendors')
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  displayName: string | null;

  @Column({ unique: true, length: 255 })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string | null;

  @Column({ unique: true })
  slug: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: true,
  })
  location: Point | null;

  @Column({ type: 'varchar', nullable: true, select: false })
  passwordHash: string | null;

  @Column({ default: false })
  emailVerified: boolean;

  @OneToMany(() => SocialIdentity, (s) => s.vendor)
  socialIdentities: SocialIdentity[];

  @OneToMany(() => RefreshToken, (r) => r.vendor)
  refreshTokens: RefreshToken[];

  @OneToMany(() => Printer, (printer) => printer.vendor)
  printers: Printer[];

  @OneToMany(() => Transaction, (transaction) => transaction.vendor)
  transactions: Transaction[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
