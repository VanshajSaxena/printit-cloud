import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionRequestDto } from './create-transaction-request.dto';

export class UpdateTransactionDto extends PartialType(
  CreateTransactionRequestDto,
) {}
