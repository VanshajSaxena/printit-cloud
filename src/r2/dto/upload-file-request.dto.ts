import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileRequestDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsString()
  contentType: string;
}
