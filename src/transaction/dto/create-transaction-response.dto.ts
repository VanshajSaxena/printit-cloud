import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { StatusEnum } from 'src/common/types/status-enum';
import { CreateJobResponseDto } from 'src/job/dto/create-job-response.dto';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Exclude()
export class CreateTransactionResponseDto {
  @Expose()
  id: number;

  @Expose()
  status: StatusEnum;

  @Expose()
  friendlyId: string;

  @Expose()
  @Type(() => CreateJobResponseDto)
  jobs: CreateJobResponseDto[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  vendorId: number;

  @Exclude()
  @ApiHideProperty()
  vendor: Vendor;

  @Exclude()
  @ApiHideProperty()
  printer: Printer | null;

  constructor(partial: Partial<CreateTransactionResponseDto>) {
    Object.assign(this, partial);
  }
}
