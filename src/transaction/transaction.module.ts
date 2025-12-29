import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentModule } from 'src/document/document.module';
import { JobModule } from 'src/job/job.module';
import { LoggerModule } from 'src/logger/logger.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { PrinterModule } from 'src/printer/printer.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { Transaction } from './entities/transaction.entity';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    PrinterModule,
    DocumentModule,
    VendorModule,
    LoggerModule,
    JobModule,
    NotificationsModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TypeOrmModule, TransactionService],
})
export class TransactionModule {}
