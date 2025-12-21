import { Module } from '@nestjs/common';
import { ApplicationLogger } from './application-logger.service';

@Module({
  providers: [ApplicationLogger],
  exports: [ApplicationLogger],
})
export class LoggerModule {}
