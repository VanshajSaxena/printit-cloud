import { ArrayMinSize, IsArray } from 'class-validator';

export class UploadFileBatchRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  ids: number[];
}
