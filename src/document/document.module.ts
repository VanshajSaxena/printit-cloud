import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from './entities/document.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), LoggerModule],
  controllers: [DocumentController],
  providers: [DocumentService],
  exports: [TypeOrmModule, DocumentService],
})
export class DocumentModule {}
