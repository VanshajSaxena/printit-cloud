import { Module } from '@nestjs/common';
import { R2Service } from './r2.service';
import { R2Controller } from './r2.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [R2Controller],
  providers: [R2Service],
  imports: [ConfigModule],
})
export class R2Module {}
