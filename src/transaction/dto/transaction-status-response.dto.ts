import { Exclude, Expose } from 'class-transformer';
import { TransactionStatus } from '../enums/transaction-status.enum';

@Exclude()
export class TransactionStatusResponseDto {
  @Expose()
  status: TransactionStatus;
}
