import { IsEnum, IsOptional } from 'class-validator';
import { StatusEnum } from 'src/common/types/status-enum';

export class UpdateJobStatusDto {
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
