import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
} from 'class-validator';
import { CreateJobRequestDto } from 'src/job/dto/create-job-request.dto';

export class CreateTransactionRequestDto {
  @IsNotEmpty()
  @IsNumber()
  vendorId: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested()
  jobs: CreateJobRequestDto[];
}
