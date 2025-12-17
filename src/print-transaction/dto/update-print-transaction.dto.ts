import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './create-print-transaction.dto';

export class UpdateTransactionDto extends PartialType(
  CreateTransactionDto,
) {}
