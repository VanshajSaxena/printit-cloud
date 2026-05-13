import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DocumentModule } from './document/document.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JobModule } from './job/job.module';
import { LoggerModule } from './logger/logger.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PresenceModule } from './presence/presence.module';
import { PresenceService } from './presence/presence.service';
import { PrinterModule } from './printer/printer.module';
import { R2Module } from './r2/r2.module';
import { TransactionModule } from './transaction/transaction.module';
import { VendorModule } from './vendor/vendor.module';
import { AuthModule } from './auth/auth.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AnonUserModule } from './anon-user/anon-user.module';
import { DownloadController } from './download/download.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const isProduction =
          configService.get<string>('NODE_ENV') === 'production';
        const shouldSync =
          configService.get<string>('DB_SYNCHRONIZE') === 'true' ||
          !isProduction;
        return {
          retryAttempts: 3,
          type: 'postgres',
          url: configService.get<string>('DATABASE_URL'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: shouldSync,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
          logging: 'all',
          maxQueryExecutionTime: 1000,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      inject: [ConfigService],
    }),
    VendorModule,
    PrinterModule,
    TransactionModule,
    DocumentModule,
    LoggerModule,
    R2Module,
    JobModule,
    NotificationsModule,
    PresenceModule,
    AuthModule,
    AnalyticsModule,
    AnonUserModule,
  ],
  controllers: [AppController, DownloadController],
  providers: [
    AppService,
    PresenceService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
