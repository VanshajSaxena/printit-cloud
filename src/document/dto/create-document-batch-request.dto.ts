import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  ValidateNested,
} from 'class-validator';
import { CreateDocumentRequestDto } from './create-document-request.dto';
import { Type } from 'class-transformer';

export class CreateDocumentBatchRequestDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateDocumentRequestDto)
  documents: CreateDocumentRequestDto[];
}
