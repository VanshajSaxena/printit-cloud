import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentRequestDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsString()
  contentType: string;

  constructor(partial: Partial<CreateDocumentRequestDto>) {
    Object.assign(this, partial);
  }
}
