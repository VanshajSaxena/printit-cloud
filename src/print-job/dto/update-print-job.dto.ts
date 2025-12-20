import { PartialType } from '@nestjs/swagger';
import { CreateJobDto } from './create-print-job.dto';

export class UpdateJobDto extends PartialType(CreateJobDto) {}
