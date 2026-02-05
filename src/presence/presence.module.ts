import { Module } from '@nestjs/common';
import { PresenceService } from './presence.service';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [PresenceService],
  exports: [PresenceService],
})
export class PresenceModule {}
