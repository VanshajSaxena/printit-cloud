import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { FindJobResponseDto } from 'src/job/dto/find-job-response.dto';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';
import { TransactionStatus } from '../enums/transaction-status.enum';

@Exclude()
export class FindTransactionResponseDto {
  @Expose()
  id: number;

  @Expose()
  status: TransactionStatus;

  @Expose()
  friendlyId: string;

  @Expose()
  @Type(() => FindJobResponseDto)
  jobs: FindJobResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  @ApiHideProperty()
  vendor: Vendor;

  @Exclude()
  @ApiHideProperty()
  printer: Printer | null;
}
