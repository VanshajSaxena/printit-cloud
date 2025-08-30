import { Module } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { PrinterController } from './printer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from './entities/printer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Printer])],
  controllers: [PrinterController],
  providers: [PrinterService],
})
export class PrinterModule {}
