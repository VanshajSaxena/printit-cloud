import { IsNotEmpty } from 'class-validator';

export class CreatePrintTransactionDto {
  @IsNotEmpty()
  vendorId: number;

  printerId?: number;

  @IsNotEmpty()
  printDocumentIds: number[];
}
