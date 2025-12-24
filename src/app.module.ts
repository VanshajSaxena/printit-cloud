import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategy';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './logger/logger.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { DocumentModule } from './document/document.module';
import { TransactionModule } from './transaction/transaction.module';
import { PrinterModule } from './printer/printer.module';
import { R2Module } from './r2/r2.module';
import { VendorModule } from './vendor/vendor.module';
import { JobModule } from './job/job.module';

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
          logging:
            configService.get<string>('NODE_ENV') !== 'production'
              ? ['warn', 'error']
              : 'all',
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
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}
