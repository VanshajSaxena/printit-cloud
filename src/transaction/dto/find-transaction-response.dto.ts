import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { StatusEnum } from 'src/common/types/status-enum';
import { FindJobResponseDto } from 'src/job/dto/find-job-response.dto';
import { Printer } from 'src/printer/entities/printer.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Exclude()
export class FindTransactionResponseDto {
  @Expose()
  id: number;

  @Expose()
  status: StatusEnum;

  @Expose()
  friendlyId: string;

  @Expose()
  @Type(() => FindJobResponseDto)
  jobs: FindJobResponseDto[];

  @Expose()
  createdAt: Date;

  @Exclude()
  @ApiHideProperty()
  updatedAt: Date;

  @Exclude()
  @ApiHideProperty()
  vendor: Vendor;

  @Exclude()
  @ApiHideProperty()
  printer: Printer | null;

  constructor(partial: Partial<FindTransactionResponseDto>) {
    Object.assign(this, partial);
  }
}
