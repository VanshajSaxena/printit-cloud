import { IsOptional, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class NearbyQueryDto {
  @IsNumber()
  @Type(() => Number)
  lat: number;

  @IsNumber()
  @Type(() => Number)
  lng: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  range?: number;
}
