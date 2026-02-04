import { Exclude, Expose, Type } from 'class-transformer';
import { OutputColor } from '../enums/job.enum';
import { CreateDocumentResponseDto } from 'src/document/dto/create-document-response.dto';

@Exclude()
export class CreateJobResponseDto {
  @Expose()
  id: number;

  @Expose()
  outputColor: OutputColor;

  @Expose()
  copyCount: number;

  @Expose()
  @Type(() => CreateDocumentResponseDto)
  document: CreateDocumentResponseDto;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  constructor(partial: Partial<CreateJobResponseDto>) {
    Object.assign(this, partial);
  }
}
