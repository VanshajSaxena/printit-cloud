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

  @Exclude()
  @ApiHideProperty()
  key: string;
}
