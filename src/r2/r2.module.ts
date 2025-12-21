import { Module } from '@nestjs/common';
import { R2Service } from './r2.service';
import { R2Controller } from './r2.controller';
import { DocumentModule } from 'src/document/document.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  controllers: [R2Controller],
  providers: [R2Service],
  imports: [DocumentModule, LoggerModule],
})
export class R2Module {}
