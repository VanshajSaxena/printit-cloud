import { Expose } from 'class-transformer';

@Expose()
export class DashboardCardAnalytics {
  todaySheets: number;
  yesterdaySheets: number;
  percentageChange: number | null;

  constructor(partial: Partial<DashboardCardAnalytics>) {
    Object.assign(this, partial);
  }
}
