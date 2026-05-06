import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { StatusEnum } from 'src/common/types/status-enum';

export class FindTransactionsQueryDto {
  @IsOptional()
  @IsEnum(StatusEnum, { each: true })
  statuses?: StatusEnum[];

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(50)
  pageSize?: number;
}
