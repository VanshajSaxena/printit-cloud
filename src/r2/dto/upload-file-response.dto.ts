import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UploadFileResponseDto {
  @Expose()
  url: string;

  @Expose()
  key: string;

  constructor(partial: Partial<UploadFileResponseDto>) {
    Object.assign(this, partial);
  }
}
