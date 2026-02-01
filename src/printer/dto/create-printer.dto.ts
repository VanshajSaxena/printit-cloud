import { IsInt, IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreatePrinterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsJSON()
  capabilities: string;

  @IsNotEmpty()
  @IsInt()
  vendorId: number;
}
