import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column()
  email: string;

  @Column()
  sub: string;
}
