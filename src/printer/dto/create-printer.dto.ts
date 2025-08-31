import { IsNotEmpty } from 'class-validator';

export class CreatePrinterDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  capabilities: string;

  @IsNotEmpty()
  vendorId: number;
}
