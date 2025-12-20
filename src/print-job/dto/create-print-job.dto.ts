import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { OutputColor } from '../enums/print-job.enum';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  documentKey: string;

  @IsEnum(OutputColor)
  outputColor: OutputColor;

  @IsInt()
  copyCount: number;
}
