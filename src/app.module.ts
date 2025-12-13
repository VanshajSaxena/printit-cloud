import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/vendor.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrinterModule } from './printer/printer.module';
import { PrintTransactionModule } from './print-transaction/print-transaction.module';
import { PrintDocumentModule } from './print-document/print-document.module';
import { NotificationsGateway } from './notifications/notifications.gateway';
import { LoggerModule } from './logger/logger.module';
import { R2Module } from './r2/r2.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize:
          configService.get<string>('NODE_ENV') === 'development' &&
          configService.get<boolean>('DB_SYNCHRONIZE'),
        logging: 'all',
        maxQueryExecutionTime: 1000,
      }),
      inject: [ConfigService],
    }),
    VendorModule,
    PrinterModule,
    PrintTransactionModule,
    PrintDocumentModule,
    LoggerModule,
    R2Module,
  ],
  controllers: [AppController],
  providers: [AppService, NotificationsGateway],
})
export class AppModule {}
