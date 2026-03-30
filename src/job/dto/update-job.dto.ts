import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { StatusEnum } from 'src/common/types/status-enum';
import { CreateJobRequestDto } from './create-job-request.dto';

export class UpdateJobDto extends PartialType(CreateJobRequestDto) {
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;
}
