import { Controller, Get } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser, type RequestUser } from 'src/decorators/public.decorator';

@Controller({ path: 'analytics', version: '1' })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard/cards')
  findOne(@CurrentUser() user: RequestUser) {
    return this.analyticsService.getDashboardCardAnalytics(user.sub);
  }
}
