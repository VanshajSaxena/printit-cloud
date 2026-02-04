import { Exclude, Expose, Type } from 'class-transformer';
import { CreateDocumentResponseDto } from './create-document-response.dto';

@Exclude()
export class CreateDocumentBatchResponseDto {
  @Expose()
  @Type(() => CreateDocumentResponseDto)
  documents: CreateDocumentResponseDto[];
  constructor(partial: Partial<CreateDocumentBatchResponseDto>) {
    Object.assign(this, partial);
  }
}
