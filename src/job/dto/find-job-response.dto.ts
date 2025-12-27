import { Exclude, Expose } from 'class-transformer';
import { OutputColor } from '../enums/job.enum';

@Exclude()
export class FindJobResponseDto {
  @Expose()
  documentId: number;

  @Expose()
  outputColor: OutputColor;

  @Expose()
  copyCount: number;

  constructor(partial: Partial<FindJobResponseDto>) {
    Object.assign(this, partial);
  }
}
