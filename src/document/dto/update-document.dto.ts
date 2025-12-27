import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentRequestDto } from './create-document-request.dto';

export class UpdateDocumentDto extends PartialType(CreateDocumentRequestDto) {}
