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
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        retryAttempts: 3,
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
        logging:
          configService.get<string>('NODE_ENV') === 'development'
            ? 'all'
            : ['warn', 'error'],
        maxQueryExecutionTime: 1000,
        namingStrategy: new SnakeNamingStrategy(),
      }),
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
