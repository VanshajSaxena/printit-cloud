import { Injectable } from '@nestjs/common';
import { ApplicationLogger } from './logger/application-logger.service';

@Injectable()
export class AppService {
  private environment?: string;
  constructor(private readonly logger: ApplicationLogger) {
    this.logger.setContext(AppService.name);
    this.environment =
      process.env.NODE_ENV === 'production' ? 'production' : 'development';
  }
  ping(): string {
    this.logger.log(`Application running in ${this.environment} mode.`);
    return 'Printly is running...';
  }
}
