import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UploadFileRequestDto } from './upload-file-request.dto';

export class UploadFileBatchRequestDto {
  @ValidateNested()
  @IsArray()
  @Type(() => UploadFileRequestDto)
  files: UploadFileRequestDto[];
}
