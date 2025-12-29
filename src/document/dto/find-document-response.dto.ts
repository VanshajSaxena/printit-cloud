import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Exclude()
export class FindDocumentResponseDto {
  @Expose()
  id: number;

  @Expose()
  filename: string;

  @Expose()
  contentType: string;

  @Exclude()
  @ApiHideProperty()
  key: string;

  @Exclude()
  @ApiHideProperty()
  transaction: Transaction;

  constructor(partial: Partial<FindDocumentResponseDto>) {
    Object.assign(this, partial);
  }
}
