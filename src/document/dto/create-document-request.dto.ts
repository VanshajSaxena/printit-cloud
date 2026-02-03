import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDocumentRequestDto {
  @IsNotEmpty()
  @IsString()
  filename: string;

  @IsString()
  @IsNotEmpty()
  contentType: string;

  @IsString()
  @IsNotEmpty()
  draftId: string;

  constructor(partial: Partial<CreateDocumentRequestDto>) {
    Object.assign(this, partial);
  }
}
