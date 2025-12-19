import { Module } from '@nestjs/common';
import { R2Service } from './r2.service';
import { R2Controller } from './r2.controller';
import { ConfigModule } from '@nestjs/config';
import { DocumentModule } from 'src/document/document.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  controllers: [R2Controller],
  providers: [R2Service],
  imports: [ConfigModule, DocumentModule, LoggerModule],
})
export class R2Module {}
