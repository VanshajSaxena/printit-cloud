import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { PrinterModule } from 'src/printer/printer.module';
import { DocumentModule } from 'src/document/document.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction]),
    PrinterModule,
    DocumentModule,
    VendorModule,
    LoggerModule,
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TypeOrmModule, TransactionService],
})
export class TransactionModule {}
