import { Module } from '@nestjs/common';
import { PrintTransactionService } from './print-transaction.service';
import { PrintTransactionController } from './print-transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintTransaction } from './entities/print-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintTransaction])],
  controllers: [PrintTransactionController],
  providers: [PrintTransactionService],
})
export class PrintTransactionModule {}
