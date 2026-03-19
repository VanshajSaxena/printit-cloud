import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class ApplicationLogger extends ConsoleLogger {
  constructor() {
    const isCloud =
      !!process.env.RAILWAY_ENVIRONMENT_NAME ||
      process.env.NODE_ENV === 'production';
    super({
      json: isCloud,
      compact: true,
      timestamp: true,
    });
  }
}
