import { IsJSON, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePrinterDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsJSON()
  capabilities: Record<string, unknown>;

  @IsNotEmpty()
  @IsNumber()
  vendorId: number;
}
