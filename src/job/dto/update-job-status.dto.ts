import { IsEnum, IsOptional } from 'class-validator';
import { JobStatus } from '../enums/job.enum';

export class UpdateJobStatusDto {
  @IsOptional()
  @IsEnum(JobStatus)
  status: JobStatus;
}
