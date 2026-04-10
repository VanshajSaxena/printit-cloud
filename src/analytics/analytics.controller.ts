import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard/cards')
  findOne() {
    return this.analyticsService.getDashboardCardAnalytics();
  }
}
