import { IsJSON, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrinterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsJSON()
  capabilities: string;

  @IsNotEmpty()
  @IsNumber()
  vendorId: number;
}
