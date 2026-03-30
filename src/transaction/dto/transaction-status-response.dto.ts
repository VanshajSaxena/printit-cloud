import { Exclude, Expose } from 'class-transformer';
import { StatusEnum } from 'src/common/types/status-enum';

@Exclude()
export class TransactionStatusResponseDto {
  @Expose()
  status: StatusEnum;
}
