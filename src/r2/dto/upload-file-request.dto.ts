import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UploadFileRequestDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsOptional()
  @IsString()
  contentType?: string;
}
