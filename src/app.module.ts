import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/vendor.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrinterModule } from './printer/printer.module';
import { PrintTransactionModule } from './print-transaction/print-transaction.module';
import { PrintDocumentModule } from './print-document/print-document.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
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
        synchronize: configService.get<boolean>('SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
    VendorModule,
    PrinterModule,
    PrintTransactionModule,
    PrintDocumentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
