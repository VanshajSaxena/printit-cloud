import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { LoggerModule } from 'src/logger/logger.module';
import { PresenceModule } from 'src/presence/presence.module';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [LoggerModule, PresenceModule, AuthModule],
  providers: [NotificationsGateway],
  exports: [NotificationsGateway],
})
export class NotificationsModule {}
