import { Module } from '@nestjs/common';
import { PrintJobService } from './print-job.service';
import { PrintJobController } from './print-job.controller';

@Module({
  controllers: [PrintJobController],
  providers: [PrintJobService],
})
export class PrintJobModule {}
