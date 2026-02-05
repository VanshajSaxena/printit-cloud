import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { LoggerModule } from 'src/logger/logger.module';
import { PresenceModule } from 'src/presence/presence.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor]), LoggerModule, PresenceModule],
  controllers: [VendorController],
  providers: [VendorService],
  exports: [TypeOrmModule, VendorService],
})
export class VendorModule {}
