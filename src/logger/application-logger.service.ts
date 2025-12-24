import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class ApplicationLogger extends ConsoleLogger {
  constructor() {
    super({
      json: process.env.NODE_ENV === 'production',
      compact: true,
      timestamp: true,
    });
  }
}
