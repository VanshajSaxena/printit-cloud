import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from 'src/common/types/status-enum';

export class UpdateTransactionDto {
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsOptional()
  @IsString()
  reason?: string;
}
