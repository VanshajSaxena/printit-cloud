import { Transform, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { StatusEnum } from 'src/common/types/status-enum';

export class FindTransactionsQueryDto {
  @IsOptional()
  @IsEnum(StatusEnum, { each: true })
  @Transform(({ value }): StatusEnum[] => {
    if (Array.isArray(value)) return value as StatusEnum[];
    if (typeof value === 'string') return [value as StatusEnum];
    return [];
  })
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
