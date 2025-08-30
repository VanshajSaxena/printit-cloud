import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PrintDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  status: string;

  @Column({ length: 500 })
  outputConfiguration: string;
}
