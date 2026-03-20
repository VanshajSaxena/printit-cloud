import { Optional } from '@nestjs/common';
import { PartialType } from '@nestjs/swagger';
import { JobStatus } from '../enums/job.enum';
import { CreateJobRequestDto } from './create-job-request.dto';

export class UpdateJobDto extends PartialType(CreateJobRequestDto) {
  @Optional()
  status: JobStatus;
}
