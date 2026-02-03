import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateDocumentRequestDto } from './create-document-request.dto';

export class CreateDocumentBatchRequestDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  documents: CreateDocumentRequestDto[];
}
