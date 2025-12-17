import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { ColorMode } from '../enums/document-status.enum';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  key: string;

  @IsString()
  contentType: string | undefined;

  @IsString()
  @IsEnum(ColorMode)
  colorMode?: ColorMode;

  @IsInt()
  copies?: number;
}
