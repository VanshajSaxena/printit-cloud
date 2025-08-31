export class CreatePrintTransactionDto {
  vendorId: number;
  printerId?: number;
  printDocumentIds: number[];
}
