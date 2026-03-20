import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionRequestDto } from './create-transaction-request.dto';
import { Optional } from '@nestjs/common';
import { TransactionStatus } from '../enums/transaction-status.enum';

export class UpdateTransactionDto extends PartialType(
  CreateTransactionRequestDto,
) {
  @Optional()
  status: TransactionStatus;
}
