import { Module } from '@nestjs/common';
import { AnonUserController } from './anon-user.controller';
import { AnonUserService } from './anon-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnonUser } from './entities/anon-user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnonUser])],
  controllers: [AnonUserController],
  providers: [AnonUserService],
})
export class AnonUserModule {}
