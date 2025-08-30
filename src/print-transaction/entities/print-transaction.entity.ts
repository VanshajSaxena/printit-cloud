import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PrintTransaction {
  @PrimaryGeneratedColumn()
  id: number;
}
