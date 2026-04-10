import { IsInt, IsString } from 'class-validator';

export class AnonUserIdentifyDto {
  @IsString()
  id: string;

  @IsInt()
  vendorId: number;

  @IsString()
  userAgent?: string;
}
