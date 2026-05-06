import { Exclude, Expose, Type } from 'class-transformer';
import { FindTransactionResponseDto } from './find-transaction-response.dto';
import { PaginatedMetadataDto } from 'src/common/dto/paginated-metadata.dto';

@Exclude()
export class PaginatedFindTransactionResponseDto {
  @Expose()
  @Type(() => FindTransactionResponseDto)
  data: FindTransactionResponseDto[];

  @Expose()
  @Type(() => PaginatedMetadataDto)
  meta: PaginatedMetadataDto;

  constructor(partial: Partial<PaginatedFindTransactionResponseDto>) {
    Object.assign(this, partial);
  }
}
