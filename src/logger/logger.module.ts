import { Module } from '@nestjs/common';
import { ApplicationLogger } from './application-logger.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [ApplicationLogger],
  exports: [ApplicationLogger],
})
export class LoggerModule {}
