import { ApiProperty } from '@nestjs/swagger';

export class LocationDto {
  @ApiProperty({ example: 12.9716, nullable: true })
  latitude: number | null;

  @ApiProperty({ example: 77.5946, nullable: true })
  longitude: number | null;
}
