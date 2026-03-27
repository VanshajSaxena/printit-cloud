import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { TransactionStatus } from '../enums/transaction-status.enum';
import { CreateTransactionRequestDto } from './create-transaction-request.dto';

export class UpdateTransactionDto extends PartialType(
  CreateTransactionRequestDto,
) {
  @IsOptional()
  @IsEnum(TransactionStatus)
  status: TransactionStatus;
}
