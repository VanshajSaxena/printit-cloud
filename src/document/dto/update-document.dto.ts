import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentRequestDto } from './create-document-request.dto';
import { DocumentStatus } from '../enum/document-status.enum';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UpdateDocumentRequestDto extends PartialType(
  CreateDocumentRequestDto,
) {
  @Expose()
  status: DocumentStatus;
}
