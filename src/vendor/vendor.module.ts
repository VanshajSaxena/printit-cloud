import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor]), LoggerModule],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [TypeOrmModule],
})
export class VendorModule {}
