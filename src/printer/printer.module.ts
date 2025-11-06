import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { PrinterController } from './printer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from './entities/printer.entity';
import { VendorModule } from 'src/vendor/vendor.module';

@Module({
  imports: [TypeOrmModule.forFeature([Printer]), VendorModule],
  controllers: [PrinterController],
  providers: [PrinterService],
  exports: [TypeOrmModule, PrinterService],
})
export class PrinterModule {}
