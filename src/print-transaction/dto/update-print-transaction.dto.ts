import { PartialType } from '@nestjs/mapped-types';
import { CreatePrintTransactionDto } from './create-print-transaction.dto';

export class UpdatePrintTransactionDto extends PartialType(CreatePrintTransactionDto) {}
