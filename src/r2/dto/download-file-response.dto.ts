import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class DownloadFileResponseDto {
  @Expose()
  url: string;

  constructor(partial: Partial<DownloadFileResponseDto>) {
    Object.assign(this, partial);
  }
}
