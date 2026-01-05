import { Expose, Exclude, Type } from 'class-transformer';
import { DownloadFileResponseDto } from './download-file-response.dto';

@Exclude()
export class DownloadFileBatchResponseDto {
  @Expose()
  @Type(() => DownloadFileResponseDto)
  signedUrls: DownloadFileResponseDto[];

  constructor(partial: Partial<DownloadFileBatchResponseDto>) {
    Object.assign(this, partial);
  }
}
