import { Module } from '@nestjs/common';
import { PrintJobService } from './print-job.service';
import { PrintJobController } from './print-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintJob } from './entities/print-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintJob])],
  controllers: [PrintJobController],
  providers: [PrintJobService],
})
export class PrintJobModule {}
