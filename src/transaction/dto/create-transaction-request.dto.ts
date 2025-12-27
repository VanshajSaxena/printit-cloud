import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateJobRequestDto } from 'src/job/dto/create-job-request.dto';

export class CreateTransactionRequestDto {
  @IsNotEmpty()
  @IsNumber()
  vendorId: number;

  @IsOptional()
  @IsNumber()
  printerId?: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested()
  jobs: CreateJobRequestDto[];
}
