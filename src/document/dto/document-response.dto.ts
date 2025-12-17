import { Transaction } from 'src/transaction/entities/transaction.entity';
import { ColorMode, DocumentStatus } from '../enums/document-status.enum';
import { Exclude, Expose } from 'class-transformer';
import { ApiHideProperty } from '@nestjs/swagger';

@Exclude()
export class DocumentResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  key: string;

  @Expose()
  status: DocumentStatus;

  @Exclude()
  @ApiHideProperty()
  colorMode: ColorMode;

  @Exclude()
  @ApiHideProperty()
  copies: number;

  @Exclude()
  @ApiHideProperty()
  transaction: Transaction;
}
