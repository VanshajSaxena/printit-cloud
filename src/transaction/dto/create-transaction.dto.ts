import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateJobDto } from 'src/job/dto/create-job.dto';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  vendorId: number;

  @IsOptional()
  @IsNumber()
  printerId?: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  jobs: CreateJobDto[];
}
