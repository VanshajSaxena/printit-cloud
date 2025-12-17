import { Module } from '@nestjs/common';
import { PrintTransactionService } from './print-transaction.service';
import { PrintTransactionController } from './print-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintTransaction } from './entities/print-transaction.entity';
import { PrinterModule } from 'src/printer/printer.module';
import { DocumentModule } from 'src/print-document/print-document.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrintTransaction]),
    PrinterModule,
    DocumentModule,
    VendorModule,
    LoggerModule,
  ],
  controllers: [PrintTransactionController],
  providers: [PrintTransactionService],
  exports: [TypeOrmModule, PrintTransactionService],
})
export class PrintTransactionModule {}
