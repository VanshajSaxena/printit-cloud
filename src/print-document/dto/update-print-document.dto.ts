import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-print-document.dto';

export class UpdateDocumentDto extends PartialType(
  CreateDocumentDto,
) {}
