import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Exclude()
export class DocumentResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  key: string;

  @Exclude()
  @ApiHideProperty()
  transaction: Transaction;
}
