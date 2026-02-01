import { ArrayMinSize, IsArray } from 'class-validator';

export class DownloadFileBatchRequestDto {
  @IsArray()
  @ArrayMinSize(1)
  ids: number[];
}
