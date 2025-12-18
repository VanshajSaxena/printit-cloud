import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsString()
  key: string;

  @IsString()
  contentType: string | undefined;
}
