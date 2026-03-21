import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from 'src/document/document.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { Job } from './entities/job.entity';
import { JobController } from './job.controller';
import { JobService } from './job.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Job]),
    DocumentModule,
    NotificationsModule,
  ],
  controllers: [JobController],
  providers: [JobService],
  exports: [TypeOrmModule, JobService],
})
export class JobModule {}
