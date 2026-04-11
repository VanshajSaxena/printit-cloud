import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DashboardCardAnalytics } from './dto/dashboard-card-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}
  async getDashboardCardAnalytics(
    vendorId: number,
  ): Promise<DashboardCardAnalytics> {
    const result = await this.dataSource.query<DashboardCardAnalytics[]>(
      `
      with stats as (
        select
          coalesce(
            sum(
              case when j.created_at >= date_trunc('day', now()) then j.copy_count * d.page_count else 0 end
            ),
            0
          ) as "todaySheets",
          coalesce(
            sum(
              case when j.created_at < date_trunc('day', now()) then j.copy_count * d.page_count else 0 end
            ),
            0
          ) as "yesterdaySheets"
        from
          job j
          join transaction t on j.transaction_id = t.id
          join document d on j.document_id = d.id
        where
          t.vendor_id = $1
          and j.created_at >= date_trunc('day', now()) - interval '1 day'
          and j.created_at < date_trunc('day', now()) + interval '1 day'
      )
      select
        "todaySheets",
        "yesterdaySheets",
        case when "yesterdaySheets" = 0 then null else (
          "todaySheets" - "yesterdaySheets"
        ) * 100.0 / "yesterdaySheets" end as "percentageChange"
      from
        stats;
      `,
      [vendorId],
    );

    const row = result[0];

    return new DashboardCardAnalytics({
      todaySheets: row.todaySheets,
      yesterdaySheets: row.yesterdaySheets,
      percentageChange:
        row.percentageChange !== null ? row.percentageChange : null,
    });
  }
}
