import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DashboardCardAnalytics } from './dto/dashboard-card-analytics.dto';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}
  async getDashboardCardAnalytics(
    vendorId: number,
  ): Promise<DashboardCardAnalytics> {
    const [sheetOrderResult, userResult] = await Promise.all([
      this.dataSource.query<
        {
          todaySheets: number;
          yesterdaySheets: number;
          todayOrders: number;
          yesterdayOrders: number;
          sheetPercentageChange: number | null;
          orderPercentageChange: number | null;
        }[]
      >(
        `
        WITH stats AS (
          SELECT
            COALESCE(
              SUM(j.copy_count * d.page_count) FILTER (
                WHERE j.created_at >= date_trunc('day', now())
              ),
              0
            ) AS "todaySheets",

            COALESCE(
              SUM(j.copy_count * d.page_count) FILTER (
                WHERE j.created_at < date_trunc('day', now())
              ),
              0
            ) AS "yesterdaySheets",

            COUNT(DISTINCT t.id) FILTER (
              WHERE t.created_at >= date_trunc('day', now())
            ) AS "todayOrders",

            COUNT(DISTINCT t.id) FILTER (
              WHERE t.created_at < date_trunc('day', now())
            ) AS "yesterdayOrders"

          FROM transaction t
          JOIN job j ON j.transaction_id = t.id
          JOIN document d ON j.document_id = d.id

          WHERE
            t.vendor_id = $1
            AND t.created_at >= date_trunc('day', now()) - interval '1 day'
            AND t.created_at < date_trunc('day', now()) + interval '1 day'
        )

        SELECT
          "todaySheets",
          "yesterdaySheets",
          "todayOrders",
          "yesterdayOrders",

          CASE
            WHEN "yesterdaySheets" = 0 THEN NULL
            ELSE ("todaySheets" - "yesterdaySheets") * 100.0 / "yesterdaySheets"
          END AS "sheetPercentageChange",

          CASE
            WHEN "yesterdayOrders" = 0 THEN NULL
            ELSE ("todayOrders" - "yesterdayOrders") * 100.0 / "yesterdayOrders"
          END AS "orderPercentageChange"

        FROM stats;
        `,
        [vendorId],
      ),

      this.dataSource.query<
        {
          totalUsers: number;
          todayUsers: number;
          yesterdayUsers: number;
          todayNewUsers: number;
          yesterdayNewUsers: number;
          userPercentageChange: number | null;
        }[]
      >(
        `WITH stats AS (
      SELECT 
        COUNT(*) AS "totalUsers",

        COUNT(*) FILTER (
          WHERE a.last_seen >= date_trunc('day', now())
            AND a.last_seen < date_trunc('day', now()) + interval '1 day'
        ) AS "todayUsers",

        COUNT(*) FILTER (
          WHERE a.last_seen >= date_trunc('day', now()) - interval '1 day'
            AND a.last_seen < date_trunc('day', now())
        ) AS "yesterdayUsers",

        COUNT(*) FILTER (
          WHERE a.first_seen >= date_trunc('day', now())
            AND a.first_seen < date_trunc('day', now()) + interval '1 day'
        ) AS "todayNewUsers",

        COUNT(*) FILTER (
          WHERE a.first_seen >= date_trunc('day', now()) - interval '1 day'
            AND a.first_seen < date_trunc('day', now())
        ) AS "yesterdayNewUsers"

      FROM anon_users a
      WHERE a.vendor_id = $1
    )

    SELECT
      "totalUsers",
      "todayUsers",
      "yesterdayUsers",
      "todayNewUsers",
      "yesterdayNewUsers",

      CASE
        WHEN "yesterdayUsers" = 0 THEN NULL
        ELSE ("todayUsers" - "yesterdayUsers") * 100.0 / "yesterdayUsers"
      END AS "userPercentageChange"

    FROM stats;`,
        [vendorId],
      ),
    ]);

    const sheetOrder = sheetOrderResult[0];
    const users = userResult[0];

    return new DashboardCardAnalytics({
      todaySheets: sheetOrder.todaySheets,
      yesterdaySheets: sheetOrder.yesterdaySheets,
      sheetPercentageChange:
        sheetOrder.sheetPercentageChange !== null
          ? sheetOrder.sheetPercentageChange
          : null,

      todayOrders: sheetOrder.todayOrders,
      yesterdayOrders: sheetOrder.yesterdayOrders,
      orderPercentageChange:
        sheetOrder.orderPercentageChange !== null
          ? sheetOrder.orderPercentageChange
          : null,

      totalUsers: users.totalUsers,

      todayUsers: users.todayUsers,
      yesterdayUsers: users.yesterdayUsers,
      userPercentageChange:
        users.userPercentageChange !== null ? users.userPercentageChange : null,

      todayNewUsers: users.todayNewUsers,
      yesterdayNewUsers: users.yesterdayNewUsers,
    });
  }
}
