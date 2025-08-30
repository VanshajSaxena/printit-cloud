import { PartialType } from '@nestjs/mapped-types';
import { CreatePrintDocumentDto } from './create-print-document.dto';

export class UpdatePrintDocumentDto extends PartialType(
  CreatePrintDocumentDto,
) {}
