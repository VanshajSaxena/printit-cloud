import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateJobRequestDto } from 'src/job/dto/create-job-request.dto';

export class CreateTransactionRequestDto {
  @IsNotEmpty()
  @IsInt()
  vendorId: number;

  @IsNotEmpty()
  @ArrayMinSize(1)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJobRequestDto)
  jobs: CreateJobRequestDto[];
}
