import { ApiProperty } from '@nestjs/swagger';

export class NotFoundErrorDto {
  @ApiProperty({ example: 404 })
  statusCode: number;

  @ApiProperty({ example: 'Entity not found' })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: string;
}
