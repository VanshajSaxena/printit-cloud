import { Exclude, Expose, Type } from 'class-transformer';
import { StatusEnum } from 'src/common/types/status-enum';
import { CreateDocumentResponseDto } from 'src/document/dto/create-document-response.dto';
import { OutputColor } from '../enums/job.enum';

@Exclude()
export class CreateJobResponseDto {
  @Expose()
  id: number;

  @Expose()
  outputColor: OutputColor;

  @Expose()
  copyCount: number;

  @Expose()
  status: StatusEnum;

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
