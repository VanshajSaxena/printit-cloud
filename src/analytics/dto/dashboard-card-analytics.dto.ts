import { Expose } from 'class-transformer';

@Expose()
export class DashboardCardAnalytics {
  todaySheets: number;
  yesterdaySheets: number;
  sheetPercentageChange: number | null;

  todayOrders: number;
  yesterdayOrders: number;
  orderPercentageChange: number | null;

  todayUsers: number;
  yesterdayUsers: number;
  userPercentageChange: number | null;
  constructor(partial: Partial<DashboardCardAnalytics>) {
    Object.assign(this, partial);
  }
}
