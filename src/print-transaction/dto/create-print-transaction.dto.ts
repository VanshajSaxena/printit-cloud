import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePrintTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  vendorId: number;

  @IsOptional()
  @IsNumber()
  printerId?: number;

  @IsNotEmpty()
  @IsArray()
  documentIds: number[];
}
