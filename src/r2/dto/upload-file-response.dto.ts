import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class UploadFileResponseDto {
  @Expose()
  url: string;

  @Expose()
  id: number;

  constructor(partial: Partial<UploadFileResponseDto>) {
    Object.assign(this, partial);
  }
}
