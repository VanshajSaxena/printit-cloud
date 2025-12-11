import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DownloadFileDto {
  @IsNotEmpty()
  @IsString()
  key: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}
