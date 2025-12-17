import { Transaction } from 'src/print-transaction/entities/print-transaction.entity';
import { DocumentStatus } from '../enums/document-status.enum';
import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Exclude()
export class DocumentResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  path: string;

  @Expose()
  status: DocumentStatus;

  @Expose()
  configuration: string | null;

  @Exclude()
  @ApiHideProperty()
  printTransaction: Transaction;
}
