import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document-request.dto';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {}
