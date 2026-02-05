import { Module } from '@nestjs/common';
import { LoggerModule } from 'src/logger/logger.module';
import { NotificationsGateway } from './notifications.gateway';
import { PresenceModule } from 'src/presence/presence.module';

@Module({
  imports: [LoggerModule, PresenceModule],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
