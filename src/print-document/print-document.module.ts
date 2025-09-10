import { Module } from '@nestjs/common';
import { PrintDocumentService } from './print-document.service';
import { PrintDocumentController } from './print-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrintDocument } from './entities/print-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrintDocument])],
  controllers: [PrintDocumentController],
  providers: [PrintDocumentService],
  exports: [TypeOrmModule, PrintDocumentService],
})
export class PrintDocumentModule {}
