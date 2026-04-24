import { IsEnum } from 'class-validator';
import { StatusEnum } from 'src/common/types/status-enum';

export class UpdateJobStatusDto {
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
