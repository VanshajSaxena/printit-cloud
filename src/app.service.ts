import { Injectable } from '@nestjs/common';
import { ApplicationLogger } from './logger/application-logger.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  private environment?: string;
  constructor(
    private readonly logger: ApplicationLogger,
    private readonly configService: ConfigService,
  ) {
    this.logger.setContext(AppService.name);
    this.environment = this.configService.get<string>('NODE_ENV');
  }
  ping(): string {
    this.logger.log('Environment: ', this.environment);
    return 'Printly is running...';
  }
}
