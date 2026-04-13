import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from 'src/common/types/status-enum';
import { CreateTransactionRequestDto } from './create-transaction-request.dto';

export class UpdateTransactionDto extends PartialType(
  CreateTransactionRequestDto,
) {
  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsString()
  reason?: string;
}
