import { IsArray } from 'class-validator';

export class DownloadFileBatchRequestDto {
  @IsArray()
  ids: number[];
}
