import { Module } from '@nestjs/common';
import { JobService } from './job.service';
import { JobController } from './job.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Job } from './entities/job.entity';
import { DocumentModule } from 'src/document/document.module';

@Module({
  imports: [TypeOrmModule.forFeature([Job]), DocumentModule],
  controllers: [JobController],
  providers: [JobService],
  exports: [TypeOrmModule, JobService],
})
export class JobModule {}
