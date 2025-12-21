import { Expose, Exclude, Type } from 'class-transformer';
import { UploadFileResponseDto } from './upload-file-response.dto';

@Exclude()
export class UploadFileBatchResponseDto {
  @Expose()
  @Type(() => UploadFileResponseDto)
  signedUrls: UploadFileResponseDto[];

  constructor(partial: Partial<UploadFileBatchResponseDto>) {
    Object.assign(this, partial);
  }
}
