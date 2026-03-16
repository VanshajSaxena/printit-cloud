import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class CreateDocumentResponseDto {
  @Expose()
  id: number;

  @Expose()
  filename: string;

  @Expose()
  contentType: string;

  @Expose()
  draftId: string;

  @Expose()
  pageCount: number;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  @ApiHideProperty()
  key: string;

  constructor(partial: Partial<CreateDocumentResponseDto>) {
    Object.assign(this, partial);
  }
}
