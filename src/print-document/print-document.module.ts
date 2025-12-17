import { Module } from '@nestjs/common';
import { DocumentService } from './print-document.service';
import { DocumentController } from './print-document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/print-document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [TypeOrmModule, DocumentService],
})
export class DocumentModule {}
