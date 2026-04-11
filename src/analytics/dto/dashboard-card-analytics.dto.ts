import { Expose } from 'class-transformer';

@Expose()
export class DashboardCardAnalytics {
  todaySheets: number;
  yesterdaySheets: number;
  sheetPercentageChange: number | null;

  todayOrders: number;
  yesterdayOrders: number;
  orderPercentageChange: number | null;

  totalUsers: number;
  todayUsers: number;
  yesterdayUsers: number;
  userPercentageChange: number | null;
  todayNewUsers: number;
  yesterdayNewUsers: number;
  constructor(partial: Partial<DashboardCardAnalytics>) {
    Object.assign(this, partial);
  }
}
