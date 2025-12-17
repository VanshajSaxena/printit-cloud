import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateTransactionDto {
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
