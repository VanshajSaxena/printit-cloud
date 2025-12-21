import { IsArray } from 'class-validator';

export class UploadFileBatchRequestDto {
  @IsArray()
  ids: number[];
}
