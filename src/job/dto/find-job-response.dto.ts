import { Exclude, Expose, Type } from 'class-transformer';
import { FindDocumentResponseDto } from 'src/document/dto/find-document-response.dto';
import { OutputColor } from '../enums/job.enum';

@Exclude()
export class FindJobResponseDto {
  @Expose()
  id: number;

  @Expose()
  outputColor: OutputColor;

  @Expose()
  copyCount: number;

  @Expose()
  @Type(() => FindDocumentResponseDto)
  document: FindDocumentResponseDto;

  constructor(partial: Partial<FindJobResponseDto>) {
    Object.assign(this, partial);
  }
}
