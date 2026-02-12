import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class LocationDto {
  @ApiProperty({ example: 12.9716, nullable: true })
  @Expose()
  latitude: number | null;

  @ApiProperty({ example: 77.5946, nullable: true })
  @Expose()
  longitude: number | null;
}
