import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  getDashboardCardAnalytics() {
    return `This action returns a analytics`;
  }
}
