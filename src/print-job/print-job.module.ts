import { Module } from '@nestjs/common';
import { JobService } from './print-job.service';
import { JobController } from './print-job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/print-job.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Job])],
  controllers: [JobController],
  providers: [JobService],
})
export class JobModule {}
