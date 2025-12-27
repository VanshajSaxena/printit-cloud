import { IsEnum, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { OutputColor } from '../enums/job.enum';

export class CreateJobRequestDto {
  @IsNumber()
  @IsNotEmpty()
  documentId: number;

  @IsEnum(OutputColor)
  outputColor: OutputColor;

  @IsInt()
  copyCount: number;

  constructor(partial: Partial<CreateJobRequestDto>) {
    Object.assign(this, partial);
  }
}
