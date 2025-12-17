import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DownloadFileRequestDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}
