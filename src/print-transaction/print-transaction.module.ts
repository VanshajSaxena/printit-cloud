import { Module } from '@nestjs/common';
import { PrintTransactionService } from './print-transaction.service';
import { PrintTransactionController } from './print-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintTransaction } from './entities/print-transaction.entity';
import { PrinterModule } from 'src/printer/printer.module';
import { PrintDocumentModule } from 'src/print-document/print-document.module';
import { VendorModule } from 'src/vendor/vendor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrintTransaction]),
    PrinterModule,
    PrintDocumentModule,
    VendorModule,
  ],
  controllers: [PrintTransactionController],
  providers: [PrintTransactionService],
})
export class PrintTransactionModule {}
