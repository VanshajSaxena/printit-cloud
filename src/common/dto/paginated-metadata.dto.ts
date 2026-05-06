import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PaginatedMetadataDto {
  @Expose()
  page: number;

  @Expose()
  pageSize: number;

  @Expose()
  total: number;

  @Expose()
  totalPages: number;
}
