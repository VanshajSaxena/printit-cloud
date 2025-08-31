import { IsNotEmpty } from 'class-validator';

export class CreatePrintDocumentDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  path: string;

  configuration: string;
}
