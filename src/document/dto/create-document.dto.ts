import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsString()
  key: string;

  @IsString()
  @IsOptional()
  contentType: string | undefined;
}
