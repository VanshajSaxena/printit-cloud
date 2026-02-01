import { IsEnum, IsInt, IsNotEmpty, Min } from 'class-validator';
import { OutputColor } from '../enums/job.enum';

export class CreateJobRequestDto {
  @IsInt()
  @IsNotEmpty()
  documentId: number;

  @IsEnum(OutputColor)
  outputColor: OutputColor;

  @IsInt()
  @Min(1)
  copyCount: number;

  constructor(partial: Partial<CreateJobRequestDto>) {
    Object.assign(this, partial);
  }
}
