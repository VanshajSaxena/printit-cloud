import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsString()
  contentType: string;

  constructor(partial: Partial<CreateDocumentDto>) {
    Object.assign(this, partial);
  }
}
