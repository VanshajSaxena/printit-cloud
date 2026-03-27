import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { JobStatus } from '../enums/job.enum';
import { CreateJobRequestDto } from './create-job-request.dto';

export class UpdateJobDto extends PartialType(CreateJobRequestDto) {
  @IsOptional()
  @IsEnum(JobStatus)
  status: JobStatus;
}
