import { IsJSON, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePrintDocumentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  path: string;

  @IsOptional()
  @IsJSON()
  configuration: string;
}
